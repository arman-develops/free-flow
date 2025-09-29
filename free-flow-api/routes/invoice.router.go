package routes

import (
	"free-flow-api/controllers"
	"free-flow-api/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterInvoiceRouter(rg *gin.RouterGroup) {
	invoice := rg.Group("/invoice")
	invoice.Use(middleware.VerifyToken())
	{
		invoice.POST("/", controllers.CreateInvoice)
		invoice.GET("/", controllers.GetInvoices)
		invoice.GET("/:id", controllers.GetInvoices)
		invoice.PUT("/:id", controllers.UpdateInvoice)
		invoice.DELETE("/:id", controllers.DeleteInvoice)
	}
}
