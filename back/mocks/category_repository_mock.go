package mocks

import (
	"backend-go/models"

	"github.com/stretchr/testify/mock"
)

type CategoryRepositoryMock struct {
	mock.Mock
}

func (m *CategoryRepositoryMock) GetAllCategories() ([]models.Category, error) {
	args := m.Called()
	return args.Get(0).([]models.Category), args.Error(1)
}

func (m *CategoryRepositoryMock) GetCategoryById(id int) (models.Category, error) {
	args := m.Called(id)
	return args.Get(0).(models.Category), args.Error(1)
}

func (m *CategoryRepositoryMock) CreateCategory(category models.Category) (models.Category, error) {
	args := m.Called(category)
	return args.Get(0).(models.Category), args.Error(1)
}

func (m *CategoryRepositoryMock) UpdateCategory(id int, category models.Category) (models.Category, error) {
	args := m.Called(id, category)
	return args.Get(0).(models.Category), args.Error(1)
}

func (m *CategoryRepositoryMock) DeleteCategory(id int) error {
	args := m.Called(id)
	return args.Error(0)
}
