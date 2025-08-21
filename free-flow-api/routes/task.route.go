package routes

import (
	"free-flow-api/controllers"
	"free-flow-api/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterTaskRouter(rg *gin.RouterGroup) {
	task := rg.Group("/task")
	task.Use(middleware.VerifyToken())
	{
		task.POST("/", controllers.NewTask)
	}
}
