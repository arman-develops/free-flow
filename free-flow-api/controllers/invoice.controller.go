package controllers

import (
	"free-flow-api/config"
	"free-flow-api/models"
	"free-flow-api/utils"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type InvoiceInput struct {
	ProjectID      uuid.UUID `json:"project_id"`
	Currency       *string   `json:"currency,omitempty"`
	Status         *string   `json:"status,omitempty"`
	DueDate        time.Time `json:"due_date"`
	Description    *string   `json:"description"`
	Notes          *string   `json:"notes,omitempty"`
	PaymentMethod  string    `json:"payment_method"`
	TransactionRef string    `json:"transaction_ref"`
}

// CreateInvoice godoc
func CreateInvoice(c *gin.Context) {
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		return
	}

	var input InvoiceInput
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.SendErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	var project models.Project
	if err := config.DB.First(&project, "id = ?", input.ProjectID).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusNotFound, "Project Not found")
		return
	}

	prefix := "INV-FF-"
	id := uuid.New().String()
	short_id := id[:8]
	inv := prefix + short_id
	invoice_number := strings.ToUpper(inv)

	invoice := models.Invoice{
		ProjectID:      input.ProjectID,
		Amount:         project.ActualValue,
		Currency:       utils.StringOrDefault(&project.Currency, *input.Currency),
		Status:         utils.StringOrDefault(input.Status, "draft"),
		DueDate:        input.DueDate,
		Description:    utils.StringOrDefault(input.Description, ""),
		Notes:          utils.StringOrDefault(input.Notes, ""),
		InvoiceNumber:  invoice_number,
		PaymentMethod:  input.PaymentMethod,
		TransactionRef: input.TransactionRef,
		IssueDate:      time.Now(),
		UserID:         uuid.MustParse(userID),
	}

	if err := config.DB.Create(&invoice).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "could not create invoice")
		return
	}

	data := map[string]string{
		"message": "invoice Created Successfully",
	}

	utils.SendSuccessResponse(c, http.StatusCreated, data)
}

// GetInvoices godoc
func GetInvoices(c *gin.Context) {
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		return
	}

	var invoices []models.Invoice
	if err := config.DB.Find(&invoices).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "could not fetch invoices")
		return
	}

	utils.SendSuccessResponse(c, http.StatusOK, invoices)
}

// GetInvoiceByID godoc
func GetInvoiceByID(c *gin.Context) {
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		return
	}

	id := c.Param("id")

	var invoice models.Invoice
	if err := config.DB.First(&invoice, "id = ?", id).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusNotFound, "invoice not found")
		return
	}

	utils.SendSuccessResponse(c, http.StatusOK, invoice)
}

// UpdateInvoice godoc
func UpdateInvoice(c *gin.Context) {
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		return
	}

	id := c.Param("id")

	var invoice models.Invoice
	if err := config.DB.First(&invoice, "id = ?", id).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusNotFound, "invoice not found")
		return
	}

	var input InvoiceInput
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.SendErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	if input.Currency != nil {
		invoice.Currency = *input.Currency
	}
	if input.Status != nil {
		invoice.Status = *input.Status
	}
	if !input.DueDate.IsZero() {
		invoice.DueDate = input.DueDate
	}
	if input.Description != nil {
		invoice.Description = *input.Description
	}
	if input.Notes != nil {
		invoice.Notes = *input.Notes
	}
	if input.PaymentMethod != "" {
		invoice.PaymentMethod = input.PaymentMethod
	}
	if input.TransactionRef != "" {
		invoice.TransactionRef = input.TransactionRef
	}

	if err := config.DB.Save(&invoice).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "could not update invoice")
		return
	}

	utils.SendSuccessResponse(c, http.StatusOK, invoice)
}

// DeleteInvoice godoc
func DeleteInvoice(c *gin.Context) {
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		return
	}

	id := c.Param("id")

	if err := config.DB.Delete(&models.Invoice{}, "id = ?", id).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "could not delete invoice")
		return
	}

	utils.SendSuccessResponse(c, http.StatusOK, gin.H{"message": "invoice deleted"})
}
