package controllers

import (
	"fmt"
	"free-flow-api/config"
	"free-flow-api/models"
	"free-flow-api/utils"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type OnboardInput struct {
	Password        string   `json:"password" binding:"min=8"`
	PhoneNumber     string   `json:"phone_number"`
	ProfilePhotoURL string   `json:"profile_photo_url"`
	Bio             string   `json:"bio"`
	Timezone        string   `json:"timezone"`
	Skills          []string `json:"skills"`
	PortfolioURL    string   `json:"portfolio_url"`
	LinkedInURL     string   `json:"linkedin_url"`
	WebsiteURL      string   `json:"website_url"`
}

type AssociateLoginInput struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6,max=64"`
}

func CreateAssociateProfileTx(tx *gorm.DB, c *gin.Context, associateID uuid.UUID) error {
	profile := models.AssociateProfile{
		AssociateID: associateID,
		IsOnboarded: false,
	}

	if err := tx.Create(&profile).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to create a new associate")
		return fmt.Errorf("failed to create associate profile: %w", err)
	}

	return nil
}

// OnboardAssociate handles the onboarding process
func OnboardAssociate(c *gin.Context) {
	// Get associate ID from middleware (set after token validation)
	associateIDStr := c.GetString("associateID")
	if associateIDStr == "" {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid or missing token")
		return
	}

	associateID, err := uuid.Parse(associateIDStr)
	if err != nil {
		utils.SendErrorResponse(c, http.StatusBadRequest, "invalid associate ID format")
		return
	}

	// Bind and validate input
	var input OnboardInput
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.SendErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	// Hash password securely
	passwordHash, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		utils.SendErrorResponse(c, http.StatusInternalServerError, "failed to process password")
		return
	}

	// Run the update inside a transaction
	err = config.DB.Transaction(func(tx *gorm.DB) error {
		// Check that the associate exists
		var associate models.Associate
		if err := tx.First(&associate, "id = ?", associateID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return fmt.Errorf("associate not found")
			}
			return err
		}

		// Retrieve their profile
		var profile models.AssociateProfile
		if err := tx.First(&profile, "associate_id = ?", associateID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return fmt.Errorf("profile not found for associate")
			}
			return err
		}

		// Update the profile fields
		profile.PasswordHash = string(passwordHash)
		profile.PhoneNumber = &input.PhoneNumber
		profile.ProfilePhotoURL = &input.ProfilePhotoURL
		profile.Bio = &input.Bio
		profile.Skills = input.Skills
		profile.PortfolioURL = &input.PortfolioURL
		profile.LinkedInURL = &input.LinkedInURL
		profile.WebsiteURL = &input.WebsiteURL
		profile.IsOnboarded = true
		profile.UpdatedAt = time.Now()

		// Save the updated profile
		if err := tx.Save(&profile).Error; err != nil {
			return fmt.Errorf("failed to update profile: %w", err)
		}

		//set the associate status as active
		associate.Status = "onboarded"
		if err := tx.Save(&associate).Error; err != nil {
			return fmt.Errorf("failed to update associate status: %w", err)
		}

		return nil
	})

	// Handle transaction result
	if err != nil {
		utils.SendErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	var associate models.Associate
	if err := config.DB.First(&associate, "id = ?", associateID).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusNotFound, "associate not found")
	}

	// Retrieve their profile
	var profile models.AssociateProfile
	if err := config.DB.First(&profile, "associate_id = ?", associateID).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusNotFound, "entity not found")
	}

	token, err := config.GenerateToken(associate.ID.String(), 24*time.Hour)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create token"})
		return
	}

	data := gin.H{
		"token": token,
		"associate": gin.H{
			"id":           associate.ID,
			"email":        associate.Email,
			"full_name":    associate.Name,
			"avatar":       profile.ProfilePhotoURL,
			"phone_number": profile.PhoneNumber,
			"created_at":   profile.CreatedAt,
			"update_at":    profile.UpdatedAt,
		},
	}

	utils.SendSuccessResponse(c, http.StatusOK, data)
}

func AssociateLogin(c *gin.Context) {
	var input AssociateLoginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.SendErrorResponse(c, http.StatusBadRequest, "invalid request body")
		return
	}

	input.Email = strings.ToLower(strings.TrimSpace(input.Email))

	var associate models.Associate
	if err := config.DB.Where("email = ?", input.Email).First(&associate).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid credentials")
		return
	}

	var associateProfile models.AssociateProfile
	if err := config.DB.Where("associate_id = ?", associate.ID).First(&associateProfile).Error; err != nil {
		utils.SendErrorResponse(c, http.StatusNotFound, "invalid associate credentials")
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(associateProfile.PasswordHash), []byte(input.Password)); err != nil {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "invalid credentials")
		return
	}

	token, err := config.GenerateToken(associate.ID.String(), 24*time.Hour)
	if err != nil {
		utils.SendErrorResponse(c, http.StatusUnauthorized, "Failed to create jwt token")
		return
	}
	data := gin.H{
		"token": token,
		"associate": gin.H{
			"id":           associate.ID,
			"email":        associate.Email,
			"full_name":    associate.Name,
			"avatar":       associateProfile.ProfilePhotoURL,
			"phone_number": associateProfile.PhoneNumber,
			"created_at":   associateProfile.CreatedAt,
			"update_at":    associateProfile.UpdatedAt,
		},
	}

	utils.SendSuccessResponse(c, http.StatusOK, data)
}
