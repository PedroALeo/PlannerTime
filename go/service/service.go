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

func ServiceGetUserScheduller(userId int) ([]repository.Event, error) {
	events, _, err := repository.GetEventsAndRestrictions(userId)
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

func ServiceCreateEvent(userId int, startDate, endDate, description string) error {
	err := repository.CreateEvent(userId, startDate, endDate, description)
	if err != nil {
		return err
	}

	return nil
}

func ServiceCreateRestriction(userId int, startDate, endDate, description string) error {
	err := repository.CreateRestriction(userId, startDate, endDate, description)
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
