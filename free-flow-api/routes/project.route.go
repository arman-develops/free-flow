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
	}
}
