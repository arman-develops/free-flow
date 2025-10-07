package routes

import (
	"free-flow-api/controllers"
	"free-flow-api/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterSettlementRouter(rg *gin.RouterGroup) {
	settlement := rg.Group("/settlements")
	settlement.Use(middleware.VerifyToken())
	{
		settlement.GET("/recent", controllers.GetRecentSettlements)
		settlement.GET("/history", controllers.GetSettlementHistory)
	}
}
