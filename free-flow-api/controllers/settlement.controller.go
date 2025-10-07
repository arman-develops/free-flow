package controllers

import (
	"errors"
	"fmt"
	"free-flow-api/config"
	"free-flow-api/models"
	"free-flow-api/utils"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func UpsertSettlementOnTaskAssignment(c *gin.Context, task models.Task) error {
	//validate jwt
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		c.Abort()
	}

	if task.AssignedToAssociate == nil || task.TaskValue == nil {
		return nil // no associate or value, nothing to record
	}

	// Calculate expected amount based on cut percentage (from project)
	var project models.Project
	if err := config.DB.First(&project, "id = ?", &task.ProjectID).Error; err != nil {
		return err
	}

	percentage := 100 - project.YourCutPercent // e.g. 25.0
	expectedAmount := int64(*task.TaskValue * (percentage / 100.0))

	var existing models.AssociateSettlement
	err := config.DB.First(&existing, "task_id = ? AND associate_id = ?", task.ID, *task.AssignedToAssociate).Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		// Create new record
		settlement := models.AssociateSettlement{
			ProjectID:      task.ProjectID,
			TaskID:         task.ID,
			AssociateID:    *task.AssignedToAssociate,
			UserID:         uuid.MustParse(userID), // assuming preloaded
			PercentageCut:  percentage,
			ExpectedAmount: expectedAmount,
			SettledAmount:  0,
			Status:         "pending",
		}
		return config.DB.Create(&settlement).Error
	}

	if err != nil {
		return err
	}

	// Update existing (e.g. if task value changed)
	existing.ExpectedAmount = expectedAmount
	existing.PercentageCut = percentage
	existing.UpdatedAt = time.Now()

	return config.DB.Save(&existing).Error
}

func UpdateSettlementPayment(c *gin.Context) {
	type UpdateSettlementInput struct {
		SettlementID   uuid.UUID `json:"settlement_id" binding:"required"`
		SettledAmount  int64     `json:"settled_amount" binding:"required,gte=0"`
		TransactionRef string    `json:"transaction_ref" binding:"required"`
	}

	var input UpdateSettlementInput
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.SendErrorResponse(c, http.StatusBadRequest, "invalid request body")
		return
	}

	// Fetch the settlement record
	var settlement models.AssociateSettlement
	if err := config.DB.First(&settlement, "id = ?", input.SettlementID).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusNotFound, "settlement not found")
		return
	}

	// Update values
	now := time.Now()
	settlement.SettledAmount = input.SettledAmount
	settlement.TransactionRef = input.TransactionRef

	// Determine and update status
	switch {
	case input.SettledAmount == 0:
		settlement.Status = "pending"
	case input.SettledAmount < settlement.ExpectedAmount:
		settlement.Status = "partially_settled"
	default:
		settlement.Status = "settled"
		settlement.SettledAt = &now
	}

	settlement.UpdatedAt = time.Now()

	// Save changes
	if err := config.DB.Save(&settlement).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to update settlement")
		return
	}

	utils.SendSuccessResponse(c, http.StatusOK, gin.H{
		"message":    "settlement updated successfully",
		"settlement": settlement,
	})
}

