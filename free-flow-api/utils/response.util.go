package utils

import "github.com/gin-gonic/gin"

type responseFormat struct {
	Success bool   `json:"success"`
	Data    any    `json:"data,omitempty"`
	Error   string `json:"error,omitempty"`
}

func SendSuccessResponse(c *gin.Context, code int, data any) {
	c.JSON(code, responseFormat{
		Success: true,
		Data:    data,
	})
}

func SendErrorResponse(c *gin.Context, code int, err string) {
	c.JSON(code, responseFormat{
		Success: false,
		Error:   err,
	})
}
