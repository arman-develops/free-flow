package models

import (
	"strings"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID        uuid.UUID `json:"id" gorm:"type:uuid;primaryKey"`
	FirstName string    `json:"firstname" gorm:"size:100;not null"`
	LastName  string    `json:"lastname" gorm:"size:100;not null"`
	Email     string    `json:"email" gorm:"size:255;uniqueIndex;not null"`
	Password  string    `json:"-" gorm: size:255;not null"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated-at"`
}

func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	u.Email = strings.ToLower(strings.TrimSpace(u.Email))
	return nil
}
