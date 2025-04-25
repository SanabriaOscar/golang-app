package services

import (
	"backend-go/models"
	"backend-go/repositories"
)

func FindAllProducts() ([]models.Product, error) {
	return repositories.GetAllProducts()
}

func FindProductByID(id int) (models.Product, error) {
	return repositories.GetProductById(id)
}

func CreateNewProduct(product *models.Product) (models.Product, error) {
	return repositories.CreateProduct(*product)
}

func UpdateExistingProduct(product *models.Product, id int) (models.Product, error) {
	return repositories.UpdateProduct(*product)
}

func DeleteExistingProduct(id int) error {
	return repositories.DeleteProduct(id)
}
