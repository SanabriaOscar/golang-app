package routes

import (
	"backend-go/controllers"

	"backend-go/repositories"
	"backend-go/services"

	"github.com/gorilla/mux"
)

func SetupRoutes() *mux.Router {
	r := mux.NewRouter()
	var categoryRepo repositories.ICategoryRepository = &repositories.CategoryRepository{}

	categoryService := &services.CategoryService{Repo: categoryRepo}
	categoryController := &controllers.CategoryController{Service: categoryService}

	// Products
	r.HandleFunc("/api/products", controllers.GetProducts).Methods("GET")
	r.HandleFunc("/api/products/{id}", controllers.GetProductById).Methods("GET")
	r.HandleFunc("/api/products", controllers.CreateProduct).Methods("POST")
	r.HandleFunc("/api/products/{id}", controllers.UpdateProduct).Methods("PUT")
	r.HandleFunc("/api/products/{id}", controllers.DeleteProduct).Methods("DELETE")

	// Categories
	r.HandleFunc("/api/categories", categoryController.GetCategories).Methods("GET")
	r.HandleFunc("/api/categories/{id}", categoryController.GetCategoryById).Methods("GET")
	r.HandleFunc("/api/categories", categoryController.CreateCategory).Methods("POST")
	r.HandleFunc("/api/categories/{id}", categoryController.UpdateCategory).Methods("PUT")
	r.HandleFunc("/api/categories/{id}", categoryController.DeleteCategory).Methods("DELETE")

	return r
}
