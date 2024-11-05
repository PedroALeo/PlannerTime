package router

import (
	"fmt"

	"github.com/labstack/echo/v4"
)

func InitEcho() {
	e := echo.New()

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
