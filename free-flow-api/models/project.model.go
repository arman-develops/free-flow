package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// ProjectStatus enum
type ProjectStatus string

const (
	ProjectStatusInquiry   ProjectStatus = "inquiry"
	ProjectStatusProposal  ProjectStatus = "proposal"
	ProjectStatusActive    ProjectStatus = "active"
	ProjectStatusReview    ProjectStatus = "review"
	ProjectStatusCompleted ProjectStatus = "completed"
	ProjectStatusPaid      ProjectStatus = "paid"
	ProjectStatusCancelled ProjectStatus = "cancelled"
)

// ProjectPhase enum
type ProjectPhase string

const (
	PhaseDiscovery   ProjectPhase = "discovery"
	PhaseDesign      ProjectPhase = "design"
	PhaseDevelopment ProjectPhase = "development"
	PhaseReview      ProjectPhase = "review"
	PhaseDelivery    ProjectPhase = "delivery"
	PhasePayment     ProjectPhase = "payment"
)

// Project represents individual projects under an entity
type Project struct {
	ID        uuid.UUID      `json:"id" gorm:"primaryKey"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`

	UserID   uuid.UUID `json:"user_id" gorm:"not null"`
	EntityID uuid.UUID `json:"entity_id" gorm:"not null"`
	Name     string    `json:"name" gorm:"not null"`

	// Project details
	Description  string        `json:"description"`
	Status       ProjectStatus `json:"status" gorm:"default:'inquiry'"`
	CurrentPhase ProjectPhase  `json:"current_phase" gorm:"default:'discovery'"`
	Priority     string        `json:"priority" gorm:"default:'medium'"` // "low", "medium", "high", "urgent"

	// Timeline
	StartDate   *time.Time `json:"start_date"`
	Deadline    *time.Time `json:"deadline"`
	CompletedAt *time.Time `json:"completed_at"`

	// Financial
	EstimatedValue float64 `json:"estimated_value"`
	ActualValue    float64 `json:"actual_value"`
	Currency       string  `json:"currency" gorm:"default:'KES'"`

	// Outsourcing
	IsOutsourced   bool    `json:"is_outsourced" gorm:"default:false"`
	YourCutPercent float64 `json:"your_cut_percent" gorm:"default:0.0"` // e.g., 30.0 for 30%

	// Progress
	ProgressPercent int    `json:"progress_percent" gorm:"default:0"`
	Notes           string `json:"notes"`

	// Relationships
	Entity     Entity      `json:"entity" gorm:"foreignKey:EntityID"`
	Associates []Associate `json:"associates" gorm:"many2many:project_associates;"`
	Tasks      []Task      `json:"tasks" gorm:"foreignKey:ProjectID"`
	User       User        `json:"-" gorm:"foreignKey:UserID"`
}

func (u *Project) BeforeCreate(tx *gorm.DB) (err error) {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return nil
}
