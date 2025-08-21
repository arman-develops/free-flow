package utils

import (
	"free-flow-api/config"
	"free-flow-api/models"

	"github.com/google/uuid"
)

func IsAuthenticated(userID string) bool {
	parsed, err := uuid.Parse(userID)
	if err != nil {
		return false
	}
	var user models.User
	if err := config.DB.First(&user, "id = ?", parsed).Error; err != nil {
		return false
	}
	return true
}
