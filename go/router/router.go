package router

import (
	"fmt"
	_ "plannertime/docs"

	"github.com/labstack/echo/v4"
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

	e.GET("/swagger*", echoswagger.WrapHandler)
	e.POST("/createUser", HandlerCreateUser)
	e.POST("/login", HandlerLogin)
	e.POST("/createEvent/:username", HandlerCreateEvent)
	e.DELETE("/deleteEvent/:eventId", HandlerDeleteEvent)
	e.PATCH("/updateEvent", HandlerUpdateEvent)
	e.POST("/createRestrictions/:username", HandlerCreateRestriction)
	e.GET("/userScheduller/:username", HandlerGetUserScheduller)

	for _, route := range e.Routes() {
		fmt.Printf("Path: %s, Method: %s\n", route.Path, route.Method)
	}

	e.Logger.Fatal(e.Start(":8080"))
}
