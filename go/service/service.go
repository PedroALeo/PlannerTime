package service

import (
	userEntity "plannertime/entity/user"
	"plannertime/repository"
	"time"

	"golang.org/x/crypto/bcrypt"
)

type restrictions struct{}

func ServiceGetRestrictions(userId int) ([]repository.Restriction, error) {
	rs, err := repository.GetRestrictions(userId)
	if err != nil {
		return nil, err
	}

	return rs, nil
}

func ServiceGetTasks(email string) ([]repository.Task, error) {
	rs, err := repository.GetTasks(email)
	if err != nil {
		return nil, err
	}

	return rs, nil
}

func ServiceDeleteEvent(eventId int) error {
	err := repository.DeleteEvent(eventId)
	if err != nil {
		return err
	}

	return nil
}

func ServiceUpdateEvent(event repository.Event) error {
	err := repository.UpdateEvent(event)
	if err != nil {
		return err
	}

	return nil
}

func GetRes(userId int) ([]repository.Restriction, error) {
	rests, err := repository.GetRest(userId)
	if err != nil {
		println(err.Error())
		return nil, err
	}

	return rests, nil
}

func ServiceGetUserScheduller(userId int) ([]repository.Event, error) {
	events, err := repository.GetEventsAndRestrictions(userId)
	if err != nil {
		println(err.Error())
		return nil, err
	}

	return events, nil
}

func ServiceLogin(email, password string) (bool, error) {
	user, err := ServiceFindUser(email)
	if err != nil {
		return false, err
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return false, err
	}

	return true, nil
}

func ServiceCreateUser(email, username, password string) error {
	hashPass, err := bcrypt.GenerateFromPassword([]byte(password), 4)
	if err != nil {
		return err
	}

	err = repository.CreateUser(email, username, string(hashPass))
	if err != nil {
		return err
	}

	return nil
}

func ServiceCreateTask(userEmail, name, endDate string, EstimatedDuration, priority int) error {
	timeDate, err := time.Parse(time.DateOnly, endDate)
	if err != nil {
		return err
	}

	err = repository.CreateTask(userEmail, name, EstimatedDuration, priority, timeDate)
	if err != nil {
		return err
	}

	return nil
}

func ServiceCreateRestriction(userId int, name, start, end string, days []string) error {
	err := repository.CreateRestriction(userId, name, start, end, days)
	if err != nil {
		return err
	}

	return nil
}

func ServiceUpdateRestriction(userId int, crontab, description string) error {
	err := repository.UpdateRestriction(userId, crontab, description)
	if err != nil {
		return err
	}

	return nil
}

func ServiceDeleteRestriction(userId int) error {
	err := repository.DeleteRestriction(userId)
	if err != nil {
		return err
	}

	return nil
}

func ServiceFindUser(email string) (userEntity.User, error) {
	user, err := repository.GetUserByEmail(email)
	if err != nil {
		return userEntity.User{}, err
	}

	return *user, nil
}

func ServiceUpdateUser(user userEntity.User) error {
	err := repository.UpdateUser(user)
	if err != nil {
		return err
	}

	return nil
}
