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
		task.GET("/", controllers.GetAllTasks)
		task.GET("/:id", controllers.GetTasksByID)
		task.GET("p/:id", controllers.GetAllTasksByProjectID)
		task.PUT("/:id", controllers.UpdateTask)
		task.DELETE("/:id", controllers.DeleteTask)
	}

	associate := rg.Group("/associate")
	associate.Use(middleware.VerifyToken())
	{
		associate.GET("/tasks", controllers.GetAllTasksByAssociateID)
	}
}
