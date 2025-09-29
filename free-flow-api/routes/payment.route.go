package routes

import (
	"free-flow-api/controllers"
	"free-flow-api/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterPaymentRouter(rg *gin.RouterGroup) {
	payment := rg.Group("/payment")
	payment.Use(middleware.VerifyToken())
	{
		payment.POST("/", controllers.CreatePayment)
		payment.GET("/", controllers.GetPayments)
		payment.GET("/:id", controllers.GetPaymentByID)
		payment.PUT("/:id", controllers.UpdatePayment)
		payment.DELETE("/:id", controllers.DeletePayment)
	}
}
