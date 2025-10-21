package config

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type JWTCustomClaims struct {
	UserID string `json:"uid"`
	jwt.RegisteredClaims
}

type InviteClaims struct {
	InviteID    string `json:"invite_id"`
	AssociateID string `json:"associate_id"`
	ContractID  string `json:"contract_id"`
	TaskID      string `json:"task_id"`
	jwt.RegisteredClaims
}

func GenerateToken(userID string, ttl time.Duration) (string, error) {
	secret := []byte(GetEnv("JWT_SECRET"))
	claims := &JWTCustomClaims{
		UserID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(ttl)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Subject:   userID,
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(secret)
}

func GenerateInviteToken(inviteID, associateID, contractID, taskID string, ttl time.Duration) (string, error) {
	secret := []byte(GetEnv("JWT_SECRET"))

	claims := &InviteClaims{
		InviteID:    inviteID,
		AssociateID: associateID,
		ContractID:  contractID,
		TaskID:      taskID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(ttl)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Subject:   "invite",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(secret)
}
