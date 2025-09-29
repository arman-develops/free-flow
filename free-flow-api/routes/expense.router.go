package routes

import (
	"free-flow-api/controllers"
	"free-flow-api/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterExpenseRouter(rg *gin.RouterGroup) {
	expense := rg.Group("/expense")
	expense.Use(middleware.VerifyToken())
	{
		expense.POST("/", controllers.CreateExpense)
		expense.GET("/", controllers.GetExpenses)
		expense.GET("/:id", controllers.GetExpenses)
		expense.PUT("/:id", controllers.UpdateExpense)
		expense.DELETE("/:id", controllers.DeleteExpense)
	}
}
