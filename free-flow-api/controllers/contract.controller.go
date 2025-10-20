package controllers

import (
	"errors"
	"free-flow-api/config"
	"free-flow-api/models"
	"free-flow-api/utils"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ContractInput struct {
	Role             string    `json:"role" binding:"required"`
	Responsibilities []string  `json:"responsibilities"`
	Effort           string    `json:"effort"`
	Deliverables     []string  `json:"deliverables"`
	StartDate        time.Time `json:"start_date"`
	EndDate          time.Time `json:"end_date"`
	TimelineNotes    string    `json:"timeline_notes"`
	PaymentTerms     string    `json:"payment_terms"`
	TaskID           uuid.UUID `json:"task_id"`
	ProjectID        uuid.UUID `json:"project_id"`
}

func CreateContract(c *gin.Context) {
	//validate jwt
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		c.Abort()
		return
	}

	var input ContractInput
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.SendSuccessResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	now := time.Now()

	contract := models.Contract{
		Role:             input.Role,
		Responsibilities: input.Responsibilities,
		Effort:           input.Effort,
		Deliverables:     input.Deliverables,
		StartDate:        input.StartDate,
		EndDate:          input.EndDate,
		Timestamp:        now,
		TaskID:           input.TaskID,
		ProjectID:        input.ProjectID,
		TimelineNotes:    input.TimelineNotes,
		PaymentTerms:     input.PaymentTerms,
	}

	if err := config.DB.Create(&contract).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "Failed to create a contract")
		return
	}

	data := map[string]string{
		"message": "Contract created successfully",
	}

	utils.SendSuccessResponse(c, http.StatusOK, data)

}

func GetContractByID(c *gin.Context) {
	// Validate JWT
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		c.Abort()
		return
	}

	// Extract contract ID from URL
	contractID := c.Param("id")
	if contractID == "" {
		utils.SendErrorResponse(c, http.StatusBadRequest, "missing contract ID")
		return
	}

	// Find contract
	var contract models.Contract
	if err := config.DB.Preload("Project").Preload("Task").First(&contract, "id = ?", contractID).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusNotFound, "contract not found")
		return
	}

	utils.SendSuccessResponse(c, http.StatusOK, contract)
}

func GetAllContracts(c *gin.Context) {
	// Validate JWT
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		c.Abort()
		return
	}

	// Fetch the single contract for this task
	var contracts []models.Contract
	if err := config.DB.
		Preload("Project", func(db *gorm.DB) *gorm.DB {
			return db.Select("id", "name", "category", "status")
		}).
		Preload("Task", func(db *gorm.DB) *gorm.DB {
			return db.Select("id", "title", "status", "due_date")
		}).
		Find(&contracts).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			utils.SendErrorResponse(c, http.StatusNotFound, "no contracts found")
			return
		}

		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to fetch contract")
		return
	}

	utils.SendSuccessResponse(c, http.StatusOK, contracts)
}

func GetContractByTaskID(c *gin.Context) {
	// Validate JWT
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		c.Abort()
		return
	}

	// Get TaskID from URL
	taskID := c.Param("task_id")
	if taskID == "" {
		utils.SendErrorResponse(c, http.StatusBadRequest, "missing task ID")
		return
	}

	// Fetch the single contract for this task
	var contract models.Contract
	if err := config.DB.
		Preload("Project", func(db *gorm.DB) *gorm.DB {
			return db.Select("id", "name", "category", "status")
		}).
		Preload("Task", func(db *gorm.DB) *gorm.DB {
			return db.Select("id", "title", "status", "due_date")
		}).
		Where("task_id = ?", taskID).
		First(&contract).Error; err != nil {

		if errors.Is(err, gorm.ErrRecordNotFound) {
			utils.SendSuccessResponse(c, http.StatusOK, nil)
			return
		}

		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to fetch contract")
		return
	}

	utils.SendSuccessResponse(c, http.StatusOK, contract)
}

func GetContractsByProjectID(c *gin.Context) {
	// Validate JWT
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		c.Abort()
		return
	}

	// Get project_id from URL
	projectID := c.Param("project_id")
	if projectID == "" {
		utils.SendErrorResponse(c, http.StatusBadRequest, "missing project ID")
		return
	}

	// Fetch all contracts under this project
	var contracts []models.Contract
	if err := config.DB.
		Preload("Project", func(db *gorm.DB) *gorm.DB {
			return db.Select("id", "name", "category", "status")
		}).
		Preload("Task", func(db *gorm.DB) *gorm.DB {
			return db.Select("id", "title", "status", "due_date")
		}).
		Where("project_id = ?", projectID).
		Find(&contracts).Error; err != nil {

		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to fetch contracts")
		return
	}

	// Handle case when no contracts found
	if len(contracts) == 0 {
		utils.SendSuccessResponse(c, http.StatusOK, []models.Contract{})
		return
	}

	utils.SendSuccessResponse(c, http.StatusOK, contracts)
}

func UpdateContract(c *gin.Context) {
	// Validate JWT
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		c.Abort()
		return
	}

	// Get contract_id from URL
	contractID := c.Param("id")
	if contractID == "" {
		utils.SendErrorResponse(c, http.StatusBadRequest, "missing contract ID")
		return
	}

	// Parse request body
	var input ContractInput
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.SendErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	// Find the contract
	var contract models.Contract
	if err := config.DB.First(&contract, "id = ?", contractID).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusNotFound, "contract not found")
		return
	}

	// Update fields if provided
	if input.Role != "" {
		contract.Role = input.Role
	}
	if len(input.Responsibilities) > 0 {
		contract.Responsibilities = input.Responsibilities
	}
	if input.Effort != "" {
		contract.Effort = input.Effort
	}
	if input.TimelineNotes != "" {
		contract.TimelineNotes = input.TimelineNotes
	}
	if input.PaymentTerms != "" {
		contract.PaymentTerms = input.PaymentTerms
	}
	if len(input.Deliverables) > 0 {
		contract.Deliverables = input.Deliverables
	}
	if !input.StartDate.IsZero() {
		contract.StartDate = input.StartDate
	}
	if !input.EndDate.IsZero() {
		contract.EndDate = input.EndDate
	}

	// Save updated contract
	if err := config.DB.Save(&contract).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to update contract")
		return
	}

	utils.SendSuccessResponse(c, http.StatusOK, map[string]interface{}{
		"message":  "Contract updated successfully",
		"contract": contract,
	})
}

func DeleteContract(c *gin.Context) {
	// Validate JWT
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		c.Abort()
		return
	}

	// Get contract ID from URL
	contractID := c.Param("id")
	if contractID == "" {
		utils.SendErrorResponse(c, http.StatusBadRequest, "missing contract ID")
		return
	}

	// Find the contract
	var contract models.Contract
	if err := config.DB.First(&contract, "id = ?", contractID).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusNotFound, "contract not found")
		return
	}

	// Delete the contract
	if err := config.DB.Delete(&contract).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to delete contract")
		return
	}

	utils.SendSuccessResponse(c, http.StatusOK, map[string]string{
		"message": "Contract deleted successfully",
	})
}
