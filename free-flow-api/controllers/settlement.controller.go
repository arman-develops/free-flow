package controllers

import (
	"errors"
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

func UpdateSettlementPayment(settlementID uuid.UUID, settledAmount int64, transactionRef string) error {
	var settlement models.AssociateSettlement
	if err := config.DB.First(&settlement, "id = ?", settlementID).Error; err != nil {
		return err
	}

	// Update settlement
	settlement.SettledAmount = settledAmount
	settlement.TransactionRef = transactionRef

	// Determine status
	switch {
	case settledAmount == 0:
		settlement.Status = "pending"
	case settledAmount < settlement.ExpectedAmount:
		settlement.Status = "partially_settled"
	default:
		settlement.Status = "settled"
	}

	settlement.UpdatedAt = time.Now()

	return config.DB.Save(&settlement).Error
}
