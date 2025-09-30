package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Expense struct {
	ID        uuid.UUID      `json:"id" gorm:"primaryKey"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`

	ProjectID   uuid.UUID `json:"project_id" gorm:"not null"`
	Amount      float64   `json:"amount" gorm:"not null"`
	Currency    string    `json:"currency" gorm:"default:'KES'"`
	Description string    `json:"description"`
	Category    string    `json:"category"` // "software", "hardware", "outsourcing", "other"
	Date        time.Time `json:"date"`

	Vendor string `json:"vendor"`

	// Relationships
	Project Project `json:"-" gorm:"foreignKey:ProjectID"`
}

func (u *Expense) BeforeCreate(tx *gorm.DB) (err error) {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return nil
}
