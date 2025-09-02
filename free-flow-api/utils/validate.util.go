package utils

import (
	"free-flow-api/config"
	"free-flow-api/models"

	"github.com/google/uuid"
)

func EntityExists(entityID string) bool {
	parsed, err := uuid.Parse(entityID)
	if err != nil {
		return false
	}

	var entity models.Entity
	if err := config.DB.First(&entity, "id = ?", parsed).Error; err != nil {
		return false
	}

	return true
}

func ProjectExists(projectID string) bool {
	parsed, err := uuid.Parse(projectID)
	if err != nil {
		return false
	}

	var project models.Project
	if err := config.DB.First(&project, "id = ?", parsed).Error; err != nil {
		return false
	}

	return true
}
