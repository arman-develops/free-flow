package models

import (
	"strings"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Entity struct {
	ID        uuid.UUID      `json:"id" gorm:"type:uuid;primaryKey"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`

	CompanyName string `json:"companyname" gorm:"size:100;not null"`
	Contact     string `json:"contact"`

	UserID uint   `json:"user_id" gorm:"not null"`
	Name   string `json:"name" gorm:"not null"`
	Email  string `json:"email"`
	Phone  string `json:"phone"`

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
