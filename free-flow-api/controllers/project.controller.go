package controllers

import (
	"free-flow-api/config"
	"free-flow-api/models"
	"free-flow-api/utils"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type ProjectInput struct {
	Name           string    `json:"name" binding:"required"`
	Description    string    `json:"description"`
	EstimatedValue float64   `json:"estimated_value"`
	Notes          string    `json:"notes"`
	EntityID       uuid.UUID `json:"entityID" binding:"required"`
}

type ProjectUpdateInput struct {
	Name           *string               `json:"name,omitempty"`
	Description    *string               `json:"description,omitempty"`
	EstimatedValue *float64              `json:"estimated_value,omitempty"`
	Notes          *string               `json:"notes,omitempty"`
	Status         *models.ProjectStatus `json:"status,omitempty"`
	CurrentPhase   *models.ProjectPhase  `json:"current_phase,omitempty"`
	Priority       *string               `json:"priority,omitempty"`
	ActualValue    *float64              `json:"actual_value,omitempty"`
	YourCutPercent *float32              `json:"your_cut_percent,omitempty"`
	Deadline       *time.Time            `json:"deadline,omitempty"`
}

func NewProject(c *gin.Context) {
	//validate jwt
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		c.Abort()
		return
	}

	//get user input
	var input ProjectInput
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.SendErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	if !utils.EntityExists(input.EntityID.String()) {
		utils.SendErrorResponse(c, http.StatusBadRequest, "Entity ID is missing")
		c.Abort()
		return
	}

	//create new project
	project := models.Project{
		Name:           input.Name,
		Description:    input.Description,
		EstimatedValue: input.EstimatedValue,
		Notes:          input.Notes,
		EntityID:       input.EntityID,
		UserID:         uuid.MustParse(userID),
	}

	if err := config.DB.Create(&project).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to create an entity")
		return
	}

	data := map[string]string{
		"message": "Project Created Successfully",
	}
	utils.SendSuccessResponse(c, http.StatusCreated, data)
}

func GetAllProjects(c *gin.Context) {
	//validate jwt token
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		c.Abort()
		return
	}

	var allProjects []models.Project
	if err := config.DB.Find(&allProjects).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusNotFound, "Projects Not Found")
		c.Abort()
		return
	}

	utils.SendSuccessResponse(c, http.StatusOK, allProjects)
}

func GetProjectByEntityID(c *gin.Context) {
	//validate jwt token
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		c.Abort()
		return
	}

	entityID := c.Param("id")

	var projects []models.Project
	if err := config.DB.Find(&projects, "entity_id = ?", entityID).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusNotFound, "Project Not Found")
		c.Abort()
		return
	}

	utils.SendSuccessResponse(c, http.StatusOK, projects)
}

func GetProjectByID(c *gin.Context) {
	//validate jwt token
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		c.Abort()
		return
	}

	projectID := c.Param("id")

	var project models.Project
	if err := config.DB.First(&project, "id = ?", projectID).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusNotFound, "Project Not Found")
		c.Abort()
		return
	}

	utils.SendSuccessResponse(c, http.StatusOK, project)
}

func UpdateProject(c *gin.Context) {
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		c.Abort()
		return
	}

	projectIDParam := c.Param("id")
	projectID, err := uuid.Parse(projectIDParam)
	if err != nil {
		utils.SendErrorResponse(c, http.StatusBadRequest, "invalid project id")
		return
	}

	var updates ProjectUpdateInput
	if err := c.ShouldBindJSON(&updates); err != nil {
		utils.SendErrorResponse(c, http.StatusBadRequest, "invalid request body")
		return
	}

	var project models.Project
	if err := config.DB.First(&project, "id = ?", projectID).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusNotFound, "project not found")
		return
	}

	if err := config.DB.First(&project, "user_id = ?", userID).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusNotFound, "access denied")
		return
	}

	// Start a transaction for atomic updates
	tx := config.DB.Begin()
	if tx.Error != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to start transaction")
		return
	}

	// Prepare update map
	updateMap := make(map[string]interface{})

	// Handle basic field updates
	if updates.Name != nil {
		updateMap["name"] = *updates.Name
	}
	if updates.Description != nil {
		updateMap["description"] = *updates.Description
	}
	if updates.EstimatedValue != nil {
		updateMap["estimated_value"] = *updates.EstimatedValue
	}
	if updates.Notes != nil {
		updateMap["notes"] = *updates.Notes
	}
	if updates.Priority != nil {
		updateMap["priority"] = *updates.Priority
	}
	if updates.ActualValue != nil {
		updateMap["actual_value"] = *updates.ActualValue
	}

	if updates.Deadline != nil {
		updateMap["deadline"] = *updates.Deadline
	}

	// Handle YourCutPercent and IsOutsourced logic
	if updates.YourCutPercent != nil {
		updateMap["your_cut_percent"] = *updates.YourCutPercent
		// If cut percent is greater than 0, mark as outsourced
		updateMap["is_outsourced"] = *updates.YourCutPercent > 0
	}

	// Handle Status changes and related logic
	if updates.Status != nil {
		newStatus := *updates.Status

		updateMap["status"] = newStatus

		// If status changes to active and project hasn't started yet, set StartDate
		if newStatus == models.ProjectStatusActive && project.StartDate == nil {
			now := time.Now()
			updateMap["start_date"] = &now
		}

		// If status changes to completed, set CompletedAt
		if newStatus == models.ProjectStatusCompleted {
			now := time.Now()
			updateMap["completed_at"] = &now
		}
	}

	// Handle CurrentPhase updates
	if updates.CurrentPhase != nil {
		updateMap["current_phase"] = *updates.CurrentPhase
	}

	// Perform the update
	if err := tx.Model(&project).Updates(updateMap).Error; err != nil {
		tx.Rollback()
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to update project")
		return
	}

	if err := config.DB.Model(&project).Updates(updates).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to update project")
		return
	}

	// Commit transaction
	if err := tx.Commit().Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to commit transaction")
		return
	}

	data := map[string]string{
		"message": "Project updated successfully",
	}

	utils.SendSuccessResponse(c, http.StatusOK, data)
}

func DeleteProject(c *gin.Context) {
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		c.Abort()
		return
	}

	projectIDParam := c.Param("id")
	projectID, err := uuid.Parse(projectIDParam)
	if err != nil {
		utils.SendErrorResponse(c, http.StatusBadRequest, "invalid project id")
		return
	}

	var project models.Project
	if err := config.DB.First(&project, "id = ?", projectID).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusNotFound, "project not found")
		return
	}

	if err := config.DB.Delete(&project).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to delete project")
		return
	}

	data := map[string]string{
		"message": "Project deleted successfully",
	}

	utils.SendSuccessResponse(c, http.StatusOK, data)
}
