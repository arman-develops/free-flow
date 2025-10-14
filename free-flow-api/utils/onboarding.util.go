package utils

import (
	"errors"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

type OnboardingData struct {
	AssociateID uuid.UUID
	FullName    string
}

// Secret key for signing tokens — store securely (e.g. environment variable)
var jwtSecret = []byte(os.Getenv("JWT_SECRET"))

// CreateOnboardingToken generates a token containing associateID
func CreateOnboardingToken(onboardingData OnboardingData) (string, error) {
	claims := jwt.MapClaims{
		"associate_id": onboardingData.AssociateID,
		"fullname":     onboardingData.FullName,
		"exp":          time.Now().Add(24 * time.Hour).Unix(), // expires in 24h
		"purpose":      "onboarding",
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

// VerifyAndExtractAssociateID verifies the token and returns the associate ID
func VerifyAndExtractAssociateID(tokenString string) (uuid.UUID, error) {
	token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
		// Ensure the signing method matches
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return jwtSecret, nil
	})

	if err != nil {
		return uuid.Nil, errors.New("invalid or expired token")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return uuid.Nil, errors.New("invalid token claims")
	}

	// Ensure token was issued for onboarding
	if purpose, ok := claims["purpose"].(string); !ok || purpose != "onboarding" {
		return uuid.Nil, errors.New("invalid token purpose")
	}

	// Extract associate ID
	idStr, ok := claims["associate_id"].(string)
	if !ok {
		return uuid.Nil, errors.New("associate ID missing in token")
	}

	associateID, err := uuid.Parse(idStr)
	if err != nil {
		return uuid.Nil, errors.New("invalid associate ID format")
	}

	return associateID, nil
}
