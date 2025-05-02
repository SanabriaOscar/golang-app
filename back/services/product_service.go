package services

import (
	"backend-go/models"
	"backend-go/repositories"
)

type ProductService struct {
	Repo repositories.IProductRepository
}

func (s *ProductService) GetAllProducts() ([]models.Product, error) {
	return s.Repo.GetAllProducts()
}

func (s *ProductService) GetProductById(id int) (models.Product, error) {
	return s.Repo.GetProductById(id)
}

func (s *ProductService) CreateProduct(product *models.Product) (models.Product, error) {
	return s.Repo.CreateProduct(*product)
}

func (s *ProductService) UpdateProduct(product *models.Product, id int) (models.Product, error) {
	return s.Repo.UpdateProduct(id, *product)
}

func (s *ProductService) DeleteProduct(id int) error {
	return s.Repo.DeleteProduct(id)
}
