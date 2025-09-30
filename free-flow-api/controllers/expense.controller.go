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

type ExpenseInput struct {
	ProjectID   uuid.UUID `json:"project_id"`
	Amount      int64     `json:"amount"`
	Currency    *string   `json:"currency,omitempty"`
	Description *string   `json:"description"`
	Category    *string   `json:"category"`
	Date        time.Time `json:"date"`
	ReceiptURL  *string   `json:"receipt_url"`
	Vendor      *string   `json:"vendor"`
}

// CreateExpense godoc
func CreateExpense(c *gin.Context) {
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		return
	}

	var input ExpenseInput
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.SendErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	expense := models.Expense{
		ProjectID:   input.ProjectID,
		Amount:      float64(input.Amount),
		Currency:    utils.StringOrDefault(input.Currency, "KES"),
		Description: utils.StringOrDefault(input.Description, ""),
		Category:    utils.StringOrDefault(input.Category, "other"),
		Date:        utils.TimeOrNow(input.Date),
		Vendor:      utils.StringOrDefault(input.Vendor, ""),
	}

	if err := config.DB.Create(&expense).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "could not create expense")
		return
	}

	data := map[string]string{
		"message": "Project Created Successfully",
	}

	utils.SendSuccessResponse(c, http.StatusCreated, data)
}

// GetExpenses godoc
func GetExpenses(c *gin.Context) {
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		return
	}

	var expenses []models.Expense
	if err := config.DB.Find(&expenses).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "could not fetch expenses")
		return
	}

	utils.SendSuccessResponse(c, http.StatusOK, expenses)
}

// GetExpenseByID godoc
func GetExpenseByID(c *gin.Context) {
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		return
	}

	id := c.Param("id")

	var expense models.Expense
	if err := config.DB.First(&expense, "id = ?", id).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusNotFound, "expense not found")
		return
	}

	utils.SendSuccessResponse(c, http.StatusOK, expense)
}

// UpdateExpense godoc
func UpdateExpense(c *gin.Context) {
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		return
	}

	id := c.Param("id")

	var expense models.Expense
	if err := config.DB.First(&expense, "id = ?", id).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusNotFound, "expense not found")
		return
	}

	var input ExpenseInput
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.SendErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	if input.Amount != 0 {
		expense.Amount = float64(input.Amount)
	}
	if input.Currency != nil {
		expense.Currency = *input.Currency
	}
	if input.Description != nil {
		expense.Description = *input.Description
	}
	if input.Category != nil {
		expense.Category = *input.Category
	}
	if !input.Date.IsZero() {
		expense.Date = input.Date
	}
	if input.Vendor != nil {
		expense.Vendor = *input.Vendor
	}

	if err := config.DB.Save(&expense).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "could not update expense")
		return
	}

	utils.SendSuccessResponse(c, http.StatusOK, expense)
}

// DeleteExpense godoc
func DeleteExpense(c *gin.Context) {
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		return
	}

	id := c.Param("id")

	if err := config.DB.Delete(&models.Expense{}, "id = ?", id).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "could not delete expense")
		return
	}

	utils.SendSuccessResponse(c, http.StatusOK, gin.H{"message": "expense deleted"})
}
