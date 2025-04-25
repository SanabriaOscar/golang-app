package repositories

import "backend-go/models"

type IProductRepository interface {
	GetAllProducts() ([]models.Product, error)
	GetProductById(id int) (models.Product, error)
	CreateProduct(product models.Product) (models.Product, error)
	UpdateProduct(id int, product models.Product) (models.Product, error)
	DeleteProduct(id int) error
}

type ICategoryRepository interface {
	GetAllCategories() ([]models.Category, error)
	GetCategoryById(id int) (models.Category, error)
	CreateCategory(category models.Category) (models.Category, error)
	UpdateCategory(id int, category models.Category) (models.Category, error)
	DeleteCategory(id int) error
}
