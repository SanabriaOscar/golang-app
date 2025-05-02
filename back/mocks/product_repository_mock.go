package mocks

import (
	"backend-go/models"

	"github.com/stretchr/testify/mock"
)

type ProductRepositoryMock struct {
	mock.Mock
}

func (m *ProductRepositoryMock) GetAllProducts() ([]models.Product, error) {
	args := m.Called()
	return args.Get(0).([]models.Product), args.Error(1)
}

func (m *ProductRepositoryMock) GetProductById(id int) (models.Product, error) {
	args := m.Called(id)
	return args.Get(0).(models.Product), args.Error(1)
}

func (m *ProductRepositoryMock) CreateProduct(product models.Product) (models.Product, error) {
	args := m.Called(product)
	return args.Get(0).(models.Product), args.Error(1)
}

func (m *ProductRepositoryMock) UpdateProduct(id int, product models.Product) (models.Product, error) {
	args := m.Called(id, product)
	return args.Get(0).(models.Product), args.Error(1)
}

func (m *ProductRepositoryMock) DeleteProduct(id int) error {
	args := m.Called(id)
	return args.Error(0)
}
