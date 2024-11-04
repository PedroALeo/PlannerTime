package router

import (
	"encoding/json"
	"net/http"
	"plannertime/service"

	"github.com/labstack/echo/v4"
)

func HandlerLogin(c echo.Context) error {
	type Body struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	var body Body

	err := json.NewDecoder(c.Request().Body).Decode(&body)
	if err != nil {
		return c.JSON(http.StatusBadRequest, "invalid body")
	}

	ok, err := service.ServiceLogin(body.Username, body.Password)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "ServiceLogin error")
	}

	if !ok {
		return c.JSON(http.StatusOK, "user not found or invalid credentials")
	}

	return c.JSON(http.StatusOK, "ok")
}

func HandlerGetUserScheduller(c echo.Context) error {
	username := c.Param("username")
	if len(username) <= 0 {
		return c.JSON(http.StatusBadRequest, "invalid username")
	}

	user, err := service.ServiceFindUser(username)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "GetUser error")
	}

	events, err := service.ServiceGetUserScheduller(user.Id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "GetUserScheduller error")
	}

	return c.JSON(http.StatusOK, events)
}

func HandlerCreateEvent(c echo.Context) error {
	username := c.Param("username")
	if len(username) <= 0 {
		return c.JSON(http.StatusBadRequest, "invalid username")
	}

	user, err := service.ServiceFindUser(username)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "GetUser error")
	}

	type Request struct {
		StartDate   string `json:"startDate"`
		EndDate     string `json:"endDate"`
		Description string `json:"description"`
	}

	var request Request

	err = json.NewDecoder(c.Request().Body).Decode(&request)
	if err != nil {
		return c.JSON(http.StatusBadRequest, "bad request")
	}

	err = service.ServiceCreateEvent(user.Id, request.StartDate, request.EndDate, request.Description)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "ServiceCreateEvent error")
	}

	return c.JSON(http.StatusOK, "ok")
}

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
		StartDate   string `json:"startDate"`
		EndDate     string `json:"endDate"`
		Description string `json:"description"`
	}

	var request Request

	err = json.NewDecoder(c.Request().Body).Decode(&request)
	if err != nil {
		return c.JSON(http.StatusBadRequest, "bad request")
	}

	err = service.ServiceCreateRestriction(user.Id, request.StartDate, request.EndDate, request.Description)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "ServiceCreateEvent error")
	}

	return c.JSON(http.StatusOK, "ok")
}

func HandlerCreateUser(c echo.Context) error {
	type Request struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	var request Request

	err := json.NewDecoder(c.Request().Body).Decode(&request)
	if err != nil {
		return c.JSON(http.StatusBadRequest, "bad request")
	}

	err = service.ServiceCreateUser(request.Username, request.Password)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "createUser error")
	}

	return c.JSON(http.StatusOK, "ok")
}
