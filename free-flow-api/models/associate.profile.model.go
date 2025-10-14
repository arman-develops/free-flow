package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
	"gorm.io/gorm"
)

type AssociateProfile struct {
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`

	ID          uuid.UUID `json:"id" gorm:"primaryKey"`
	AssociateID uuid.UUID `json:"associate_id" gorm:"not null;uniqueIndex"` // Link to your existing Associate model

	PasswordHash    string  `json:"password" gorm:"not null"` // bcrypt hash
	PhoneNumber     *string `json:"phone_number" gorm:"size:20"`
	ProfilePhotoURL *string `json:"profile_photo_url"`
	Bio             *string `json:"bio" gorm:"size:500"`

	// Onboarding
	IsOnboarded bool `json:"is_onboarded" gorm:"default:false"`

	// Marketplace
	HasMarketplaceAccess *bool   `json:"has_marketplace_access" gorm:"default:false"`
	MarketplaceStatus    *string `json:"marketplace_status" gorm:"default:'inactive'"` // inactive, pending, approved, suspended

	// Verification
	IsVerified        bool       `json:"is_verified" gorm:"default:false"`
	VerificationLevel string     `json:"verification_level" gorm:"default:'basic'"` // e.g. "basic", "advanced", "kyc"
	VerifiedAt        *time.Time `json:"verified_at"`
	VerificationNotes *string    `json:"verification_notes"` // internal admin note (why verified/denied)

	// Professional details (optional)
	PortfolioURL *string        `json:"portfolio_url"`
	LinkedInURL  *string        `json:"linkedin_url"`
	WebsiteURL   *string        `json:"website_url"`
	Skills       pq.StringArray `gorm:"type:text[]"`

	// System tracking
	LastLoginAt    *time.Time
	LastActivityAt *time.Time
}

func (u *AssociateProfile) BeforeCreate(tx *gorm.DB) (err error) {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return nil
}
