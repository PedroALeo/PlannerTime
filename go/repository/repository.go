package repository

import (
	"context"
	"plannertime/db"
	"plannertime/entity"
	"time"

	"github.com/jackc/pgx/v5"
)

type Event struct {
	Start       time.Time `json:"start"`
	End         time.Time `json:"end"`
	Description string    `json:"description"`
}

func GetEventsAndRestrictions(userId int) ([]Event, pgx.Rows, error) {
	conn, err := db.ConnectToDatabase()
	if err != nil {
		return nil, nil, err
	}

	eventsQuery := `select start_timestamp, end_timestamp, description from public.events where user_id = $1`

	restrictionsQuery := `select description, crontab from public.restrictions where user_id = $1`

	_, err = conn.Prepare(context.Background(), "se", eventsQuery)
	if err != nil {
		return nil, nil, err
	}

	_, err = conn.Prepare(context.Background(), "sr", restrictionsQuery)
	if err != nil {
		return nil, nil, err
	}

	rows, err := conn.Query(context.Background(), "se", userId)
	if err != nil {
		return nil, nil, err
	}

	var events []Event
	for rows.Next() {
		var event Event
		if err := rows.Scan(&event.Start, &event.End, &event.Description); err != nil {
			return nil, nil, err
		}

		events = append(events, event)
	}

	_, err = conn.Query(context.Background(), "sr", userId)
	if err != nil {
		return nil, nil, err
	}

	return events, nil, nil
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

func CreateEvent(userId int, startDate, endDate, description string) error {
	startDateTimestamp, err := time.Parse(time.DateTime, startDate)
	if err != nil {
		return err
	}

	endDateTimestamp, err := time.Parse(time.DateTime, endDate)
	if err != nil {
		return err
	}

	conn, err := db.ConnectToDatabase()
	if err != nil {
		return err
	}

	query := `insert into public.events
	(start_timestamp, end_timestamp, description, user_id)
	values($1, $2, $3, $4);`

	_, err = conn.Prepare(context.Background(), "ie", query)
	if err != nil {
		return err
	}

	_, err = conn.Exec(context.Background(), "ie", startDateTimestamp, endDateTimestamp, description, userId)
	if err != nil {
		return err
	}

	return nil
}

func CreateRestriction(userId int, startDate, endDate, description string) error {
	startDateTimestamp, err := time.Parse(time.DateTime, startDate)
	if err != nil {
		return err
	}

	endDateTimestamp, err := time.Parse(time.DateTime, endDate)
	if err != nil {
		return err
	}

	conn, err := db.ConnectToDatabase()
	if err != nil {
		return err
	}

	query := `insert into public.restrictions
	(start_timestamp, end_timestamp, description, user_id)
	values($1, $2, $3, $4);`

	_, err = conn.Prepare(context.Background(), "ir", query)
	if err != nil {
		return err
	}

	_, err = conn.Exec(context.Background(), "ir", startDateTimestamp, endDateTimestamp, description, userId)
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
