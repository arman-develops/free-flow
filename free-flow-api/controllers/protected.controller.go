package controllers

import (
	"free-flow-api/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Protected(c *gin.Context) {

	userID := c.GetString("userID")
	if !utils.IsAuthenticated(userID) {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid user token")
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "You have reached a protected route",
	})
}
