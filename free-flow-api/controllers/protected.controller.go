package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func Protected(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "You have reached a protected route",
	})
}
