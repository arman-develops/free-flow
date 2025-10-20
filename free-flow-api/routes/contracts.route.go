package routes

import (
	"free-flow-api/controllers"
	"free-flow-api/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterContractRouter(rg *gin.RouterGroup) {
	contract := rg.Group("/contract")
	contract.Use(middleware.VerifyToken())
	{
		contract.POST("/", controllers.CreateContract)
		contract.GET("/", controllers.GetAllContracts)
		contract.GET("/:id", controllers.GetContractByID)
		contract.GET("/t/:task_id", controllers.GetContractByTaskID)
		contract.GET("/p/:project_id", controllers.GetContractsByProjectID)
		contract.PUT("/:id", controllers.UpdateContract)
		contract.DELETE("/:id", controllers.DeleteContract)
	}
}
