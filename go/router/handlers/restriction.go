package handlers

import (
	"encoding/json"
	"net/http"
	"plannertime/service"
	"strconv"

	"github.com/labstack/echo/v4"
)

func HandlerCreateRestriction(c echo.Context) error {
	username := c.Param("username")
	if len(username) <= 0 {
		return c.JSON(http.StatusBadRequest, "invalid username")
	}

	user, err := service.ServiceFindUser(username)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "GetUser error")
	}

	type Request struct {
		Crontab     string `json:"frequency"`
		Description string `json:"description"`
	}

	var request Request

	err = json.NewDecoder(c.Request().Body).Decode(&request)
	if err != nil {
		return c.JSON(http.StatusBadRequest, "bad request")
	}

	err = service.ServiceCreateRestriction(user.Id, request.Crontab, request.Description)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "ServiceCreateEvent error")
	}

	return c.JSON(http.StatusOK, "ok")
}

func HandlerUpdateRestriction(c echo.Context) error {
	username := c.Param("username")
	if len(username) <= 0 {
		return c.JSON(http.StatusBadRequest, "invalid username")
	}

	user, err := service.ServiceFindUser(username)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "GetUser error")
	}

	type Request struct {
		Crontab     string `json:"frequency"`
		Description string `json:"description"`
	}

	var request Request

	err = json.NewDecoder(c.Request().Body).Decode(&request)
	if err != nil {
		return c.JSON(http.StatusBadRequest, "bad request")
	}

	err = service.ServiceUpdateRestriction(user.Id, request.Crontab, request.Description)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "ServiceUpdateEvent error")
	}

	return c.JSON(http.StatusOK, "ok")
}

func HandlerDeleteRestriction(c echo.Context) error {
	username := c.Param("username")
	if len(username) <= 0 {
		return c.JSON(http.StatusBadRequest, "invalid username")
	}

	idInt, err := strconv.Atoi(username)
	if err != nil {
		return c.JSON(http.StatusBadRequest, "invalid id")
	}

	err = service.ServiceDeleteRestriction(idInt)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "ServiceDeleteRestriction error")
	}

	return c.JSON(http.StatusOK, "ok")
}
