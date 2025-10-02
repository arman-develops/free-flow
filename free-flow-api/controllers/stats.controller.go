package controllers

import (
	"free-flow-api/config"
	"free-flow-api/models"
	"free-flow-api/utils"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type DashboardStats struct {
	TotalProjects    int64   `json:"total_projects"`
	ProjectsChange   float64 `json:"projects_change"` // % change
	TotalClients     int64   `json:"total_clients"`
	ClientsThisMonth int64   `json:"clients_this_month"`
	RevenueThisMonth float64 `json:"revenue_this_month"`
	RevenueLastMonth float64 `json:"revenue_last_month"`
	RevenueChange    float64 `json:"revenue_change"`
}

type MonthlyStat struct {
	Month    string  `json:"month"`
	Revenue  float64 `json:"revenue"`
	Projects int64   `json:"projects"`
}

type ProjectCategoryStat struct {
	Category string `json:"category"`
	Count    int64  `json:"count"`
}

func GetDashboardStats(c *gin.Context) {
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		c.Abort()
		return
	}

	now := time.Now()

	// Define date ranges
	startOfThisMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
	startOfLastMonth := startOfThisMonth.AddDate(0, -1, 0)
	endOfLastMonth := startOfThisMonth.Add(-time.Nanosecond)

	var (
		totalProjects    int64
		thisMonthTotal   int64
		thisMonthActive  int64
		thisMonthClients int64
		totalClients     int64
		revenueThisMonth float64
		revenueLastMonth float64
	)

	// ----ACTIVE PROJECTS ----
	// total projects
	config.DB.Model(&models.Project{}).
		Where("user_id = ?", userID).
		Count(&totalProjects)

	// all active projects this month
	config.DB.Model(&models.Project{}).
		Where("user_id = ? AND created_at >= ? AND status = ?", userID, startOfThisMonth, "active").
		Count(&thisMonthTotal)

	// all projects this month
	config.DB.Model(&models.Project{}).
		Where("user_id = ? AND created_at >= ?", userID, startOfThisMonth).
		Count(&thisMonthActive)

	// ---- CLIENTS ----
	// Current month clients (Entities created this month)
	config.DB.Model(&models.Entity{}).
		Where("user_id = ? AND created_at >= ?", userID, startOfThisMonth).
		Count(&thisMonthClients)

	// Total clients
	config.DB.Model(&models.Entity{}).
		Where("user_id = ?", userID).
		Count(&totalClients)

	// ---- REVENUE ----
	// Current month revenue (confirmed payments)
	if err := config.DB.
		Model(&models.Payment{}).
		Where("user_id = ? AND status = ? AND paid_date >= ?", userID, "confirmed", startOfThisMonth).
		Select("COALESCE(SUM(amount), 0)").Scan(&revenueThisMonth).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to fetch revenue this month")
		return
	}

	// Last month revenue (confirmed payments)
	if err := config.DB.
		Model(&models.Payment{}).
		Where("user_id = ? AND status = ? AND paid_date BETWEEN ? AND ?", userID, "confirmed", startOfLastMonth, endOfLastMonth).
		Select("COALESCE(SUM(amount), 0)").Scan(&revenueLastMonth).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to fetch revenue last month")
		return
	}

	// ---- Calculate changes ----
	projectChange := utils.PercentChange(thisMonthTotal, thisMonthActive)
	revenueChange := utils.PercentChange(int64(revenueThisMonth), int64(revenueLastMonth))

	// ---- Response ----
	dash_stats := DashboardStats{
		TotalProjects:    totalProjects,
		ProjectsChange:   projectChange,
		ClientsThisMonth: thisMonthClients,
		TotalClients:     totalClients,
		RevenueThisMonth: revenueThisMonth,
		RevenueChange:    revenueChange,
	}

	resp := gin.H{
		"dashboard_stats": dash_stats,
	}

	utils.SendSuccessResponse(c, http.StatusOK, resp)
}

func GetAnalyticsStats(c *gin.Context) {
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		c.Abort()
		return
	}

	now := time.Now()
	location := now.Location()

	// Get the last 6 months including current month
	monthsBack := 6
	monthlyData := make([]gin.H, 0, monthsBack)

	for i := monthsBack - 1; i >= 0; i-- {
		startOfMonth := time.Date(now.Year(), now.Month()-time.Month(i), 1, 0, 0, 0, 0, location)
		endOfMonth := startOfMonth.AddDate(0, 1, 0).Add(-time.Nanosecond)

		var revenue float64
		var projects int64

		// Revenue for this month
		if err := config.DB.
			Model(&models.Payment{}).
			Where("user_id = ? AND status = ? AND paid_date BETWEEN ? AND ?", userID, "confirmed", startOfMonth, endOfMonth).
			Select("COALESCE(SUM(amount), 0)").Scan(&revenue).Error; err != nil {
			utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to fetch monthly revenue")
			return
		}

		// Projects for this month
		config.DB.Model(&models.Project{}).
			Where("user_id = ? AND created_at BETWEEN ? AND ?", userID, startOfMonth, endOfMonth).
			Count(&projects)

		monthlyData = append(monthlyData, gin.H{
			"month":    startOfMonth.Format("Jan"),
			"revenue":  revenue,
			"projects": projects,
		})
	}

	resp := gin.H{
		"revenue_stats": monthlyData,
	}

	utils.SendSuccessResponse(c, http.StatusOK, resp)
}

func GetProjectStats(c *gin.Context) {
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		c.Abort()
		return
	}

	var stats []ProjectCategoryStat

	// Query: group projects by category
	if err := config.DB.
		Model(&models.Project{}).
		Select("category, COUNT(*) as count").
		Where("user_id = ?", userID).
		Group("category").
		Scan(&stats).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to fetch project stats")
		return
	}

	utils.SendSuccessResponse(c, http.StatusOK, gin.H{
		"project_stats": stats,
	})
}
