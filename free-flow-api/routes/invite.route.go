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
		invite.POST("/response/:token", controllers.InviteResponse)
	}

	user_view := rg.Group("/project/:id")
	user_view.Use(middleware.VerifyToken())
	{
		user_view.GET("invites/", controllers.GetInvitesByProjectID)
	}
}
