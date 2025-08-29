package main

import (
	"free-flow-api/config"
	"free-flow-api/models"
	"log"
)

func init() {
	config.LoadEnv()
	config.ConnectDB()
}

func main() {
	config.DB.Migrator().DropTable(&models.Project{})
	if err := config.DB.AutoMigrate(
		&models.User{},
		&models.Entity{},
		&models.Associate{},
		&models.Project{},
		&models.Task{},
	); err != nil {
		log.Fatalf("Migration failed: %v", err)
	}
}