func GetRecentSettlements(c *gin.Context) {
	// Validate JWT
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		c.Abort()
		return
	}

	// Custom struct for the joined response
	type PendingSettlementRecord struct {
		AssociateID    uuid.UUID  `json:"associate_id"`
		AssociateName  string     `json:"associate_name"`
		ProjectID      uuid.UUID  `json:"project_id"`
		ProjectName    string     `json:"project_name"`
		TaskID         *uuid.UUID `json:"task_id"`
		TaskTitle      *string    `json:"task_title"`
		ExpectedAmount int64      `json:"expected_amount"`
		PercentageCut  float64    `json:"percentage_cut"`
		Method         string     `json:"method"`
		Status         string     `json:"status"`
		CreatedAt      time.Time  `json:"created_at"`
	}

	var rows []PendingSettlementRecord
	err := config.DB.
		Table("associate_settlements AS s").
		Joins("LEFT JOIN associates AS a ON a.id = s.associate_id").
		Joins("LEFT JOIN projects AS p ON p.id = s.project_id").
		Joins("LEFT JOIN tasks AS t ON t.id = s.task_id").
		Select(`
			s.associate_id,
			a.name AS associate_name,
			s.project_id,
			p.name AS project_name,
			s.task_id,
			t.title AS task_title,
			s.expected_amount,
			s.percentage_cut,
			s.method,
			s.status,
			s.created_at
		`).
		Where("s.user_id = ? AND s.status = ?", userID, "pending").
		Order("a.name, p.name, s.created_at DESC").
		Scan(&rows).Error

	if err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to fetch pending settlements")
		return
	}
	type TaskInfo struct {
		TaskID         *uuid.UUID `json:"task_id"`
		TaskTitle      *string    `json:"task_title"`
		ExpectedAmount int64      `json:"expected_amount"`
		PercentageCut  float64    `json:"percentage_cut"`
		Method         string     `json:"method"`
		Status         string     `json:"status"`
		CreatedAt      time.Time  `json:"created_at"`
	}

	type ProjectInfo struct {
		ProjectID   uuid.UUID  `json:"project_id"`
		ProjectName string     `json:"project_name"`
		Tasks       []TaskInfo `json:"tasks"`
	}

	type AssociatePending struct {
		AssociateID   uuid.UUID     `json:"associate_id"`
		AssociateName string        `json:"associate_name"`
		Projects      []ProjectInfo `json:"projects"`
	}

	// Grouping
	grouped := make(map[uuid.UUID]*AssociatePending)

	for _, r := range rows {
		assoc, exists := grouped[r.AssociateID]
		if !exists {
			assoc = &AssociatePending{
				AssociateID:   r.AssociateID,
				AssociateName: r.AssociateName,
				Projects:      []ProjectInfo{},
			}
			grouped[r.AssociateID] = assoc
		}

		// find or add project
		var proj *ProjectInfo
		for i := range assoc.Projects {
			if assoc.Projects[i].ProjectID == r.ProjectID {
				proj = &assoc.Projects[i]
				break
			}
		}
		if proj == nil {
			assoc.Projects = append(assoc.Projects, ProjectInfo{
				ProjectID:   r.ProjectID,
				ProjectName: r.ProjectName,
				Tasks:       []TaskInfo{},
			})
			proj = &assoc.Projects[len(assoc.Projects)-1]
		}

		proj.Tasks = append(proj.Tasks, TaskInfo{
			TaskID:         r.TaskID,
			TaskTitle:      r.TaskTitle,
			ExpectedAmount: r.ExpectedAmount,
			PercentageCut:  r.PercentageCut,
			Method:         r.Method,
			Status:         r.Status,
			CreatedAt:      r.CreatedAt,
		})
	}

	// Convert map to slice
	var result []AssociatePending
	for _, assoc := range grouped {
		result = append(result, *assoc)
	}

	utils.SendSuccessResponse(c, http.StatusOK, result)
}

func GetSettlementHistory(c *gin.Context) {
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		c.Abort()
		return
	}

	type MonthlyHistory struct {
		MonthLabel      string `json:"month"`  // e.g. "Jan 2025"
		TotalSettled    int64  `json:"amount"` // sum of expected_amount
		SettlementCount int64  `json:"count"`  // number of records
	}

	var history []MonthlyHistory

	// Determine time range (last 6 full months)
	now := time.Now()
	startDate := now.AddDate(0, -5, 0).Truncate(24 * time.Hour) // includes this month
	startOfFirstMonth := time.Date(startDate.Year(), startDate.Month(), 1, 0, 0, 0, 0, now.Location())

	err := config.DB.
		Table("associate_settlements AS s").
		Select(`
			TO_CHAR(DATE_TRUNC('month', s.settled_at), 'Mon YYYY') AS month_label,
			COALESCE(SUM(s.expected_amount), 0) AS total_settled,
			COUNT(s.id) AS settlement_count
		`).
		Where("s.user_id = ? AND s.status = ? AND s.settled_at >= ?", userID, "settled", startOfFirstMonth).
		Group("month_label").
		Order("MIN(s.settled_at) DESC").
		Scan(&history).Error

	if err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "could not fetch settlement history")
		return
	}
	fmt.Print(history)

	utils.SendSuccessResponse(c, http.StatusOK, history)
}
