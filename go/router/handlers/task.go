package handlers

import (
	"net/http"
	"plannertime/service"

	"github.com/labstack/echo/v4"
)

func GetTasks(c echo.Context) error {
	email := c.Param("email")

	ts, err := service.ServiceGetTasks(email)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "get tasks error")
	}

	return c.JSON(http.StatusOK, ts)
}

func CreateTask(c echo.Context) error {
	email := c.Param("email")

	type Body struct {
		Name         string `json:"nome"`
		TimeCoast    int    `json:"tempoEstimado"` // Formato: "HH:MM"
		DeliveryDate string `json:"dataConclusao"` // Formato: "YYYY-MM-DD"
		Priority     int    `json:"prioridade"`    // 1 (alta) a 5 (baixa)
	}
	var body Body

	err := c.Bind(&body)
	if err != nil {
		return c.JSON(http.StatusBadRequest, "invalid body")
	}

	err = service.ServiceCreateTask(email, body.DeliveryDate, body.TimeCoast, body.Priority)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "create task error")
	}

	return c.JSON(http.StatusCreated, "task created")
}
