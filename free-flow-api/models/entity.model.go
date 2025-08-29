package models

import (
	"strings"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Entity struct {
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
	ID        uuid.UUID      `json:"id" gorm:"type:uuid;primaryKey"`

	CompanyName string `json:"companyName" gorm:"size:100;not null"`
	Contact     string `json:"contact"`
	Email       string `json:"email"`

	UserID uuid.UUID `json:"user_id" gorm:"not null"`

	User     User      `json:"-" gorm:"foreignKey:UserID"`
	Projects []Project `json:"projects" gorm:"foreignKey:EntityID"`
}

func (u *Entity) BeforeCreate(tx *gorm.DB) (err error) {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	u.Email = strings.ToLower(strings.TrimSpace(u.Email))
	return nil
}
