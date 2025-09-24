package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type TaskStatus string

const (
	TaskStatusTodo       TaskStatus = "todo"
	TaskStatusInProgress TaskStatus = "inprogress"
	TaskStatusReview     TaskStatus = "review"
	TaskStatusDone       TaskStatus = "done"
	TaskStatusPaid       TaskStatus = "paid"
)

// Task represents individual tasks within a project
type Task struct {
	ID        uuid.UUID      `json:"id" gorm:"primaryKey"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`

	ProjectID uuid.UUID `json:"project_id" gorm:"not null"`
	Title     string    `json:"title" gorm:"not null"`

	Description string     `json:"description"`
	Status      TaskStatus `json:"status" gorm:"default:'todo'"` // "todo", "in_progress", "review", "done"
	Priority    string     `json:"priority" gorm:"default:'medium'"`

	// Timeline
	StartDate   *time.Time `json:"start_date"`
	DueDate     *time.Time `json:"due_date"`
	CompletedAt *time.Time `json:"completed_at"`

	// Time tracking
	EstimatedHours float64 `json:"estimated_hours"`
	ActualHours    float64 `json:"actual_hours"`

	// finances
	TaskValue float64 `json:"task_value"`

	// Assignment (for outsourced work)
	AssignedToAssociate *uuid.UUID `json:"assigned_to_associate"` // Foreign key to Associate

	// Relationships
	Project   Project    `json:"-" gorm:"foreignKey:ProjectID"`
	Associate *Associate `json:"assigned_associate" gorm:"foreignKey:AssignedToAssociate"`
}

func (u *Task) BeforeCreate(tx *gorm.DB) (err error) {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return nil
}

func (t *Task) AfterSave(tx *gorm.DB) (err error) {
	return updateProjectStats(tx, t.ProjectID)
}

func (t *Task) AfterDelete(tx *gorm.DB) (err error) {
	return updateProjectStats(tx, t.ProjectID)
}

func updateProjectStats(tx *gorm.DB, projectID uuid.UUID) error {
	// 1. Calculate total task value
	var totalValue float64
	if err := tx.Model(&Task{}).
		Where("project_id = ?", projectID).
		Select("COALESCE(SUM(task_value), 0)").
		Scan(&totalValue).Error; err != nil {
		return err
	}

	// 2. Count total tasks
	var totalTasks int64
	if err := tx.Model(&Task{}).
		Where("project_id = ?", projectID).
		Count(&totalTasks).Error; err != nil {
		return err
	}

	// 3. Count completed tasks (assuming "done" is the completed status)
	var doneTasks int64
	if err := tx.Model(&Task{}).
		Where("project_id = ? AND status = ?", projectID, "done").
		Count(&doneTasks).Error; err != nil {
		return err
	}

	// 4. Compute progress
	progress := 0
	if totalTasks > 0 {
		progress = int((float64(doneTasks) / float64(totalTasks)) * 100)
	}

	// 5. Update the project
	return tx.Model(&Project{}).
		Where("id = ?", projectID).
		Updates(map[string]interface{}{
			"actual_value":     totalValue,
			"progress_percent": progress,
		}).Error
}
