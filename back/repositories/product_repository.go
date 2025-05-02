package repositories

import (
	"backend-go/database"
	"backend-go/models"
)

type ProductRepository struct{}

func (r *ProductRepository) GetAllProducts() ([]models.Product, error) {
	var products []models.Product
	err := database.DB.Preload("Category").Find(&products).Error
	return products, err
}

func (r *ProductRepository) GetProductById(id int) (models.Product, error) {
	var product models.Product
	err := database.DB.Preload("Category").First(&product, id).Error
	return product, err
}

func (r *ProductRepository) CreateProduct(product models.Product) (models.Product, error) {
	err := database.DB.Save(&product).Error
	return product, err
}

func (r *ProductRepository) UpdateProduct(id int, product models.Product) (models.Product, error) {
	err := database.DB.Save(&product).Error
	return product, err
}

func (r *ProductRepository) DeleteProduct(id int) error {
	err := database.DB.Delete(&models.Product{}, id).Error
	return err
}
