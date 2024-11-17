package repository

import (
	"context"
	"plannertime/db"
	"plannertime/entity"
	"time"

	"github.com/jackc/pgx/v5"
)

type Event struct {
	Id          int       `json:"eventId"`
	Start       time.Time `json:"start"`
	End         time.Time `json:"end"`
	Description string    `json:"description"`
	Priority    int       `json:"priority"`
}

func UpdateEvent(event Event) error {
	conn, err := db.ConnectToDatabase()
	if err != nil {
		return err
	}

	query := `update public.events
	set start_timestamp=$1, end_timestamp=$2, description=$3, priority=$4
	where event_id=$5;`

	_, err = conn.Prepare(context.Background(), "ue", query)

	_, err = conn.Exec(context.Background(), "ue", event.Start, event.End, event.Description, event.Priority)
	if err != nil {
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

func GetEventsAndRestrictions(userId int) ([]Event, pgx.Rows, error) {
	conn, err := db.ConnectToDatabase()
	if err != nil {
		return nil, nil, err
	}

	println(userId)

	eventsQuery := `select event_id, start_timestamp, end_timestamp, description, priority from public.events where user_id = $1`

	//restrictionsQuery := `select description, crontab from public.restrictions where user_id = $1`

	rows, err := conn.Query(context.Background(), eventsQuery, userId)
	if err != nil {
		return nil, nil, err
	}

	var events []Event
	for rows.Next() {
		var event Event
		if err := rows.Scan(&event.Id, &event.Start, &event.End, &event.Description, &event.Priority); err != nil {
			return nil, nil, err
		}

		events = append(events, event)
	}

	//_, err = conn.Query(context.Background(), "sr", userId)
	//if err != nil {
	//	return nil, nil, err
	//}

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

	query := `delete from public.restrictions where user_id = $1;`

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
