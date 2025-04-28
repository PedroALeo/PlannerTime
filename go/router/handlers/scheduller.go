package handlers

import (
	"log"
	"net/http"
	"plannertime/service"

	"github.com/labstack/echo/v4"
)

func HanlderCalculateUserScheduler(c echo.Context) error {
	email := c.Param("email")
	if len(email) <= 0 {
		return c.JSON(http.StatusBadRequest, "invalid email")
	}

	wk, err := service.ServiceCalculateUserScheduler(email)
	if err != nil {
		log.Println(err.Error())
		return c.JSON(http.StatusInternalServerError, "internal error")
	}

	return c.JSON(http.StatusOK, wk)
}
