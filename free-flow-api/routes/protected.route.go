package routes

import (
	"free-flow-api/controllers"

	"github.com/gin-gonic/gin"
)

func RegisterProtectedRouter(rg *gin.RouterGroup) {
	protected := rg.Group("/protected")
	{
		protected.GET("/", controllers.Protected)
	}
}
