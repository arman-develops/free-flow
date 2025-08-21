package routes

import (
	"free-flow-api/controllers"
	"free-flow-api/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterEntityRouter(rg *gin.RouterGroup) {
	entity := rg.Group("/entity")
	entity.Use(middleware.VerifyToken())
	{
		entity.POST("/", controllers.NewEntity)
	}
}
