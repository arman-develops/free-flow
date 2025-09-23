package models

import (
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
	"gorm.io/gorm"
)

type Associate struct {
	ID        uuid.UUID      `json:"id" gorm:"primaryKey"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`

	UserID uuid.UUID `json:"user_id" gorm:"not null"`
	Name   string    `json:"name" gorm:"not null"`
	Email  string    `json:"email"`
	Phone  string    `json:"phone"`

	Skills pq.StringArray `json:"skills" gorm:"type:text[]"`

	User     User      `json:"-" gorm:"foreignKey:UserID"`
	Projects []Project `json:"projects" gorm:"many2many:project_associates;"`
}

func (u *Associate) BeforeCreate(tx *gorm.DB) (err error) {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	u.Email = strings.ToLower(strings.TrimSpace(u.Email))
	return nil
}
