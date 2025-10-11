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
	CompanyName string  `json:"companyName" binding:"min=2,max=100"`
	Contact     string  `json:"contact" binding:"min=2,max=100"`
	Email       string  `json:"email" binding:"email"`
	Address     *string `json:"address,omitempty"`
	Notes       *string `json:"notes,omitempty"`
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

func UpdateEntity(c *gin.Context) {
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		c.Abort()
		return
	}

	entityIDParam := c.Param("id")
	entityID, err := uuid.Parse(entityIDParam)
	if err != nil {
		utils.SendErrorResponse(c, http.StatusBadRequest, "invalid entity id")
		return
	}

	var updates Entityinput
	if err := c.ShouldBindJSON(&updates); err != nil {
		utils.SendErrorResponse(c, http.StatusBadRequest, "invalid request body")
		return
	}

	var entity models.Entity
	if err := config.DB.First(&entity, "id = ?", entityID).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusNotFound, "entity not found")
		return
	}

	if err := config.DB.First(&entity, "user_id = ?", userID).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusNotFound, "access denied")
		return
	}

	updates.Email = strings.ToLower(strings.TrimSpace(updates.Email))

	if err := config.DB.Model(&entity).Updates(updates).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to update entity")
		return
	}

	data := map[string]string{
		"message": "Entity updated successfully",
	}

	utils.SendSuccessResponse(c, http.StatusOK, data)
}

func DeleteEntity(c *gin.Context) {
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		c.Abort()
		return
	}

	entityIDParam := c.Param("id")
	entityID, err := uuid.Parse(entityIDParam)
	if err != nil {
		utils.SendErrorResponse(c, http.StatusBadRequest, "invalid entity id")
		return
	}

	// 3. Find the entity
	var entity models.Entity
	if err := config.DB.First(&entity, "id = ?", entityID).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusNotFound, "entity not found")
		return
	}

	// 4. Soft delete (sets DeletedAt, doesn’t remove row)
	if err := config.DB.Delete(&entity).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to delete entity")
		return
	}

	data := map[string]string{
		"message": "Entity deleted successfully",
	}

	utils.SendSuccessResponse(c, http.StatusOK, data)
}
