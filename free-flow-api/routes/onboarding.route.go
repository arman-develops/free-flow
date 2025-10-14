package routes

import (
	"free-flow-api/controllers"
	"free-flow-api/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterOnboardingRouter(rg *gin.RouterGroup) {
	onboarding := rg.Group("/onboarding/")
	onboarding.Use(middleware.VerifyOnboardingToken())
	{
		onboarding.POST("/associate/:token", controllers.OnboardAssociate)
	}
}
