package controllers

import (
	"free-flow-api/config"
	"free-flow-api/models"
	"free-flow-api/utils"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type Entityinput struct {
	CompanyName string `json:"companyName" binding:"required,min=2,max=100"`
	Contact     string `json:"contact" binding:"required,min=2,max=100"`
	Email       string `json:"email" binding:"required,email"`
}

func NewEntity(c *gin.Context) {
	//validate jwt token
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		c.Abort()
		return
	}

	//get user input
	var input Entityinput
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.SendErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	input.Email = strings.ToLower(strings.TrimSpace(input.Email))

	//create a new entity
	entity := models.Entity{
		CompanyName: input.CompanyName,
		Contact:     input.Contact,
		Email:       input.Email,
		UserID:      uuid.MustParse(userID),
	}

	if err := config.DB.Create(&entity).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to create an entity")
		return
	}

	data := map[string]string{
		"message": "Entity Created Successfully",
	}
	utils.SendSuccessResponse(c, http.StatusCreated, data)
}

func GetAllEntities(c *gin.Context) {
	//validate jwt token
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		c.Abort()
		return
	}

	var allEntities []models.Entity
	if err := config.DB.Find(&allEntities).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusNotFound, "No Entities Found")
		c.Abort()
		return
	}

	utils.SendSuccessResponse(c, http.StatusOK, allEntities)
}

func GetEntityByID(c *gin.Context) {
	//validate jwt token
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		c.Abort()
		return
	}

	entityID := c.Param("id")

	var entities []models.Entity
	if err := config.DB.First(&entities, "id = ?", entityID).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusNotFound, "No Entity Found")
		c.Abort()
		return
	}

	utils.SendSuccessResponse(c, http.StatusOK, entities)
}

func GetEntityByUserID(c *gin.Context) {
	//validate jwt token
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		c.Abort()
		return
	}

	var entities []models.Entity
	if err := config.DB.Find(&entities, "user_id = ?", userID).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusNotFound, "No Entity Found")
		c.Abort()
		return
	}

	utils.SendSuccessResponse(c, http.StatusOK, entities)
}
