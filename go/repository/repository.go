package repository

import (
	"context"
	"log"
	"plannertime/db"
	"plannertime/entity"
	"time"
)

type Event struct {
	Id          int       `json:"eventId"`
	Duration    int       `json:"duration"`
	End         time.Time `json:"end"`
	Description string    `json:"description"`
	Priority    int       `json:"priority"`
}

type Restriction struct {
	Id          int    `json:"restrictionId"`
	Frequency   string `json:"frequency"`
	Description string `json:"description"`
}

func UpdateEvent(event Event) error {
	conn, err := db.ConnectToDatabase()
	if err != nil {
		return err
	}

	query := `update public.events
	set duration=$1, end_timestamp=$2, description=$3, priority=$4
	where event_id=$5;`

	_, err = conn.Prepare(context.Background(), "ue", query)

	_, err = conn.Exec(context.Background(), "ue", event.Duration, event.End, event.Description, event.Priority, event.Id)
	if err != nil {
		log.Println(err.Error())
		return err
	}

	return nil
}

func DeleteEvent(eventId int) error {
	conn, err := db.ConnectToDatabase()
	if err != nil {
		return err
	}

	query := `delete from public.events where event_id = $1`

	_, err = conn.Prepare(context.Background(), "de", query)

	_, err = conn.Exec(context.Background(), "de", eventId)
	if err != nil {
		return err
	}

	return nil
}

func GetRest(userId int) ([]Restriction, error) {
	conn, err := db.ConnectToDatabase()
	if err != nil {
		return nil, err
	}

	restrictionsQuery := `select restriction_id, description, frequency from public.restrictions where user_id = $1`

	rows, err := conn.Query(context.Background(), restrictionsQuery, userId)
	if err != nil {
		return nil, err
	}

	var rests []Restriction
	for rows.Next() {
		var rest Restriction
		if err := rows.Scan(&rest.Id, &rest.Description, &rest.Frequency); err != nil {
			return nil, err
		}

		rests = append(rests, rest)
	}

	return rests, nil
}

func GetEventsAndRestrictions(userId int) ([]Event, error) {
	conn, err := db.ConnectToDatabase()
	if err != nil {
		return nil, err
	}

	println(userId)

	eventsQuery := `select event_id, duration, end_timestamp, description, priority from public.events where user_id = $1`

	rows, err := conn.Query(context.Background(), eventsQuery, userId)
	if err != nil {
		return nil, err
	}

	var events []Event
	for rows.Next() {
		var event Event
		if err := rows.Scan(&event.Id, &event.Duration, &event.End, &event.Description, &event.Priority); err != nil {
			return nil, err
		}

		events = append(events, event)
	}

	return events, nil
}

func GetUser(username string) (*userEntity.User, error) {
	conn, err := db.ConnectToDatabase()
	if err != nil {
		return nil, err
	}

	query := `select * from public.users where username = $1`

	conn.Prepare(context.Background(), "su", query)

	rows, err := conn.Query(context.Background(), "su", username)
	if err != nil {
		return nil, err
	}

	var user userEntity.User

	for rows.Next() {
		if err := rows.Scan(&user.Id, &user.Username, &user.Password); err != nil {
			return nil, err
		}
	}

	return &user, nil
}

func CreateEvent(userId, estimateDuration, priority int, endDate, description string) error {
	endDateTimestamp, err := time.Parse(time.DateTime, endDate)
	if err != nil {
		return err
	}

	conn, err := db.ConnectToDatabase()
	if err != nil {
		return err
	}

	query := `insert into public.events
	(duration, priority, end_timestamp, description, user_id)
	values($1, $2, $3, $4, $5);`

	_, err = conn.Prepare(context.Background(), "ie", query)
	if err != nil {
		return err
	}

	_, err = conn.Exec(context.Background(), "ie", estimateDuration, priority, endDateTimestamp, description, userId)
	if err != nil {
		return err
	}

	return nil
}

func CreateRestriction(userId int, crontab, description string) error {
	conn, err := db.ConnectToDatabase()
	if err != nil {
		return err
	}

	query := `insert into public.restrictions
	(frequency, description, user_id)
	values($1, $2, $3);`

	_, err = conn.Prepare(context.Background(), "ir", query)
	if err != nil {
		return err
	}

	_, err = conn.Exec(context.Background(), "ir", crontab, description, userId)
	if err != nil {
		return err
	}

	return nil
}

func UpdateRestriction(userId int, crontab, description string) error {
	conn, err := db.ConnectToDatabase()
	if err != nil {
		return err
	}

	query := `update public.restrictions
		set frequency = $1, 
		description = $2 
	where user_id = $3;`

	_, err = conn.Prepare(context.Background(), "ir", query)
	if err != nil {
		return err
	}

	_, err = conn.Exec(context.Background(), "ir", crontab, description, userId)
	if err != nil {
		return err
	}

	return nil
}

func DeleteRestriction(userId int) error {
	conn, err := db.ConnectToDatabase()
	if err != nil {
		return err
	}

	query := `delete from public.restrictions where restriction_id = $1;`

	_, err = conn.Prepare(context.Background(), "ir", query)
	if err != nil {
		return err
	}

	_, err = conn.Exec(context.Background(), "ir", userId)
	if err != nil {
		return err
	}

	return nil
}

func CreateUser(username, password string) error {
	conn, err := db.ConnectToDatabase()
	if err != nil {
		return err
	}

	query := `INSERT INTO public.users
	(username, "password")
	VALUES($1, $2);`

	_, err = conn.Exec(context.Background(), query, username, password)
	if err != nil {
		return err
	}

	return nil
}
