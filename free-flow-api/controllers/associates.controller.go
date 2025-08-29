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
		utils.SendErrorResponse(c, http.StatusNotFound, "Associates Not Found")
		c.Abort()
		return
	}

	utils.SendSuccessResponse(c, http.StatusOK, allAssociates)
}

func GetAllAssociatesByUserID(c *gin.Context) {
	//validate jwt token
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		c.Abort()
		return
	}

	var allAssociates []models.Associate
	if err := config.DB.Find(&allAssociates, "user_id = ?", userID).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusNotFound, "Associates Not Found")
		c.Abort()
		return
	}

	utils.SendSuccessResponse(c, http.StatusOK, allAssociates)
}

func GetAssociateByID(c *gin.Context) {
	//validate jwt token
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		c.Abort()
		return
	}

	associateID := c.Param("id")

	var associate models.Associate
	if err := config.DB.First(&associate, "id = ?", associateID).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusNotFound, "Associates Not Found")
		c.Abort()
		return
	}

	utils.SendSuccessResponse(c, http.StatusOK, associate)
}

func UpdateAssociate(c *gin.Context) {
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		c.Abort()
		return
	}

	associateIDParam := c.Param("id")
	associateID, err := uuid.Parse(associateIDParam)
	if err != nil {
		utils.SendErrorResponse(c, http.StatusBadRequest, "invalid associate id")
		return
	}

	var updates AssociateInput
	if err := c.ShouldBindJSON(&updates); err != nil {
		utils.SendErrorResponse(c, http.StatusBadRequest, "invalid request body")
		return
	}

	var associate models.Associate
	if err := config.DB.First(&associate, "id = ?", associateID).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusNotFound, "associate not found")
		return
	}

	if err := config.DB.First(&associate, "user_id = ?", userID).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusNotFound, "access denied")
		return
	}

	updates.Email = strings.ToLower(strings.TrimSpace(updates.Email))

	if err := config.DB.Model(&associate).Updates(updates).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to update entity")
		return
	}

	data := map[string]string{
		"message": "Associate updated successfully",
	}

	utils.SendSuccessResponse(c, http.StatusOK, data)
}

func DeleteAssociate(c *gin.Context) {
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		c.Abort()
		return
	}

	associateIDParam := c.Param("id")
	associateID, err := uuid.Parse(associateIDParam)
	if err != nil {
		utils.SendErrorResponse(c, http.StatusBadRequest, "invalid associate id")
		return
	}

	// 3. Find the entity
	var associate models.Associate
	if err := config.DB.First(&associate, "id = ?", associateID).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusNotFound, "entity not found")
		return
	}

	// 4. Soft delete (sets DeletedAt, doesn’t remove row)
	if err := config.DB.Delete(&associate).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to delete entity")
		return
	}

	data := map[string]string{
		"message": "Associate deleted successfully",
	}

	utils.SendSuccessResponse(c, http.StatusOK, data)
}
