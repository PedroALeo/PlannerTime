package db

import (
	"context"

	"github.com/jackc/pgx/v5"
)

func ConnectToDatabase() (*pgx.Conn, error) {
	conn, err := pgx.Connect(context.Background(), "postgresql://postgres:postgres@db:5432/postgres")
	if err != nil {
		return nil, err
	}

	return conn, nil
}
