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

type PaymentInput struct {
	InvoiceID      uuid.UUID `json:"invoice_id"`
	Amount         int64     `json:"amount"`
	Currency       *string   `json:"currency,omitempty"`
	Method         string    `json:"method"`          // "mpesa", "bank", "cash"
	TransactionRef string    `json:"transaction_ref"` // mpesa code, bank ref, etc.
	PaidDate       time.Time `json:"paid_date"`
	Status         *string   `json:"status,omitempty"` // "pending", "confirmed", "failed"
	Notes          *string   `json:"notes,omitempty"`
}

type PaymentWithInvoice struct {
	ID             uuid.UUID `json:"id"`
	Amount         float64   `json:"amount"`
	Currency       string    `json:"currency"`
	Method         string    `json:"method"`
	TransactionRef string    `json:"transaction_ref"`
	PaidDate       time.Time `json:"paid_date"`
	Status         string    `json:"status"`
	Notes          *string   `json:"notes"`

	// Minimal invoice info
	InvoiceID     uuid.UUID `json:"invoice_id"`
	InvoiceNumber string    `json:"invoice_number"`
	InvoiceAmount float64   `json:"invoice_amount"`
	InvoiceStatus string    `json:"invoice_status"`
}

// CreatePayment godoc
func CreatePayment(c *gin.Context) {
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		return
	}

	var input PaymentInput
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.SendErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	// Ensure the invoice exists
	var invoice models.Invoice
	if err := config.DB.First(&invoice, "id = ?", input.InvoiceID).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusNotFound, "invoice not found")
		return
	}

	payment := models.Payment{
		InvoiceID:      input.InvoiceID,
		Amount:         float64(input.Amount),
		Currency:       utils.StringOrDefault(input.Currency, "KES"),
		Method:         input.Method,
		TransactionRef: input.TransactionRef,
		PaidDate:       utils.TimeOrNow(input.PaidDate),
		Status:         utils.StringOrDefault(input.Status, "pending"),
		Notes:          input.Notes,
		UserID:         uuid.MustParse(userID),
	}

	// Calculate total paid so far for this invoice
	var totalPaid float64
	config.DB.Model(&models.Payment{}).
		Where("invoice_id = ? AND status != ?", input.InvoiceID, "failed").
		Select("SUM(amount)").
		Scan(&totalPaid)

		// Check if invoice is fully paid
	if totalPaid >= invoice.Amount {
		now := time.Now()
		invoice.Status = "paid"
		invoice.PaidDate = &now
		if err := config.DB.Save(&invoice).Error; err != nil {
			utils.SendErrorResponse(c, http.StatusInternalServerError, "invoice update failed")
			return
		}
	}

	if err := config.DB.Create(&payment).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "could not create payment")
		return
	}

	data := map[string]string{
		"message": "Payment Added Successfully",
	}

	utils.SendSuccessResponse(c, http.StatusCreated, data)
}

// GetPayments godoc
func GetPayments(c *gin.Context) {
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		return
	}

	var payments []models.Payment
	if err := config.DB.Find(&payments).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "could not fetch payments")
		return
	}

	utils.SendSuccessResponse(c, http.StatusOK, payments)
}

// GetPaymentByID godoc
func GetPaymentByUserID(c *gin.Context) {
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		return
	}

	var payments []PaymentWithInvoice
	if err := config.DB.
		Table("payments").
		Select("payments.id, payments.amount, payments.currency, payments.method, payments.transaction_ref, payments.paid_date, payments.status, payments.notes, invoices.invoice_number, invoices.amount as invoice_amount, invoices.status as invoice_status, invoices.id as invoice_id").
		Joins("JOIN invoices ON invoices.id = payments.invoice_id").
		Where("payments.user_id = ?", uuid.MustParse(userID)).
		Scan(&payments).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusNotFound, "payments not found")
		return
	}

	utils.SendSuccessResponse(c, http.StatusOK, payments)
}

// GetPaymentByID godoc
func GetPaymentByID(c *gin.Context) {
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		return
	}

	id := c.Param("id")

	var payment models.Payment
	if err := config.DB.First(&payment, "id = ?", id).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusNotFound, "payment not found")
		return
	}

	utils.SendSuccessResponse(c, http.StatusOK, payment)
}

// UpdatePayment godoc
func UpdatePayment(c *gin.Context) {
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		return
	}

	id := c.Param("id")

	var payment models.Payment
	if err := config.DB.First(&payment, "id = ?", id).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusNotFound, "payment not found")
		return
	}

	var input PaymentInput
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.SendErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	if input.Amount != 0 {
		payment.Amount = float64(input.Amount)
	}
	if input.Currency != nil {
		payment.Currency = *input.Currency
	}
	if input.Method != "" {
		payment.Method = input.Method
	}
	if input.TransactionRef != "" {
		payment.TransactionRef = input.TransactionRef
	}
	if !input.PaidDate.IsZero() {
		payment.PaidDate = input.PaidDate
	}
	if input.Status != nil {
		payment.Status = *input.Status
	}

	if err := config.DB.Save(&payment).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "could not update payment")
		return
	}

	utils.SendSuccessResponse(c, http.StatusOK, payment)
}

// DeletePayment godoc
func DeletePayment(c *gin.Context) {
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		return
	}

	id := c.Param("id")

	if err := config.DB.Delete(&models.Payment{}, "id = ?", id).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "could not delete payment")
		return
	}

	utils.SendSuccessResponse(c, http.StatusOK, gin.H{"message": "payment deleted"})
}
