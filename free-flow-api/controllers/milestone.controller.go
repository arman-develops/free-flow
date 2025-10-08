package controllers

import (
	"free-flow-api/config"
	"free-flow-api/models"
	"free-flow-api/utils"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type CreateMilestoneInput struct {
	Title        string    `json:"title" binding:"required"`
	Description  string    `json:"description" binding:"required"`
	Priority     string    `json:"priority" binding:"required,oneof=low medium high"`
	Status       string    `json:"status" binding:"omitempty,oneof=not_started in_progress completed delayed"`
	Deliverables []string  `json:"deliverables" binding:"omitempty"`
	ProjectID    uuid.UUID `json:"project_id" binding:"required"`
}

func CreateMilestone(c *gin.Context) {
	//validate jwt
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		c.Abort()
		return
	}

	var input CreateMilestoneInput
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.SendErrorResponse(c, http.StatusBadRequest, "invalid input: "+err.Error())
		return
	}

	milestone := models.Milestone{
		Title:        input.Title,
		Description:  input.Description,
		Priority:     input.Priority,
		Status:       input.Status,
		Deliverables: input.Deliverables,
		ProjectID:    input.ProjectID,
	}

	if err := config.DB.Create(&milestone).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to create milestone")
		return
	}

	utils.SendSuccessResponse(c, http.StatusCreated, gin.H{
		"message": "milestone created successfully",
	})
}

func GetAllMilestones(c *gin.Context) {
	// Validate JWT token
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		c.Abort()
		return
	}

	var milestones []models.Milestone

	if err := config.DB.Order("created_at DESC").Find(&milestones).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusNotFound, "Milestones not found")
		c.Abort()
		return
	}

	utils.SendSuccessResponse(c, http.StatusOK, milestones)
}

func GetMilestonesByProjectID(c *gin.Context) {
	// Validate JWT token
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		c.Abort()
		return
	}

	projectID := c.Param("id")
	if projectID == "" {
		utils.SendErrorResponse(c, http.StatusBadRequest, "missing project ID")
		c.Abort()
		return
	}

	var milestones []models.Milestone

	if err := config.DB.
		Where("project_id = ?", projectID).
		Order("created_at DESC").
		Find(&milestones).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusNotFound, "no milestones found for this project")
		c.Abort()
		return
	}

	utils.SendSuccessResponse(c, http.StatusOK, milestones)
}

func GetMilestoneByID(c *gin.Context) {
	// validate jwt token
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		c.Abort()
		return
	}

	milestoneID := c.Param("id")

	id, err := uuid.Parse(milestoneID)
	if err != nil {
		utils.SendErrorResponse(c, http.StatusBadRequest, "invalid milestone id format")
		c.Abort()
		return
	}

	var milestone models.Milestone
	if err := config.DB.
		Where("milestones.id = ?", id).
		First(&milestone).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusNotFound, "milestone not found")
		c.Abort()
		return
	}

	// manually join tasks
	var tasks []models.Task
	if err := config.DB.
		Where("milestone_id = ?", milestone.ID).
		Find(&tasks).Error; err == nil {
		milestone.Tasks = tasks
	}

	utils.SendSuccessResponse(c, http.StatusOK, milestone)
}

type UpdateMilestoneInput struct {
	Title         *string   `json:"title,omitempty"`
	Description   *string   `json:"description,omitempty"`
	Status        *string   `json:"status,omitempty"`
	Priority      *string   `json:"priority,omitempty"`
	StartDate     *string   `json:"start_date,omitempty"`
	DueDate       *string   `json:"due_date,omitempty"`
	CompletedDate *string   `json:"completed_date,omitempty"`
	Progress      *int      `json:"progress,omitempty"`
	ClientVisible *bool     `json:"client_visible,omitempty"`
	Deliverables  *[]string `json:"deliverables,omitempty"`
}

func UpdateMilestone(c *gin.Context) {
	// validate jwt token
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		c.Abort()
		return
	}

	milestoneID := c.Param("id")

	id, err := uuid.Parse(milestoneID)
	if err != nil {
		utils.SendErrorResponse(c, http.StatusBadRequest, "invalid milestone id format")
		c.Abort()
		return
	}

	var milestone models.Milestone
	if err := config.DB.First(&milestone, "id = ?", id).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusNotFound, "milestone not found")
		c.Abort()
		return
	}

	var input UpdateMilestoneInput
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.SendErrorResponse(c, http.StatusBadRequest, "invalid input")
		c.Abort()
		return
	}

	updateData := make(map[string]interface{})

	if input.Title != nil {
		updateData["title"] = *input.Title
	}
	if input.Description != nil {
		updateData["description"] = *input.Description
	}
	if input.Status != nil {
		updateData["status"] = *input.Status
	}
	if input.Priority != nil {
		updateData["priority"] = *input.Priority
	}
	if input.Progress != nil {
		updateData["progress"] = *input.Progress
	}
	if input.ClientVisible != nil {
		updateData["client_visible"] = *input.ClientVisible
	}
	if input.Deliverables != nil {
		updateData["deliverables"] = *input.Deliverables
	}

	// optional: parse date strings into time.Time if provided
	if input.StartDate != nil {
		updateData["start_date"] = input.StartDate
	}
	if input.DueDate != nil {
		updateData["due_date"] = input.DueDate
	}
	if input.CompletedDate != nil {
		updateData["completed_date"] = input.CompletedDate
	}

	if len(updateData) == 0 {
		utils.SendErrorResponse(c, http.StatusBadRequest, "no valid fields to update")
		return
	}

	if err := config.DB.Model(&milestone).Updates(updateData).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to update milestone")
		c.Abort()
		return
	}

	utils.SendSuccessResponse(c, http.StatusOK, gin.H{"message": "milestone updated successfully"})
}

func DeleteMilestone(c *gin.Context) {
	// Validate JWT token
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		c.Abort()
		return
	}

	milestoneID := c.Param("id")

	id, err := uuid.Parse(milestoneID)
	if err != nil {
		utils.SendErrorResponse(c, http.StatusBadRequest, "invalid milestone id format")
		c.Abort()
		return
	}

	var milestone models.Milestone
	if err := config.DB.First(&milestone, "id = ?", id).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusNotFound, "milestone not found")
		c.Abort()
		return
	}

	if err := config.DB.Delete(&milestone).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to delete milestone")
		c.Abort()
		return
	}

	utils.SendSuccessResponse(c, http.StatusOK, gin.H{
		"message": "milestone deleted successfully",
	})
}
