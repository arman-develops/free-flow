package main

import (
	"free-flow-api/config"
	"free-flow-api/routes"
	"log"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func init() {
	config.LoadEnv()
	config.ConnectDB()
}

func main() {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:  []string{"http://localhost:3000"},
		AllowMethods:  []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:  []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders: []string{"Content-Length"},
		MaxAge:        12 * time.Hour,
	}))

	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Welcome to free-flow api",
		})
	})

	api := r.Group("/api/v1")
	{
		routes.RegisterUserRouter(api)
		routes.RegisterEntityRouter(api)
		routes.RegisterProtectedRouter(api)
		routes.RegisterAssociateRouter(api)
		routes.RegisterTaskRouter(api)
		routes.RegisterProjectRouter(api)
		routes.RegisterInvoiceRouter(api)
		routes.RegisterExpenseRouter(api)
		routes.RegisterPaymentRouter(api)
		routes.RegisterStatsRouter(api)
		routes.RegisterSettlementRouter(api)
	}
	log.Println("Server is up and runnig")
	r.Run()
}
