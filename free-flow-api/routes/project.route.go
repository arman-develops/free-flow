package routes

import (
	"free-flow-api/controllers"
	"free-flow-api/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterProjectRouter(rg *gin.RouterGroup) {
	project := rg.Group("/project")
	project.Use(middleware.VerifyToken())
	{
		project.POST("/", controllers.NewProject)
		project.GET("/", controllers.GetAllProjects)
		project.GET("/e/:id", controllers.GetProjectByEntityID)
		project.GET("/u", controllers.GetProjectsByUserID)
		project.GET("/:id", controllers.GetProjectByID)
		project.PUT("/:id", controllers.UpdateProject)
		project.DELETE("/:id", controllers.DeleteProject)
	}
}
