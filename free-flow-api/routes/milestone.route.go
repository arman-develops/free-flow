package routes

import (
	"free-flow-api/controllers"
	"free-flow-api/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterMilestoneRouter(rg *gin.RouterGroup) {
	milestone := rg.Group("/milestone")
	milestone.Use(middleware.VerifyToken())
	{
		milestone.POST("/", controllers.CreateMilestone)
		milestone.GET("/", controllers.GetAllMilestones)
		milestone.GET("/:id", controllers.GetMilestoneByID)
		milestone.GET("/p/:id", controllers.GetMilestonesByProjectID)
		milestone.PUT("/:id", controllers.UpdateMilestone)
		milestone.DELETE("/:id", controllers.DeleteMilestone)
	}
}
