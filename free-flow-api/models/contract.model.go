package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
	"gorm.io/gorm"
)

type Contract struct {
	ID        uuid.UUID      `json:"id" gorm:"primaryKey"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`

	TaskID    uuid.UUID `json:"task_id" gorm:"index"`
	ProjectID uuid.UUID `json:"project_id"`

	Role             string         `json:"role"`
	Responsibilities pq.StringArray `json:"responsibilities" gorm:"type:text[]"`
	Deliverables     pq.StringArray `json:"deliverables" gorm:"type:text[]"`

	Effort        string    `json:"effort"`
	StartDate     time.Time `json:"start_date"`
	EndDate       time.Time `json:"end_date"`
	TimelineNotes string    `json:"timeline_notes"`
	Timestamp     time.Time `json:"timestamp"`

	PaymentTerms string `json:"payment_terms"`

	Project Project `json:"project" gorm:"foreignKey:ProjectID"`
	Task    Task    `json:"task" gorm:"foreignKey:TaskID"`
}

func (m *Contract) BeforeCreate(tx *gorm.DB) (err error) {
	if m.ID == uuid.Nil {
		m.ID = uuid.New()
	}
	return nil
}
