package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Payment struct {
	ID        uuid.UUID      `json:"id" gorm:"primaryKey"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`

	InvoiceID uuid.UUID `json:"invoice_id" gorm:"not null"`
	Amount    float64   `json:"amount" gorm:"not null"`
	Currency  string    `json:"currency" gorm:"default:'KES'"`

	Method         string    `json:"method"`          // "mpesa", "bank", "cash"
	TransactionRef string    `json:"transaction_ref"` // MPesa code, bank ref, etc.
	PaidDate       time.Time `json:"paid_date"`

	Status string `json:"status"` // "pending", "confirmed", "failed"

	Notes *string `json:"notes"`

	Invoice Invoice `json:"-" gorm:"foreignKey:InvoiceID"`
}

func (u *Payment) BeforeCreate(tx *gorm.DB) (err error) {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return nil
}
