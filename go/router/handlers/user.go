package handlers

import (
	"encoding/json"
	"net/http"
	userEntity "plannertime/entity/user"
	"plannertime/service"

	"github.com/labstack/echo/v4"
)

type LoginBody struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type CreatUserBody struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

func HandlerUpdateUser(c echo.Context) error {
	var user userEntity.User

	err := json.NewDecoder(c.Request().Body).Decode(&user)
	if err != nil {
		return c.JSON(http.StatusBadRequest, "invalid body")
	}

	err = service.ServiceUpdateUser(user)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "ServiceUpdateUser error")
	}

	return c.JSON(http.StatusOK, "ok")
}

// POST
// HandlerLogin godoc
// @Summary      Login
// @Param        params body handlers.LoginBody true "Params"
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

	ok, err := service.ServiceLogin(body.Email, body.Password)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "ServiceLogin error")
	}

	if !ok {
		return c.JSON(http.StatusOK, "user not found or invalid credentials")
	}

	return c.JSON(http.StatusOK, "ok")
}

func HandlerGetUserByEmail(c echo.Context) error {
	email := c.Param("email")
	if len(email) <= 0 {
		return c.JSON(http.StatusBadRequest, "invalid username")
	}

	user, err := service.ServiceFindUser(email)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "GetUser error")
	}

	return c.JSON(http.StatusOK, user)
}

// POST
// HandlerCreateUser godoc
// @Summary      Create User
// @Param        params body handlers.CreateUserBody true "Params"
// @Success      200  {object} string "ok"
// @Failure      400  {object} string "bad request"
// @Failure      500  {object} string "createUser error"
// @Router       /createUser [post]
func HandlerCreateUser(c echo.Context) error {
	var request CreatUserBody

	err := json.NewDecoder(c.Request().Body).Decode(&request)
	if err != nil {
		return c.JSON(http.StatusBadRequest, "bad request")
	}

	err = service.ServiceCreateUser(request.Email, request.Username, request.Password)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "createUser error")
	}

	return c.JSON(http.StatusOK, "ok")
}
