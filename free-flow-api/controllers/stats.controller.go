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

type AssociateStat struct {
	TotalAssociates            int64   `json:"total_associates"`
	ActiveAssociates           int64   `json:"active_associates"`
	TotalAssociateProjects     int64   `json:"total_associate_projects"`
	ActiveAssociateProjects    int64   `json:"active_associate_projects"`
	TotalCompletedTasks        int64   `json:"total_completed_tasks"`
	MonthlyCompletedTasks      int64   `json:"monthly_completed_tasks"`
	TotalAssociateEarnings     int64   `json:"total_associate_earnings"`
	AssociateEarningsPercent   float64 `json:"associate_earnings_percent"`
	AveragePerformance         float64 `json:"average_performance"`
	RatingDeviation            float64 `json:"rating_deviation"`
	EfficiencyRatePercent      float64 `json:"efficiency_rate_percent"`
	EfficiencyDeviationPercent float64 `json:"efficiency_deviation_percent"`
}

type FinanceStat struct {
	TotalRevenue          float64 `json:"total_revenue"`
	AnnualChange          float64 `json:"annual_revenue_change"`
	MonthlyRevenue        float64 `json:"monthly_revenue"`
	MonthlyRevenueChange  float64 `json:"monthly_revenue_change"`
	TotalExpenses         float64 `json:"total_expenses"`
	MonthlyExpensesChange float64 `json:"monthly_expenses_change"`
	Netprofit             float64 `json:"net_profit"`
	AnnualNetChange       float64 `json:"annual_net_change"`
	PendingPayments       float64 `json:"pending_payments"`
	OutstandingInvoices   int64   `json:"outstanding_invoices"`
	OverduePayments       float64 `json:"overdue_payments"`
	OverdueInvoices       int64   `json:"overdue_invoices"`
}

