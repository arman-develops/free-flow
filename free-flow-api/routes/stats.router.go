package routes

import (
	"free-flow-api/controllers"
	"free-flow-api/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterStatsRouter(rg *gin.RouterGroup) {
	stats := rg.Group("/stats")
	stats.Use(middleware.VerifyToken())
	{
		stats.GET("/dashboard", controllers.GetDashboardStats)
		stats.GET("/dashboard/revenue", controllers.GetAnalyticsStats)
		stats.GET("/dashboard/projects", controllers.GetProjectStats)
	}
}
