package main

import (
	"backend-go/database"
	"backend-go/routes"
	"log"
	"net/http"
)

func main() {
	database.ConnectDatabase()
	r := routes.SetupRoutes()
	log.Println("Servidor escuchando en http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}
