package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Task represents individual tasks within a project
type Task struct {
	ID        uuid.UUID      `json:"id" gorm:"primaryKey"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`

	ProjectID uint   `json:"project_id" gorm:"not null"`
	Title     string `json:"title" gorm:"not null"`

	Description string `json:"description"`
	Status      string `json:"status" gorm:"default:'todo'"` // "todo", "in_progress", "review", "done"
	Priority    string `json:"priority" gorm:"default:'medium'"`

	// Timeline
	DueDate     *time.Time `json:"due_date"`
	CompletedAt *time.Time `json:"completed_at"`

	// Time tracking
	EstimatedHours float64 `json:"estimated_hours"`
	ActualHours    float64 `json:"actual_hours"`

	// Assignment (for outsourced work)
	AssignedToAssociate *uint `json:"assigned_to_associate"` // Foreign key to Associate

	// Relationships
	Project   Project    `json:"-" gorm:"foreignKey:ProjectID"`
	Associate *Associate `json:"assigned_associate" gorm:"foreignKey:AssignedToAssociate"`
}

func (u *Task) BeforeCreate(tx *gorm.DB) (err error) {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return nil
}
