package models

import (
	"time"

	"github.com/google/uuid"
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
