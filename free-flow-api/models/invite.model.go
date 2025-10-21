package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Invite struct {
	ID        uuid.UUID      `json:"id" gorm:"primaryKey"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`

	TaskID      uuid.UUID `json:"task_id"`
	ProjectID   uuid.UUID `json:"project_id"`
	AssociateID uuid.UUID `json:"associate_id"`
	ContractID  uuid.UUID `json:"contract_id"`

	Status      string    `json:"status"`
	RespondedAt time.Time `json:"responded_at"`

	Project   Project   `json:"project" gorm:"foreignKey:ProjectID"`
	Task      Task      `json:"task" gorm:"foreignKey:TaskID"`
	Associate Associate `json:"associate" gorm:"foreignKey:AssociateID"`
	Contract  Contract  `json:"contract" gorm:"foreignKey:ContractID"`
}

func (m *Invite) BeforeCreate(tx *gorm.DB) (err error) {
	if m.ID == uuid.Nil {
		m.ID = uuid.New()
	}
	return nil
}
