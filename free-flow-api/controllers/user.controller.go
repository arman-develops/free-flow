package controllers

import (
	"free-flow-api/config"
	"free-flow-api/models"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type SignupInput struct {
	FirstName string `json:"firstname" binding:"required,min=2,max=100"`
	LastName  string `json:"lastname" binding:"required,min=2,max=100"`
	Email     string `json:"email" binding:"required,email"`
	Password  string `json:"password" binding:"required,min=6,max=64"`
}

func Signup(c *gin.Context) {
	// get firstname, lastname, email and password from the request body
	var input SignupInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	input.Email = strings.ToLower(strings.TrimSpace(input.Email))

	//check for duplicate email
	var existing models.User
	if err := config.DB.Where("email = ?", input.Email).First(&existing).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Email is already registered"})
		return
	} else if err != nil && err != gorm.ErrRecordNotFound {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "DB error"})
		return
	}

	// hash the password
	hashed, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	// create the user
	user := models.User{
		FirstName: input.FirstName,
		LastName:  input.LastName,
		Email:     input.Email,
		Password:  string(hashed),
	}

	if err := config.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	// issue JWT on successful signup
	token, err := config.GenerateToken(user.ID.String(), 24*time.Hour)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create token"})
		return
	}

	//send 201 code
	c.JSON(http.StatusCreated, gin.H{
		"user": gin.H{
			"id":    user.ID,
			"email": user.Email,
		},
		"token": token,
	})
}
