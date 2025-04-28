package router

import (
	"fmt"
	_ "plannertime/docs"
	"plannertime/router/handlers"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	echoswagger "github.com/swaggo/echo-swagger"
)

// InitECHO Inicializa o servidor echo
// @title API Golang Planner Time
// @version 0.1
// @description API em Go projeto Planner Time
// @BasePath /
// @host localhost:8080
// @schemes http
func InitEcho() {
	e := echo.New()

	e.Use(middleware.CORS())

	e.GET("/swagger*", echoswagger.WrapHandler)

	//USER
	e.GET("/getUser/:email", handlers.HandlerGetUserByEmail)
	e.POST("/createUser", handlers.HandlerCreateUser)
	//e.PATCH("/updateUser", handlers.HandlerUpdateUser)
	e.POST("/login", handlers.HandlerLogin)

	e.GET("/userScheduller/:email", handlers.HanlderCalculateUserScheduler)

	e.POST("/createTask/:email", handlers.CreateTask)
	e.GET("/getTasks/:email", handlers.GetTasks)
	e.DELETE("/deleteTask/:email/:taskId", handlers.DeleteTask)

	//RESTRICTION
	e.POST("/createRestriction/:email", handlers.HandlerCreateRestriction)
	e.GET("/getRestrictions/:email", handlers.GetRestrictions)
	e.DELETE("/deleteRestrictions/:email/:restrictionId", handlers.HandlerDeleteRestriction)

	for _, route := range e.Routes() {
		fmt.Printf("Path: %s, Method: %s\n", route.Path, route.Method)
	}

	e.Logger.Fatal(e.Start(":8080"))
}