type AssociateSettlementStat struct {
	TotalPayable              float64 `json:"total_payable"`
	MonthlyPayableChange      float64 `json:"monthly_payable_change"`
	TotalSettledThisMonth     float64 `json:"total_settled_this_month"`
	MonthlyPayableOfTotal     float64 `json:"monthly_payable_of_total"`
	OutstandingBalance        float64 `json:"outstanding_balance"`
	PendingSettlements        int64   `json:"pending_settlements"`
	AverageSettlementTime     float64 `json:"average_settlement_time"`
	SettlementTimeImprovement float64 `json:"settlement_time_improvement"`
	ActiveAsociates           int64   `json:"active_associates"`
	PaymentSuccessRate        float64 `json:"payment_success_rate"`
	TotalTransactions         int64   `json:"total_transactions"`
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

func GetAssociateStats(c *gin.Context) {
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		c.Abort()
		return
	}

	//date ranges
	now := time.Now()
	start_of_this_month := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
	start_of_last_month := start_of_this_month.AddDate(0, -1, 0)
	end_of_last_month := start_of_this_month.Add(-time.Nanosecond)

	var (
		total_associates             int64
		active_associates            int64
		total_associate_projects     int64
		active_associate_projects    int64
		total_completed_tasks        int64
		monthly_completed_tasks      int64
		total_associate_earnings     int64
		associate_earnings_percent   float64
		average_performance          float64
		performance_rating_deviation float64
		efficiency_rate_percent      float64
		efficiency_deviation_percent float64
	)

	// total associates
	if err := config.DB.Model(&models.Associate{}).
		Where("user_id = ?", userID).
		Count(&total_associates).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to fetch total associates")
		return
	}

	// active associates
	if err := config.DB.
		Model(&models.Associate{}).
		Joins("JOIN tasks ON tasks.assigned_to_associate = associates.id").
		Joins("JOIN projects ON projects.id = tasks.project_id").
		Where("projects.is_outsourced = ?", true).
		Where("projects.status != ?", "completed").
		Where("tasks.status = ?", "in_progress").
		Where("tasks.assigned_to_associate IS NOT NULL").
		Where("projects.deleted_at IS NULL").
		Group("associates.id").
		Count(&active_associates).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to count active associates")
		return
	}

	// total associates projects
	if err := config.DB.Model(&models.Project{}).
		Where("user_id = ?", userID).
		Where("is_outsourced = ?", true).
		Count(&total_associate_projects).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to fetch total associates projects")
		return
	}

	//active associate projects
	if err := config.DB.Model(&models.Project{}).
		Where("user_id = ?", userID).
		Where("is_outsourced = ?", true).
		Where("status = ?", "active").
		Count(&active_associate_projects).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to fetch active associates projects")
		return
	}

	//total completed tasks
	if err := config.DB.Model(&models.Task{}).
		Joins("JOIN projects ON projects.id = tasks.project_id").
		Where("projects.is_outsourced = ?", true).
		Where("tasks.assigned_to_associate IS NOT NULL").
		Where("tasks.status = ?", "done").
		Where("projects.deleted_at IS NULL").
		Count(&total_completed_tasks).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to count completed tasks")
		return
	}

	//completed tasks this month
	if err := config.DB.Model(&models.Task{}).
		Joins("JOIN projects ON projects.id = tasks.project_id").
		Where("projects.is_outsourced = ?", true).
		Where("tasks.assigned_to_associate IS NOT NULL").
		Where("tasks.status = ?", "done").
		Where("projects.deleted_at is NULL").
		Where("tasks.created_at >= ?", start_of_this_month).
		Count(&monthly_completed_tasks).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to count completed tasks this month")
		return
	}

	//total_associate earnings
	if err := config.DB.Model(&models.AssociateSettlement{}).
		Where("user_id = ?", userID).
		Select("COALESCE(SUM(settled_amount), 0)").
		Scan(&total_associate_earnings).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to fetch total associate earnings")
		return
	}

	//associate earnings percent
	var total_revenue int64
	if err := config.DB.
		Model(&models.Payment{}).
		Where("user_id = ? AND status = ?", userID, "confirmed").
		Select("COALESCE(SUM(amount), 0)").Scan(&total_revenue).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to fetch total revenue")
		return
	}
	if total_associate_earnings > 0 {
		associate_earnings_percent = (float64(total_revenue) / float64(total_associate_earnings)) * 100
	}

	//average performance
	var total_assinged_tasks int64
	var total_tasks_completed int64

	if err := config.DB.
		Model(&models.Task{}).
		Where("assigned_to_associate IS NOT NULL").
		Select("COUNT(*)").
		Scan(&total_assinged_tasks).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to fetch total assigned tasks")
		return
	}

	if err := config.DB.
		Model(&models.Task{}).
		Where("assigned_to_associate IS NOT NULL AND status = ?", "done").
		Select("COUNT(*)").
		Scan(&total_tasks_completed).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to fetch total completed tasks")
		return
	}

	average_performance = 0.0
	if total_assinged_tasks > 0 {
		average_performance = float64(total_completed_tasks) / float64(total_assinged_tasks) * 5
	}

	//average efficiency
	if err := config.DB.
		Model(&models.Task{}).
		Where("assigned_to_associate IS NOT NULL AND actual_hours > 0").
		Select("COALESCE(AVG(estimated_hours / actual_hours * 100), 0)").
		Scan(&efficiency_rate_percent).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to fetch efficiency rate")
		return
	}

	//performance deviation
	var (
		totalAssignedLast  float64
		totalCompletedLast float64
		avgEfficiencyAll   float64
		avgEfficiencyLast  float64
	)

	if err := config.DB.
		Model(&models.Task{}).
		Joins("JOIN projects ON tasks.project_id = projects.id").
		Where(`
			projects.user_id = ? 
			AND projects.is_outsourced = ? 
			AND tasks.assigned_to_associate IS NOT NULL 
			AND tasks.created_at BETWEEN ? AND ?`,
			userID, true, start_of_last_month, end_of_last_month).
		Select("COUNT(*)").
		Scan(&totalAssignedLast).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to fetch last month's assigned tasks")
		return
	}

	if err := config.DB.
		Model(&models.Task{}).
		Joins("JOIN projects ON tasks.project_id = projects.id").
		Where(`
			projects.user_id = ? 
			AND projects.is_outsourced = ? 
			AND tasks.assigned_to_associate IS NOT NULL 
			AND tasks.status = ? 
			AND tasks.created_at BETWEEN ? AND ?`,
			userID, true, "done", start_of_last_month, end_of_last_month).
		Select("COUNT(*)").
		Scan(&totalCompletedLast).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to fetch last month's completed tasks")
		return
	}

	averagePerformanceLast := 0.0
	if totalAssignedLast > 0 {
		averagePerformanceLast = (totalCompletedLast / totalAssignedLast) * 5
	}

	performance_rating_deviation = 0.0
	if averagePerformanceLast > 0 {
		performance_rating_deviation = ((average_performance - averagePerformanceLast) / averagePerformanceLast) * 100
	}

	//efficiency deviation
	if err := config.DB.
		Model(&models.Task{}).
		Joins("JOIN projects ON tasks.project_id = projects.id").
		Where(`
			projects.user_id = ? 
			AND projects.is_outsourced = ? 
			AND tasks.assigned_to_associate IS NOT NULL 
			AND tasks.actual_hours > 0
			AND tasks.created_at BETWEEN ? AND ?`,
			userID, true, start_of_last_month, end_of_last_month).
		Select("COALESCE(AVG(tasks.estimated_hours / tasks.actual_hours * 100), 0)").
		Scan(&avgEfficiencyLast).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to fetch last month's efficiency rate")
		return
	}

	efficiency_deviation_percent = 0.0
	if avgEfficiencyLast > 0 {
		efficiency_deviation_percent = ((avgEfficiencyAll - avgEfficiencyLast) / avgEfficiencyLast) * 100
	}

	stats := AssociateStat{
		TotalAssociates:            total_associates,
		ActiveAssociates:           active_associates,
		TotalAssociateProjects:     total_associate_projects,
		ActiveAssociateProjects:    active_associate_projects,
		TotalCompletedTasks:        total_completed_tasks,
		MonthlyCompletedTasks:      monthly_completed_tasks,
		TotalAssociateEarnings:     total_associate_earnings,
		AssociateEarningsPercent:   associate_earnings_percent,
		AveragePerformance:         average_performance,
		EfficiencyRatePercent:      efficiency_rate_percent,
		RatingDeviation:            performance_rating_deviation,
		EfficiencyDeviationPercent: efficiency_deviation_percent,
	}

	utils.SendSuccessResponse(c, http.StatusOK, stats)
}

