package routes

import (
	"free-flow-api/controllers"
	"free-flow-api/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterOnboardingRouter(rg *gin.RouterGroup) {
	onboarding := rg.Group("/associate/onboarding")
	onboarding.Use(middleware.VerifyOnboardingToken())
	{
		onboarding.POST("/:token", controllers.OnboardAssociate)
	}
}
