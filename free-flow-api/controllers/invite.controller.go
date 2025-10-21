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

func InviteAssociate(task models.Task, associateID uuid.UUID, contractID uuid.UUID) error {
	invite := models.Invite{
		TaskID:      task.ID,
		ProjectID:   task.ProjectID,
		AssociateID: associateID,
		ContractID:  contractID,
		Status:      "pending",
		CreatedAt:   time.Now(),
	}

	if err := config.DB.Create(&invite).Error; err != nil {
		return fmt.Errorf("failed to create invite: %w", err)
	}

	// generate invite token
	token, err := config.GenerateInviteToken(invite.ID.String(), associateID.String(), contractID.String(), task.ID.String(), 72*time.Hour)
	if err != nil {
		return err
	}

	//send mail to associate right after
	fmt.Println(token)

	return nil
}

func InviteResponse(c *gin.Context) {
	userID := c.GetString("associateID")
	inviteID := c.GetString("invite_id")

	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		return
	}

	var input struct {
		Status string `json:"status" binding:"required,oneof=accepted declined"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.SendErrorResponse(c, http.StatusBadRequest, "invalid request body")
		return
	}

	var invite models.Invite
	if err := config.DB.First(&invite, "id = ?", inviteID).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusNotFound, "invite not found")
		return
	}

	invite.Status = input.Status
	invite.RespondedAt = time.Now()

	tx := config.DB.Begin()
	if tx.Error != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to start transaction")
		return
	}

	if err := tx.Save(&invite).Error; err != nil {
		tx.Rollback()
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to update invite")
		return
	}

	// If accepted, update task assignment
	if input.Status == "accepted" {
		if err := tx.Model(&models.Task{}).
			Where("id = ?", invite.TaskID).
			Update("assigned_to_associate", invite.AssociateID).Error; err != nil {
			tx.Rollback()
			utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to assign associate to task")
			return
		}
	}

	if err := tx.Commit().Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to commit transaction")
		return
	}

	utils.SendSuccessResponse(c, http.StatusOK, gin.H{
		"message": "Invite updated successfully",
		"status":  invite.Status,
	})
}

func GetInviteDetails(c *gin.Context) {
	// Extract and validate associate ID (from middleware)
	userID := c.GetString("associate_id")
	inviteID := c.GetString("invite_id")

	if userID == "" {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid or missing token")
		return
	}

	_, err := uuid.Parse(userID)
	if err != nil {
		utils.SendErrorResponse(c, http.StatusBadRequest, "invalid associate ID format")
		return
	}

	if inviteID == "" {
		utils.SendErrorResponse(c, http.StatusBadRequest, "missing invite id")
		return
	}

	var invite models.Invite
	if err := config.DB.
		Preload("Contract").
		Preload("Contract.Project").
		Preload("Contract.Task").
		Preload("Associate.User").
		First(&invite, "id = ?", inviteID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			utils.SendErrorResponse(c, http.StatusNotFound, "invite not found")
			return
		}
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to fetch invite details")
		return
	}

	// Flatten and clean up the data for frontend use
	response := gin.H{
		"invite_id":    invite.ID,
		"status":       invite.Status,
		"responded_at": invite.RespondedAt,

		"freelancer": gin.H{
			"id":         invite.Associate.ID,
			"first_name": invite.Associate.User.FirstName,
			"last_name":  invite.Associate.User.LastName,
			"email":      invite.Associate.User.Email,
		},

		"contract": gin.H{
			"id":               invite.Contract.ID,
			"role":             invite.Contract.Role,
			"description":      invite.Contract.Description,
			"payment_terms":    invite.Contract.PaymentTerms,
			"start_date":       invite.Contract.StartDate,
			"end_date":         invite.Contract.EndDate,
			"effort":           invite.Contract.Effort,
			"timeline_notes":   invite.Contract.TimelineNotes,
			"timestamp":        invite.Contract.Timestamp,
			"responsibilities": invite.Contract.Responsibilities,
			"deliverables":     invite.Contract.Deliverables,
			"confidentiality":  invite.Contract.Confidentiality,
			"ownership":        invite.Contract.Ownership,
		},

		"project": gin.H{
			"id":          invite.Contract.Project.ID,
			"name":        invite.Contract.Project.Name,
			"description": invite.Contract.Project.Description,
			"category":    invite.Contract.Project.Category,
			"start_date":  invite.Contract.Project.StartDate,
			"deadline":    invite.Contract.Project.Deadline,
			"priority":    invite.Contract.Project.Priority,
			"created_at":  invite.Contract.Project.CreatedAt,
		},

		"task": gin.H{
			"id":              invite.Contract.Task.ID,
			"title":           invite.Contract.Task.Title,
			"description":     invite.Contract.Task.Description,
			"estimated_hours": invite.Contract.Task.EstimatedHours,
			"due_date":        invite.Contract.Task.DueDate,
			"status":          invite.Contract.Task.Status,
			"priority":        invite.Contract.Task.Priority,
			"created_at":      invite.Contract.Task.CreatedAt,
		},
	}

	utils.SendSuccessResponse(c, http.StatusOK, response)
}
