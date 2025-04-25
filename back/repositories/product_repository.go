package repositories

import (
	"backend-go/database"
	"backend-go/models"
)

func GetAllProducts() ([]models.Product, error) {
	var products []models.Product
	err := database.DB.Preload("Category").Find(&products).Error
	return products, err
}

func GetProductById(id int) (models.Product, error) {
	var product models.Product
	err := database.DB.Preload("Category").First(&product, id).Error
	return product, err
}

func CreateProduct(product models.Product) (models.Product, error) {
	err := database.DB.Save(&product).Error
	return product, err
}

func UpdateProduct(product models.Product) (models.Product, error) {
	err := database.DB.Save(&product).Error
	return product, err
}

func DeleteProduct(id int) error {
	err := database.DB.Delete(&models.Product{}, id).Error
	return err
}
