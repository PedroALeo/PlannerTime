package router

import (
	"encoding/json"
	"net/http"
	"plannertime/repository"
	"plannertime/service"
	"strconv"

	"github.com/labstack/echo/v4"
)

// PATCH
// HandlerUpdateEvent godoc
// @Summary      Update the given event
// @Param        params body repository.Event true "Params"
// @Success      200  {object} string "ok"
// @Failure      400  {object} string "invalid body"
// @Failure      500  {object} string "ServiceUpdateEvent error"
// @Router       /updateEvent [patch]
func HandlerUpdateEvent(c echo.Context) error {
	var event repository.Event

	err := json.NewDecoder(c.Request().Body).Decode(&event)
	if err != nil {
		return c.JSON(http.StatusBadRequest, "invalid body")
	}

	err = service.ServiceUpdateEvent(event)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "ServiceUpdateEvent error")
	}

	return c.JSON(http.StatusOK, "ok")
}

// DELETE
// HandlerDeleteEvent godoc
// @Summary      delete the event from the given id
// @Param        eventID   path      int true	"ID do event"
// @Success      200  {object} string "ok"
// @Failure      400  {object} string "invalid id"
// @Failure      500  {object} string "ServiceDeleteEvent error"
// @Router       /deleteEvent/{eventId} [delete]
func HandlerDeleteEvent(c echo.Context) error {
	eventId := c.Param("eventId")

	idInt, err := strconv.Atoi(eventId)
	if err != nil {
		return c.JSON(http.StatusBadRequest, "invalid id")
	}

	err = service.ServiceDeleteEvent(idInt)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "ServiceDeleteEvent error")
	}

	return c.JSON(http.StatusOK, "ok")
}

type LoginBody struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// POST
// HandlerLogin godoc
// @Summary      Login
// @Param        params body router.LoginBody true "Params"
// @Success      200  {object} string "ok"
// @Failure      400  {object} string "invalid body"
// @Failure      500  {object} string "ServiceLogin error"
// @Router       /login [post]
func HandlerLogin(c echo.Context) error {

	var body LoginBody

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

// POST
// HandlerGetUserScheduller godoc
// @Summary      Get user scheduller
// @Param        username   path      string true	"username do usuario"
// @Success      200  {object} []repository.Event "ok"
// @Failure      400  {object} string "invalid username"
// @Failure      500  {object} string "GetUser error"
// @Router       /userScheduller [post]
func HandlerGetUserScheduller(c echo.Context) error {
	username := c.Param("username")
	if len(username) <= 0 {
		return c.JSON(http.StatusBadRequest, "invalid username")
	}

	user, err := service.ServiceFindUser(username)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "GetUser error")
	}

	println(user.Username)

	events, err := service.ServiceGetUserScheduller(user.Id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "GetUserScheduller error")
	}

	return c.JSON(http.StatusOK, events)
}

type EventRequest struct {
	StartDate   string `json:"startDate"`
	EndDate     string `json:"endDate"`
	Description string `json:"description"`
	Priority    int    `json:"priority"`
}

// POST
// HandlerCreateEvent godoc
// @Summary      Create Event
// @Param        username   path      string true	"username do usuario"
// @Param        params body router.EventRequest true "Params"
// @Success      200  {object} string "ok"
// @Failure      400  {object} string "invalid username"
// @Failure      500  {object} string "GetUser error"
// @Router       /createEvent [post]
func HandlerCreateEvent(c echo.Context) error {
	username := c.Param("username")
	if len(username) <= 0 {
		return c.JSON(http.StatusBadRequest, "invalid username")
	}

	user, err := service.ServiceFindUser(username)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "GetUser error")
	}

	var request EventRequest

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

// POST
// HandlerCreateUser godoc
// @Summary      Create User
// @Param        params body router.LoginBody true "Params"
// @Success      200  {object} string "ok"
// @Failure      400  {object} string "bad request"
// @Failure      500  {object} string "createUser error"
// @Router       /createUser [post]
func HandlerCreateUser(c echo.Context) error {
	type Request struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	var request LoginBody

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
