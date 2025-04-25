package repositories

import (
	"backend-go/database"
	"backend-go/models"
)

type CategoryRepository struct{}

func (r *CategoryRepository) GetAllCategories() ([]models.Category, error) {
	var categories []models.Category
	err := database.DB.Find(&categories).Error
	return categories, err
}

func (r *CategoryRepository) GetCategoryById(id int) (models.Category, error) {
	var category models.Category
	err := database.DB.First(&category, id).Error
	return category, err
}

func (r *CategoryRepository) CreateCategory(category models.Category) (models.Category, error) {
	err := database.DB.Save(&category).Error
	return category, err
}

func (r *CategoryRepository) UpdateCategory(id int, category models.Category) (models.Category, error) {
	category.Id = id
	err := database.DB.Save(&category).Error
	return category, err
}

func (r *CategoryRepository) DeleteCategory(id int) error {
	err := database.DB.Delete(&models.Category{}, id).Error
	return err
}
