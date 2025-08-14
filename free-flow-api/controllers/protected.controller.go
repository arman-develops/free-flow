package controllers

import (
	"free-flow-api/config"
	"free-flow-api/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func Protected(c *gin.Context) {

	userID := c.GetString("userID")
	parsed, err := uuid.Parse(userID)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid user token"})
		c.Abort()
		return
	}
	var user models.User
	if err := config.DB.First(&user, "id = ?", parsed).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "You have reached a protected route",
	})
}
