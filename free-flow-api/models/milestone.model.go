package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
	"gorm.io/gorm"
)

type Milestone struct {
	ID        uuid.UUID      `json:"id" gorm:"primaryKey"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`

	ProjectID   uuid.UUID `json:"project_id" gorm:"not null"`
	Title       string    `json:"title" gorm:"not null"`
	Description string    `json:"description"`
	Status      string    `json:"status" gorm:"default:'not_started'"` // "not_started", "in_progress", "completed", "delayed"
	Priority    string    `json:"priority" gorm:"default:'medium'"`

	StartDate     *time.Time `json:"start_date"`
	DueDate       *time.Time `json:"due_date"`
	CompletedDate *time.Time `json:"completed_date"`

	// Progress tracking
	Progress       int   `json:"progress" gorm:"default:0"` // auto-updated via tasks
	TasksCount     int64 `json:"tasks_count" gorm:"default:0"`
	CompletedTasks int64 `json:"completed_tasks" gorm:"default:0"`

	Deliverables  pq.StringArray `json:"deliverables" gorm:"type:text[]"`
	ClientVisible bool           `json:"client_visible" gorm:"default:true"`

	// Relationships
	Project Project `json:"-" gorm:"foreignKey:ProjectID"`
	Tasks   []Task  `json:"tasks" gorm:"foreignKey:MilestoneID"`
}

func (m *Milestone) BeforeCreate(tx *gorm.DB) (err error) {
	if m.ID == uuid.Nil {
		m.ID = uuid.New()
	}
	return nil
}
