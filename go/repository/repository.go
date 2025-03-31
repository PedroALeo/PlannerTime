package repository

import (
	"context"
	"log"
	"plannertime/db"
	"plannertime/entity"
	"strconv"
	"strings"
	"time"
)

type Event struct {
	Id          int       `json:"eventId"`
	Duration    int       `json:"duration"`
	End         time.Time `json:"end"`
	Description string    `json:"description"`
	Priority    int       `json:"priority"`
}

type Task struct {
	Id       int    `json:"id"`
	Name     string `json:"name"`
	Duration int    `json:"estimatedTime"`
	Priority int    `json:"priority"`
	End      string `json:"dueDate"`
}

type Restriction struct {
	Id       int    `json:"id"`
	Name     int    `json:"name"`
	Duration string `json:"duration"`
	Day      string `json:"weekDay"`
}

func GetTasks(email string) ([]Task, error) {
	conn, err := db.ConnectToDatabase()
	if err != nil {
		return nil, err
	}

	tasksQuery := `select task_id, name, duration, priority, end_timestamp from public.tasks where user_email = $1`

	rows, err := conn.Query(context.Background(), tasksQuery, email)
	if err != nil {
		return nil, err
	}

	var rs []Task
	for rows.Next() {
		var r Task
		var ed time.Time
		if err := rows.Scan(&r.Id, &r.Name, &r.Duration, r.Priority, &ed); err != nil {
			return nil, err
		}

		r.End = strings.Split(ed.String(), " ")[0]

		rs = append(rs, r)
	}

	return rs, nil
}

func GetRestrictions(userId int) ([]Restriction, error) {
	conn, err := db.ConnectToDatabase()
	if err != nil {
		return nil, err
	}

	eventsQuery := `select restriction_id, name, day, start_hour, end_hour from public.restrictions where user_id = $1`

	rows, err := conn.Query(context.Background(), eventsQuery, userId)
	if err != nil {
		return nil, err
	}

	var rs []Restriction
	for rows.Next() {
		var r Restriction
		var sh, eh string
		if err := rows.Scan(&r.Id, &r.Name, &r.Day, &sh, &eh); err != nil {
			return nil, err
		}

		shi, err := strconv.Atoi(strings.Split(sh, ":")[0])
		if err != nil {
			return nil, err
		}

		ehi, err := strconv.Atoi(strings.Split(eh, ":")[0])
		if err != nil {
			return nil, err
		}

		r.Duration = strconv.Itoa(ehi - shi)

		rs = append(rs, r)
	}

	return rs, nil
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
	//conn, err := db.ConnectToDatabase()
	//if err != nil {
	//	return nil, err
	//}

	//restrictionsQuery := `select restriction_id, description, frequency from public.restrictions where user_id = $1`

	//rows, err := conn.Query(context.Background(), restrictionsQuery, userId)
	//if err != nil {
	//	return nil, err
	//}

	//var rests []Restriction
	//for rows.Next() {
	//	var rest Restriction
	//	if err := rows.Scan(&rest.Id, &rest.Description, &rest.Frequency); err != nil {
	//		return nil, err
	//	}

	//	rests = append(rests, rest)
	//}

	return nil, nil
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

func GetUserByEmail(email string) (*userEntity.User, error) {
	conn, err := db.ConnectToDatabase()
	if err != nil {
		return nil, err
	}

	query := `select user_id, email, username, password from public.users where email = $1`

	conn.Prepare(context.Background(), "su", query)

	rows, err := conn.Query(context.Background(), "su", email)
	if err != nil {
		return nil, err
	}

	var user userEntity.User

	for rows.Next() {
		if err := rows.Scan(&user.Id, &user.Email, &user.Username, &user.Password); err != nil {
			return nil, err
		}
	}

	return &user, nil
}

func CreateTask(userEmail, name string, estimateDuration, priority int, endDate time.Time) error {
	conn, err := db.ConnectToDatabase()
	if err != nil {
		return err
	}

	query := `insert into public.tasks
	(name, duration, priority, end_timestamp, user_email)
	values($1, $2, $3, $4, $5);`

	_, err = conn.Prepare(context.Background(), "ie", query)
	if err != nil {
		return err
	}

	_, err = conn.Exec(context.Background(), "ie", estimateDuration, priority, endDate, userEmail)
	if err != nil {
		return err
	}

	return nil
}

func CreateRestriction(userId int, name, start, end string, days []string) error {
	conn, err := db.ConnectToDatabase()
	if err != nil {
		return err
	}

	for _, day := range days {
		query := `insert into public.restrictions
		(name, day, start_hour, end_hour, user_id)
		values($1, $2, $3, $4, $5);`

		_, err = conn.Prepare(context.Background(), "ir", query)
		if err != nil {
			return err
		}

		_, err = conn.Exec(context.Background(), "ir", name, day, start, end, userId)
		if err != nil {
			return err
		}
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

func CreateUser(email, username, password string) error {
	conn, err := db.ConnectToDatabase()
	if err != nil {
		log.Println(err.Error())
		return err
	}

	query := `INSERT INTO public.users
	(username, email, "password")
	VALUES($1, $2, $3);`

	_, err = conn.Exec(context.Background(), query, username, email, password)
	if err != nil {
		log.Println(err.Error())
		return err
	}

	return nil
}

func UpdateUser(user userEntity.User) error {
	conn, err := db.ConnectToDatabase()
	if err != nil {
		return err
	}

	query := `
	UPDATE public.users
	SET username=$1, password=$2, bio=$3, email=$4, phone_number=$5, language_preference=$6, profile_picture=$7
	WHERE user_id=$8;`

	_, err = conn.Prepare(context.Background(), "update_user", query)
	if err != nil {
		log.Println(err.Error())
		return err
	}

	_, err = conn.Exec(context.Background(), "update_user", user.Username, user.Password, user.Bio, user.Email, user.PhoneNumber, user.LanguagePreference, user.ProfilePicture, user.Id)
	if err != nil {
		log.Println(err.Error())
		return err
	}

	return nil
}
