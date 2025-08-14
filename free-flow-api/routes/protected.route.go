package routes

import (
	"free-flow-api/controllers"
	"free-flow-api/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterProtectedRouter(rg *gin.RouterGroup) {
	protected := rg.Group("/protected")
	protected.Use(middleware.VerifyToken())
	{
		protected.GET("/", controllers.Protected)
	}
}