func GetFinanceStats(c *gin.Context) {
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		c.Abort()
		return
	}

	var (
		total_revenue            float64
		annual_revenue           float64
		last_year_revenue        float64
		annual_revenue_change    float64
		monthly_revenue          float64
		last_month_revenue       float64
		monthly_revenue_change   float64
		total_expenses           float64
		last_month_expense       float64
		monthly_expenses_change  float64
		total_revenue_this_year  float64
		total_revenue_last_year  float64
		total_expenses_this_year float64
		total_expenses_last_year float64
		net_profit               float64
		net_profit_last_year     float64
		annual_net_change        float64
		pending_payments         float64
		outstanding_invoices     int64
		overdue_payments         float64
		overdue_invoices         int64
	)

	now := time.Now()
	start_of_year := time.Date(now.Year(), time.January, 1, 0, 0, 0, 0, now.Location())
	start_of_last_year := time.Date(now.Year()-1, time.January, 1, 0, 0, 0, 0, now.Location())
	end_of_last_year := start_of_year.Add(-time.Nanosecond)
	start_of_this_month := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
	start_of_last_month := start_of_this_month.AddDate(0, -1, 0)
	end_of_last_month := start_of_this_month.Add(-time.Nanosecond)

	//total revenue
	if err := config.DB.Model(&models.Payment{}).
		Where("user_id = ? AND status = ?", userID, "confirmed").
		Select("COALESCE(SUM(amount), 0)").
		Scan(&total_revenue).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to fetch total revenue")
		return
	}

	//annual revenue change
	//annual revenue this year
	if err := config.DB.Model(&models.Payment{}).
		Where("user_id = ? AND status = ?", userID, "confirmed").
		Where("paid_date >= ?", start_of_year).
		Select("COALESCE(SUM(amount), 0)").
		Scan(&annual_revenue).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to fetch annual revenue")
		return
	}
	//annual revenue last year
	if err := config.DB.Model(&models.Payment{}).
		Where("user_id = ? AND status = ?", userID, "confirmed").
		Where("paid_date BETWEEN ? AND ?", start_of_last_year, end_of_last_year).
		Select("COALESCE(SUM(amount), 0)").
		Scan(&last_year_revenue).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to fetch last year's revenue")
		return
	}
	//revenue change
	if last_year_revenue > 0 {
		annual_revenue_change = ((annual_revenue - last_year_revenue) / last_year_revenue) * 100
	} else {
		annual_revenue_change = 0
	}

	//monthly revenue (this month)
	if err := config.DB.Model(&models.Payment{}).
		Where("user_id = ? AND status = ?", userID, "confirmed").
		Where("paid_date >= ?", start_of_this_month).
		Select("COALESCE(SUM(amount), 0)").
		Scan(&monthly_revenue).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to fetch monthly revenue")
		return
	}
	//last months revenue
	if err := config.DB.Model(&models.Payment{}).
		Where("user_id = ? AND status = ?", userID, "confirmed").
		Where("paid_date BETWEEN ? AND ?", start_of_last_month, end_of_last_month).
		Select("COALESCE(SUM(amount), 0)").
		Scan(&last_month_revenue).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to fetch last month's revenue")
		return
	}
	//monthly revenue change
	if last_month_revenue > 0 {
		monthly_revenue_change = ((monthly_revenue - last_month_revenue) / last_month_revenue) * 100
	} else {
		monthly_revenue_change = 0
	}

	//total expenses (this month)
	if err := config.DB.Model(&models.Expense{}).
		Where("user_id = ?", userID).
		Where("date >= ?", start_of_this_month).
		Select("COALESCE(SUM(amount), 0)").
		Scan(&total_expenses).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to fetch total expenses this month")
		return
	}

	//total expenses last month
	if err := config.DB.Model(&models.Expense{}).
		Where("user_id = ?", userID).
		Where("date BETWEEN ? AND ?", start_of_last_month, end_of_last_month).
		Select("COALESCE(SUM(amount), 0)").
		Scan(&last_month_expense).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to fetch last month's expenses")
		return
	}

	//monthly expenses change
	if last_month_expense > 0 {
		monthly_expenses_change = ((total_expenses - last_month_expense) / last_month_expense) * 100
	} else {
		monthly_expenses_change = 0
	}

	//revenue this year and last year
	// This year's revenue
	if err := config.DB.Model(&models.Payment{}).
		Where("user_id = ? AND paid_date >= ?", userID, start_of_year).
		Select("COALESCE(SUM(amount), 0)").
		Scan(&total_revenue_this_year).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to fetch this year's revenue")
		return
	}

	// Last year's revenue
	if err := config.DB.Model(&models.Payment{}).
		Where("user_id = ? AND paid_date BETWEEN ? AND ?", userID, start_of_last_year, end_of_last_year).
		Select("COALESCE(SUM(amount), 0)").
		Scan(&total_revenue_last_year).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to fetch last year's revenue")
		return
	}

	//expenses this year and last year
	// This year's expenses
	if err := config.DB.Model(&models.Expense{}).
		Where("user_id = ? AND date >= ?", userID, start_of_year).
		Select("COALESCE(SUM(amount), 0)").
		Scan(&total_expenses_this_year).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to fetch this year's expenses")
		return
	}

	// Last year's expenses
	if err := config.DB.Model(&models.Expense{}).
		Where("user_id = ? AND date BETWEEN ? AND ?", userID, start_of_last_year, end_of_last_year).
		Select("COALESCE(SUM(amount), 0)").
		Scan(&total_expenses_last_year).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to fetch last year's expenses")
		return
	}

	// Compute net profit for each year
	net_profit = total_revenue_this_year - total_expenses_this_year
	net_profit_last_year = total_revenue_last_year - total_expenses_last_year

	// Compute annual change (percentage)
	if net_profit_last_year != 0 {
		annual_net_change = ((net_profit - net_profit_last_year) / net_profit_last_year) * 100
	} else {
		annual_net_change = 0
	}

	// Invoices marked as "sent" or "pending" but not yet "paid"
	if err := config.DB.Model(&models.Invoice{}).
		Where("user_id = ? AND status IN ?", userID, []string{"sent", "pending"}).
		Select("COALESCE(SUM(amount), 0)").
		Scan(&pending_payments).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to fetch pending payments")
		return
	}

	// Total invoices still unpaid (not "paid" or "cancelled")
	if err := config.DB.Model(&models.Invoice{}).
		Where("user_id = ? AND status NOT IN ?", userID, []string{"paid", "cancelled"}).
		Count(&outstanding_invoices).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to fetch outstanding invoices count")
		return
	}

	// Invoices past due date and not paid
	if err := config.DB.Model(&models.Invoice{}).
		Where("user_id = ? AND status NOT IN ? AND due_date < ?", userID, []string{"paid", "cancelled"}, now).
		Select("COALESCE(SUM(amount), 0)").
		Scan(&overdue_payments).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to fetch overdue payments total")
		return
	}

	// Count invoices past due date and not yet paid
	if err := config.DB.Model(&models.Invoice{}).
		Where("user_id = ? AND status NOT IN ? AND due_date < ?", userID, []string{"paid", "cancelled"}, now).
		Count(&overdue_invoices).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to fetch overdue invoices count")
		return
	}

	stats := FinanceStat{
		TotalRevenue:          total_revenue,
		AnnualChange:          annual_revenue_change,
		MonthlyRevenue:        monthly_revenue,
		MonthlyRevenueChange:  monthly_revenue_change,
		TotalExpenses:         total_expenses,
		MonthlyExpensesChange: monthly_expenses_change,
		Netprofit:             net_profit,
		AnnualNetChange:       annual_net_change,
		PendingPayments:       pending_payments,
		OutstandingInvoices:   outstanding_invoices,
		OverduePayments:       overdue_payments,
		OverdueInvoices:       overdue_invoices,
	}

	utils.SendSuccessResponse(c, http.StatusOK, stats)
}

