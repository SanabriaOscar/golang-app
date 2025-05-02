package routes

import (
	"backend-go/controllers"
	"net/http"

	"backend-go/repositories"
	"backend-go/services"

	"github.com/gorilla/mux"
)

func SetupRoutes() *mux.Router {

	r := mux.NewRouter()
	// Configura CORS middleware
	corsMiddleware := func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "http://localhost:4200")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

			// Maneja solicitudes preflight OPTIONS
			if r.Method == "OPTIONS" {
				w.WriteHeader(http.StatusOK)
				return
			}

			next.ServeHTTP(w, r)
		})
	}

	// Aplica el middleware CORS a todas las rutas
	r.Use(corsMiddleware)
	var categoryRepo repositories.ICategoryRepository = &repositories.CategoryRepository{}
	categoryService := &services.CategoryService{Repo: categoryRepo}
	categoryController := &controllers.CategoryController{Service: categoryService}

	var productRepo repositories.IProductRepository = &repositories.ProductRepository{}
	productService := &services.ProductService{Repo: productRepo}
	productController := &controllers.ProductController{Service: productService}

	// Products
	r.HandleFunc("/api/products", productController.GetProducts).Methods("GET")
	r.HandleFunc("/api/products/{id}", productController.GetProductById).Methods("GET")
	r.HandleFunc("/api/products", productController.CreateProduct).Methods("POST")
	r.HandleFunc("/api/products/{id}", productController.UpdateProduct).Methods("PUT")
	r.HandleFunc("/api/products/{id}", productController.DeleteProduct).Methods("DELETE")

	// Categories
	r.HandleFunc("/api/categories", categoryController.GetCategories).Methods("GET", "OPTIONS")
	r.HandleFunc("/api/categories/{id}", categoryController.GetCategoryById).Methods("GET", "OPTIONS")
	r.HandleFunc("/api/categories", categoryController.CreateCategory).Methods("POST", "OPTIONS")
	r.HandleFunc("/api/categories/{id}", categoryController.UpdateCategory).Methods("PUT", "OPTIONS")
	r.HandleFunc("/api/categories/{id}", categoryController.DeleteCategory).Methods("DELETE", "OPTIONS")

	return r
}
