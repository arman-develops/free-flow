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

type AssociateInput struct {
	Name   string `json:"name" binding:"required"`
	Email  string `json:"email" binding:"required,email"`
	Phone  string `json:"phone"`
	Skills string `json:"skills"`
}

func NewAssociate(c *gin.Context) {
	//validate jwt
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		c.Abort()
		return
	}

	//get user input
	var input AssociateInput
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.SendErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}
	input.Email = strings.ToLower(strings.TrimSpace(input.Email))

	//create an associate
	associate := models.Associate{
		Name:   input.Name,
		Email:  input.Email,
		Phone:  input.Phone,
		Skills: input.Skills,
		UserID: uuid.MustParse(userID),
	}
	if err := config.DB.Create(&associate).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to create a new associate")
		return
	}

	data := map[string]string{
		"message": "Associate created successfully",
	}
	utils.SendSuccessResponse(c, http.StatusCreated, data)
}

func GetAllAssociates(c *gin.Context) {
	//validate jwt token
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		c.Abort()
		return
	}

	var allAssociates []models.Associate
	if err := config.DB.Find(&allAssociates).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusNotFound, "Associate Not Found")
		c.Abort()
		return
	}

	utils.SendSuccessResponse(c, http.StatusOK, allAssociates)
}
