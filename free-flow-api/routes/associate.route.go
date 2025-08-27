package routes

import (
	"free-flow-api/controllers"
	"free-flow-api/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterAssociateRouter(rg *gin.RouterGroup) {
	associate := rg.Group("/associate")
	associate.Use(middleware.VerifyToken())
	{
		associate.POST("/", controllers.NewAssociate)
		associate.GET("/", controllers.GetAllAssociates)
	}
}
