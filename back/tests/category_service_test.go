package services_test

import (
	"backend-go/mocks"
	"backend-go/models"
	"backend-go/services"
	"errors"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetAllCategories(t *testing.T) {
	mockRepo := new(mocks.CategoryRepositoryMock)
	expected := []models.Category{
		{Id: 1, Name: "Cat 1"},
		{Id: 2, Name: "Cat 2"},
	}
	mockRepo.On("GetAllCategories").Return(expected, nil)

	service := services.CategoryService{Repo: mockRepo}
	categories, err := service.GetAllCategories()

	assert.NoError(t, err)
	assert.Equal(t, expected, categories)
	mockRepo.AssertExpectations(t)
}

func TestCreateCategory(t *testing.T) {
	mockRepo := new(mocks.CategoryRepositoryMock)
	category := models.Category{Name: "New Category"}
	saved := models.Category{Id: 1, Name: "New Category"}

	mockRepo.On("CreateCategory", category).Return(saved, nil)

	service := services.CategoryService{Repo: mockRepo}
	result, err := service.CreateCategory(category)

	assert.NoError(t, err)
	assert.Equal(t, saved, result)
	mockRepo.AssertExpectations(t)
}

func TestUpdateCategory(t *testing.T) {
	mockRepo := new(mocks.CategoryRepositoryMock)
	id := 1
	category := models.Category{Name: "Updated"}
	updated := models.Category{Id: 1, Name: "Updated"}

	mockRepo.On("UpdateCategory", id, category).Return(updated, nil)

	service := services.CategoryService{Repo: mockRepo}
	result, err := service.UpdateCategory(id, category)

	assert.NoError(t, err)
	assert.Equal(t, updated, result)
	mockRepo.AssertExpectations(t)
}

func TestDeleteCategory(t *testing.T) {
	mockRepo := new(mocks.CategoryRepositoryMock)
	id := 1

	mockRepo.On("DeleteCategory", id).Return(nil)

	service := services.CategoryService{Repo: mockRepo}
	err := service.DeleteCategory(id)

	assert.NoError(t, err)
	mockRepo.AssertExpectations(t)
}

func TestGetCategoryByIdNotFound(t *testing.T) {
	mockRepo := new(mocks.CategoryRepositoryMock)
	id := 999
	mockRepo.On("GetCategoryById", id).Return(models.Category{}, errors.New("not found"))

	service := services.CategoryService{Repo: mockRepo}
	result, err := service.GetCategoryById(id)

	assert.Error(t, err)
	assert.Equal(t, models.Category{}, result)
	mockRepo.AssertExpectations(t)
}
