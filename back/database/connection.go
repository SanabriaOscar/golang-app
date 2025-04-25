package database

import (
	"backend-go/models"
	"fmt"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {

	errorVariables := godotenv.Load()
	if errorVariables != nil {
		panic(errorVariables)
	}
	err := godotenv.Load()
	if err != nil {
		panic("Error loading .env file")
	}

	dsn := os.Getenv("DB_USER") + ":" + os.Getenv("DB_PASSWORD") +
		"@tcp(" + os.Getenv("DB_HOST") + ":" + os.Getenv("DB_PORT") + ")/" +
		os.Getenv("DB_NAME") + "?charset=utf8mb4&parseTime=True&loc=Local"

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})

	if err != nil {
		panic("failed to connect database")
	}
	fmt.Print("Connected to database")
	DB = db

	err = db.AutoMigrate(&models.Product{}, &models.Category{})
	if err != nil {
		panic("migration failed: " + err.Error())
	}
}

func ConnetionClose() {
	db, err := DB.DB()
	if err != nil {
		panic(err)
	}
	db.Close()
}
