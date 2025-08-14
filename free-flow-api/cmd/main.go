package main

import (
	"free-flow-api/config"
	"free-flow-api/routes"

	"github.com/gin-gonic/gin"
)

func init() {
	config.LoadEnv()
	config.ConnectDB()
}

func main() {
	r := gin.Default()

	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Welcome to free-flow api",
		})
	})

	api := r.Group("/api/v1")
	{
		routes.RegisterUserRouter(api)
		routes.RegisterProtectedRouter(api)
	}

	r.Run()
}
