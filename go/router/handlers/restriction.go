package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"plannertime/service"
	"strconv"

	"github.com/labstack/echo/v4"
)

func GetRestrictions(c echo.Context) error {
	email := c.Param("email")
	if len(email) <= 0 {
		return c.JSON(http.StatusBadRequest, "invalid email")
	}

	user, err := service.ServiceFindUser(email)
	if err != nil {
		log.Println(err.Error())
		return c.JSON(http.StatusInternalServerError, "GetUser error")
	}

	rs, err := service.ServiceGetRestrictions(user.Id)
	if err != nil {
		log.Println(err.Error())
		return c.JSON(http.StatusInternalServerError, "ServiceCreateEvent error")
	}

	return c.JSON(http.StatusOK, rs)
}

func HandlerCreateRestriction(c echo.Context) error {
	email := c.Param("email")
	if len(email) <= 0 {
		return c.JSON(http.StatusBadRequest, "invalid email")
	}

	user, err := service.ServiceFindUser(email)
	if err != nil {
		log.Println(err.Error())
		return c.JSON(http.StatusInternalServerError, "GetUser error")
	}

	type Request struct {
		Name  string   `json:"nome"`
		Days  []string `json:"diasDaSemana"`
		Start string   `json:"horarioInicio"`
		End   string   `json:"horarioFim"`
	}

	var request Request

	err = json.NewDecoder(c.Request().Body).Decode(&request)
	if err != nil {
		log.Println(err.Error())
		return c.JSON(http.StatusBadRequest, "bad request")
	}

	err = service.ServiceCreateRestriction(user.Id, request.Name, request.Start, request.End, request.Days)
	if err != nil {
		log.Println(err.Error())
		return c.JSON(http.StatusInternalServerError, "ServiceCreateEvent error")
	}

	return c.JSON(http.StatusOK, "ok")
}

func HandlerDeleteRestriction(c echo.Context) error {
	email := c.Param("email")
	if len(email) <= 0 {
		return c.JSON(http.StatusBadRequest, "invalid email")
	}

	rId := c.Param("restrictionId")
	intId, err := strconv.Atoi(rId)
	if err != nil {
		log.Println(err.Error())
		return c.JSON(http.StatusBadRequest, "invalid Id")
	}

	err = service.ServiceDeleteRestriction(email, intId)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "ServiceDeleteRestriction error")
	}

	return c.JSON(http.StatusOK, "restriction deleted")
}
