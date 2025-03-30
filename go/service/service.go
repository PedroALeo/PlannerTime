package service

import (
	userEntity "plannertime/entity"
	"plannertime/repository"

	"golang.org/x/crypto/bcrypt"
)

type restrictions struct{}

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

func ServiceLogin(username, password string) (bool, error) {
	user, err := ServiceFindUser(username)
	if err != nil {
		return false, err
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return false, err
	}

	return true, nil
}

func ServiceCreateUser(username, password string) error {
	hashPass, err := bcrypt.GenerateFromPassword([]byte(password), 4)
	if err != nil {
		return err
	}

	err = repository.CreateUser(username, string(hashPass))
	if err != nil {
		return err
	}

	return nil
}

func ServiceCreateEvent(userId, EstimatedDuration, priority int, endDate, description string) error {
	err := repository.CreateEvent(userId, EstimatedDuration, priority, endDate, description)
	if err != nil {
		return err
	}

	return nil
}

func ServiceCreateRestriction(userId int, crontab, description string) error {
	err := repository.CreateRestriction(userId, crontab, description)
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

func ServiceFindUser(username string) (userEntity.User, error) {
	user, err := repository.GetUser(username)
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
