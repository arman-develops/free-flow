package main

import "fmt"

func main() {
	r := gin.Default()

	r.get("/", func (c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Welcome to free-flow api"
		})
	})

	r.run()
}