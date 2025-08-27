package controllers

import (
	"free-flow-api/config"
	"free-flow-api/models"
	"free-flow-api/utils"
	"net/http"

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
