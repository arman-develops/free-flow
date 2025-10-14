package middleware

import (
	"free-flow-api/config"
	"free-flow-api/utils"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func VerifyToken() gin.HandlerFunc {
	return func(c *gin.Context) {
		raw := c.GetHeader("Authorization")
		if raw == "" || !strings.HasPrefix(strings.ToLower(raw), "bearer ") {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing or invalid Authorization header"})
			c.Abort()
			return
		}

		tokenString := strings.TrimSpace(raw[len("Bearer "):])
		secret := []byte(config.GetEnv("JWT_SECRET"))
		token, err := jwt.ParseWithClaims(tokenString, &config.JWTCustomClaims{}, func(t *jwt.Token) (any, error) {
			return secret, nil
		})
		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		claims := token.Claims.(*config.JWTCustomClaims)
		c.Set("userID", claims.UserID)

		c.Next()
	}
}

func VerifyOnboardingToken() gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.Param("token")
		associateID, err := utils.VerifyAndExtractAssociateID(token)
		if err != nil {
			utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid token")
			c.Abort()
			return
		}
		c.Set("associateID", associateID.String())
		c.Next()
	}
}
