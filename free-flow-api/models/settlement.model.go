package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type AssociateSettlement struct {
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`

	ID            uuid.UUID `gorm:";primaryKey" json:"id"`
	ProjectID     uuid.UUID `json:"project_id"`
	TaskID        uuid.UUID `json:"task_id"`
	AssociateID   uuid.UUID `json:"associate_id"`
	UserID        uuid.UUID `json:"user_id"`
	PercentageCut float64   `json:"percentage_cut"` // e.g., 25.0 = 25%

	ExpectedAmount int64  `json:"expected_amount"` // calculated from project actual value
	SettledAmount  int64  `json:"settled_amount"`
	Method         string `json:"method"`
	TransactionRef string `json:"transaction_ref"`
	Status         string `json:"status" gorm:"default:'pending'"` // pending | partially_settled | settled

	SettledAt *time.Time `json:"settled_at"`

	Project   Project   `json:"-" gorm:"foreignKey:ProjectID"`
	Task      Task      `json:"-" gorm:"foreignKey:TaskID"`
	Associate Associate `json:"-" gorm:"foreignKey:AssociateID"`
	User      User      `json:"-" gorm:"foreignKey:UserID"`
}

func (u *AssociateSettlement) BeforeCreate(tx *gorm.DB) (err error) {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return nil
}
