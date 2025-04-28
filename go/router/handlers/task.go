package handlers

import (
	"log"
	"net/http"
	"plannertime/service"
	"strconv"

	"github.com/labstack/echo/v4"
)

func DeleteTask(c echo.Context) error {
	email := c.Param("email")
	if len(email) <= 0 {
		return c.JSON(http.StatusBadRequest, "invalid email")
	}

	taskId := c.Param("taskId")

	intId, err := strconv.Atoi(taskId)
	if err != nil {
		log.Println(err.Error())
		return c.JSON(http.StatusBadRequest, "invalid taskId")
	}

	err = service.ServiceDeleteTask(email, intId)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "internal error")
	}

	return c.JSON(http.StatusOK, "taks deleted")
}

func GetTasks(c echo.Context) error {
	email := c.Param("email")

	ts, err := service.ServiceGetTasks(email)
	if err != nil {
		log.Println(err.Error())
		return c.JSON(http.StatusInternalServerError, "get tasks error")
	}

	return c.JSON(http.StatusOK, ts)
}

func CreateTask(c echo.Context) error {
	email := c.Param("email")

	type Body struct {
		Name      string `json:"nome"`
		TimeCoast string `json:"tempoEstimado"`
		DueDate   string `json:"dataConclusao"` // Formato: "YYYY-MM-DD"
		Priority  int    `json:"prioridade"`    // 1 (alta) a 5 (baixa)
	}
	var body Body

	err := c.Bind(&body)
	if err != nil {
		log.Println(err.Error())
		return c.JSON(http.StatusBadRequest, "invalid body")
	}

	tc, err := strconv.Atoi(body.TimeCoast)
	if err != nil {
		log.Println(err.Error())
		return c.JSON(http.StatusBadRequest, "invalid body")
	}

	err = service.ServiceCreateTask(email, body.Name, body.DueDate, tc, body.Priority)
	if err != nil {
		log.Println(err.Error())
		return c.JSON(http.StatusInternalServerError, "create task error")
	}

	return c.JSON(http.StatusCreated, "task created")
}
