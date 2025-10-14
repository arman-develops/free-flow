package routes

import (
	"free-flow-api/controllers"

	"github.com/gin-gonic/gin"
)

func RegisterUserRouter(rg *gin.RouterGroup) {
	users := rg.Group("/user")
	{
		users.POST("/signup", controllers.Signup)
		users.POST("/login", controllers.Login)
		users.POST("/associate/login", controllers.AssociateLogin)
	}
}
