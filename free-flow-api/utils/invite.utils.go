package utils

import (
	"fmt"
	"free-flow-api/config"

	"github.com/golang-jwt/jwt/v5"
)

func VerifyInviteToken(tokenString string) (*config.InviteClaims, error) {
	secret := []byte(config.GetEnv("JWT_SECRET"))

	token, err := jwt.ParseWithClaims(tokenString, &config.InviteClaims{}, func(token *jwt.Token) (interface{}, error) {
		return secret, nil
	})

	if err != nil {
		return nil, fmt.Errorf("invalid token: %v", err)
	}

	claims, ok := token.Claims.(*config.InviteClaims)
	if !ok || !token.Valid {
		return nil, fmt.Errorf("invalid or expired token")
	}

	return claims, nil
}
