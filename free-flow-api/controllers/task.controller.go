package controllers

import (
	"free-flow-api/config"
	"free-flow-api/models"
	"free-flow-api/utils"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type TaskInput struct {
	Title                string     `json:"title" binding:"required"`
	Description          string     `json:"description"`
	EstimatedHours       float64    `json:"estimated_hours"`
	AssignedToAssociated *uuid.UUID `json:"assigned_associate,omitempty"`
	ProjectID            uuid.UUID  `json:"projectID"`
}

func NewTask(c *gin.Context) {
	//validate token
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		c.Abort()
		return
	}

	//get user input
	var input TaskInput

	if !utils.ProjectExists(input.ProjectID.String()) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		c.Abort()
		return
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		utils.SendErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	//create new task
	task := models.Task{
		Title:               input.Title,
		Description:         input.Description,
		EstimatedHours:      input.EstimatedHours,
		AssignedToAssociate: input.AssignedToAssociated,
		ProjectID:           input.ProjectID,
	}

	if err := config.DB.Create(&task).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to create a new associate")
		return
	}

	data := map[string]string{
		"message": "Task created successfully",
	}
	utils.SendSuccessResponse(c, http.StatusCreated, data)
}

func GetAllTasks(c *gin.Context) {
	//validate jwt token
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		c.Abort()
		return
	}

	var allTasks []models.Task
	if err := config.DB.Find(&allTasks).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusNotFound, "Tasks Not Found")
		c.Abort()
		return
	}

	utils.SendSuccessResponse(c, http.StatusOK, allTasks)
}

func GetAllTasksByProjectID(c *gin.Context) {
	//validate jwt token
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		c.Abort()
		return
	}

	projectID := c.Param("id")

	var allTasks []models.Task
	if err := config.DB.Find(&allTasks, "project_id = ?", projectID).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusNotFound, "Tasks Not Found")
		c.Abort()
		return
	}

	utils.SendSuccessResponse(c, http.StatusOK, allTasks)
}
