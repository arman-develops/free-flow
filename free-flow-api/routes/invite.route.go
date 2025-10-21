package routes

import (
	"free-flow-api/controllers"
	"free-flow-api/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterInviteRouter(rg *gin.RouterGroup) {
	invite := rg.Group("/associate/invite")
	invite.Use(middleware.VerifyInvite())
	{
		invite.GET("/:token", controllers.GetInviteDetails)
		invite.POST("/invite/response/:token", controllers.InviteResponse)
	}
}
