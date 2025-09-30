package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Invoice for billing clients
type Invoice struct {
	ID        uuid.UUID      `json:"id" gorm:"primaryKey"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`

	UserID uuid.UUID `json:"user_id"`

	ProjectID     uuid.UUID `json:"project_id" gorm:"not null"`
	InvoiceNumber string    `gorm:"uniqueIndex"`
	Amount        float64   `json:"amount" gorm:"not null"`
	Currency      string    `json:"currency" gorm:"default:'KES'"`

	// Status and dates
	Status    string     `json:"status" gorm:"default:'draft'"` // "draft", "sent", "paid", "overdue", "cancelled"
	IssueDate time.Time  `json:"issue_date"`
	DueDate   time.Time  `json:"due_date"`
	PaidDate  *time.Time `json:"paid_date"`

	// Content
	Description string `json:"description"`
	Notes       string `json:"notes"`

	// Payment tracking
	PaymentMethod  string  `json:"payment_method"`  // "mpesa", "bank", "cash"
	TransactionRef *string `json:"transaction_ref"` // M-Pesa code, bank ref, etc.

	// Relationships
	Project Project `json:"-" gorm:"foreignKey:ProjectID"`
	User    User    `json:"-" gorm:"foreignKey:UserID"`
}

func (u *Invoice) BeforeCreate(tx *gorm.DB) (err error) {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return nil
}