func GetAssociateSettlementStats(c *gin.Context) {
	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		c.Abort()
		return
	}

	var (
		total_payable            float64
		monthly_payable_change   float64
		monthly_payable_of_total float64
		totalSettledLastMonth    float64
		totalSettledThisMonth    float64
		outstanding_balance      float64
		pending_settlements      int64
		avgSettlementThisMonth   float64
		avgSettlementLastMonth   float64
		avgSettlementChange      float64
		active_associates        int64
		totalTransactions        int64
		settledTransactions      int64
		payment_success_rate     float64
		total_transactions       int64
	)

	now := time.Now()
	start_of_this_month := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
	start_of_last_month := start_of_this_month.AddDate(0, -1, 0)
	end_of_last_month := start_of_this_month.Add(-time.Nanosecond)

	//total payable
	if err := config.DB.Model(&models.AssociateSettlement{}).
		Where("user_id = ? AND status = ?", userID, "pending").
		Select("COALESCE(SUM(expected_amount), 0)").
		Scan(&total_payable).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "could not fetch total payable")
		return
	}
	// total settled this month
	if err := config.DB.Model(&models.AssociateSettlement{}).
		Where("user_id = ? AND status = ? AND settled_at >= ? AND settled_at <= ?",
			userID, "settled", start_of_this_month, now).
		Select("COALESCE(SUM(expected_amount), 0)").
		Scan(&totalSettledThisMonth).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "could not fetch total settled this month")
		return
	}
	// total settled last month
	if err := config.DB.Model(&models.AssociateSettlement{}).
		Where("user_id = ? AND status = ? AND settled_at >= ? AND settled_at <= ?",
			userID, "settled", start_of_last_month, end_of_last_month).
		Select("COALESCE(SUM(expected_amount), 0)").
		Scan(&totalSettledLastMonth).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "could not fetch total settled last month")
		return
	}
	// calculate monthly change
	if totalSettledLastMonth != 0 {
		monthly_payable_change = ((totalSettledThisMonth - totalSettledLastMonth) / totalSettledLastMonth) * 100
	} else if totalSettledThisMonth > 0 {
		// avoid division by zero — consider this 100% increase
		monthly_payable_change = 100
	} else {
		monthly_payable_change = 0
	}

	// percentage of monthly payable from total payable
	if total_payable != 0 {
		monthly_payable_of_total = (totalSettledThisMonth / total_payable) * 100
	} else {
		monthly_payable_of_total = 0
	}

	//outstanding balance
	outstanding_balance = total_payable - totalSettledThisMonth
	//pending settlements
	if err := config.DB.Model(&models.AssociateSettlement{}).
		Where("user_id = ? AND status = ?", userID, "pending").
		Count(&pending_settlements).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "could not fetch total payable")
		return
	}

	//avaerage settlement time
	if err := config.DB.
		Model(&models.AssociateSettlement{}).
		Where("user_id = ? AND status = ?", userID, "settled").
		Where("settled_at >= ?", start_of_this_month).
		Select("COALESCE(AVG(EXTRACT(EPOCH FROM (settled_at - created_at)) / 86400), 0)").
		Scan(&avgSettlementThisMonth).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "could not calculate avg settlement time this month")
		return
	}

	// Average settlement time last month (in days)
	if err := config.DB.
		Model(&models.AssociateSettlement{}).
		Where("user_id = ? AND status = ?", userID, "settled").
		Where("settled_at BETWEEN ? AND ?", start_of_last_month, end_of_last_month).
		Select("COALESCE(AVG(EXTRACT(EPOCH FROM (settled_at - created_at)) / 86400), 0)").
		Scan(&avgSettlementLastMonth).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "could not calculate avg settlement time last month")
		return
	}

	// Calculate change percentage
	if avgSettlementLastMonth != 0 {
		avgSettlementChange = ((avgSettlementThisMonth - avgSettlementLastMonth) / avgSettlementLastMonth) * 100
	} else {
		avgSettlementChange = 0 // avoid divide-by-zero
	}

	// active associates
	if err := config.DB.
		Model(&models.Associate{}).
		Joins("JOIN tasks ON tasks.assigned_to_associate = associates.id").
		Joins("JOIN projects ON projects.id = tasks.project_id").
		Where("projects.is_outsourced = ?", true).
		Where("projects.status != ?", "completed").
		Where("tasks.status = ?", "in_progress").
		Where("tasks.assigned_to_associate IS NOT NULL").
		Where("projects.deleted_at IS NULL").
		Group("associates.id").
		Count(&active_associates).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to count active associates")
		return
	}

	//total transactions
	if err := config.DB.
		Model(&models.AssociateSettlement{}).
		Where("user_id = ? AND status = ?", userID, "settled").
		Count(&total_transactions).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "could not fetch total settled transactions")
		return
	}

	// Total
	if err := config.DB.
		Model(&models.AssociateSettlement{}).
		Where("user_id = ?", userID).
		Count(&totalTransactions).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "could not fetch total transactions")
		return
	}

	// Settled
	if err := config.DB.
		Model(&models.AssociateSettlement{}).
		Where("user_id = ? AND status = ?", userID, "settled").
		Count(&settledTransactions).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "could not fetch settled transactions")
		return
	}

	// Compute success rate
	if totalTransactions > 0 {
		payment_success_rate = (float64(settledTransactions) / float64(totalTransactions)) * 100
	} else {
		payment_success_rate = 0
	}

	resp := AssociateSettlementStat{
		TotalPayable:              total_payable,
		MonthlyPayableChange:      monthly_payable_change,
		TotalSettledThisMonth:     totalSettledThisMonth,
		MonthlyPayableOfTotal:     monthly_payable_of_total,
		OutstandingBalance:        outstanding_balance,
		PendingSettlements:        pending_settlements,
		AverageSettlementTime:     avgSettlementThisMonth,
		SettlementTimeImprovement: avgSettlementChange,
		ActiveAsociates:           active_associates,
		PaymentSuccessRate:        payment_success_rate,
		TotalTransactions:         total_transactions,
	}
	utils.SendSuccessResponse(c, http.StatusOK, resp)
}
