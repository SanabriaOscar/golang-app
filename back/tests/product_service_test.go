package services_test

import (
	"backend-go/mocks"
	"backend-go/models"
	"backend-go/services"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetAllProducts(t *testing.T) {
	mockRepo := new(mocks.ProductRepositoryMock)
	expected := []models.Product{
		{Id: 1, Name: "Product 1", Description: "Description 1", Price: 100, CategoryId: 1},
		{Id: 2, Name: "Product 2", Description: "Description 2", Price: 200, CategoryId: 2},
	}
	mockRepo.On("GetAllProducts").Return(expected, nil)

	service := services.ProductService{Repo: mockRepo}
	products, err := service.GetAllProducts()

	assert.NoError(t, err)
	assert.Equal(t, expected, products)
	mockRepo.AssertExpectations(t)
}

func TestCreateProduct(t *testing.T) {
	mockRepo := new(mocks.ProductRepositoryMock)
	product := models.Product{Name: "New Product"}
	saved := models.Product{Id: 1, Name: "New Product"}

	mockRepo.On("CreateProduct", product).Return(saved, nil)

	service := services.ProductService{Repo: mockRepo}
	result, err := service.CreateProduct(&product)

	assert.NoError(t, err)
	assert.Equal(t, saved, result)
	mockRepo.AssertExpectations(t)
}

func TestUpdateProduct(t *testing.T) {
	mockRepo := new(mocks.ProductRepositoryMock)
	id := 1
	product := models.Product{Name: "Updated Product"}
	updated := models.Product{Id: 1, Name: "Updated Product"}

	mockRepo.On("UpdateProduct", id, product).Return(updated, nil)

	service := services.ProductService{Repo: mockRepo}
	result, err := service.UpdateProduct(&product, id)

	assert.NoError(t, err)
	assert.Equal(t, updated, result)
	mockRepo.AssertExpectations(t)
}

func TestDeleteProduct(t *testing.T) {
	mockRepo := new(mocks.ProductRepositoryMock)
	id := 1

	mockRepo.On("DeleteProduct", id).Return(nil)

	service := services.ProductService{Repo: mockRepo}
	err := service.DeleteProduct(id)

	assert.NoError(t, err)
	mockRepo.AssertExpectations(t)
}
func TestGetProductById(t *testing.T) {
	mockRepo := new(mocks.ProductRepositoryMock)
	id := 1
	product := models.Product{Id: 1, Name: "Product 1", Description: "Description 1", Price: 100, CategoryId: 1}

	mockRepo.On("GetProductById", id).Return(product, nil)

	service := services.ProductService{Repo: mockRepo}
	result, err := service.GetProductById(id)

	assert.NoError(t, err)
	assert.Equal(t, product, result)
	mockRepo.AssertExpectations(t)
}
