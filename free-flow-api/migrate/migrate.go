package main

import (
	"free-flow-api/config"
	"free-flow-api/models"
)

func init() {
	config.LoadEnv()
	config.ConnectDB()
}

func main() {
	config.DB.AutoMigrate(
		&models.User{},
		&models.Entity{},
		&models.Associate{},
		&models.Project{},
		&models.Task{},
	)
}
