package repo

import (
	"fmt"
	"log/slog"
	"time"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"

	"servicetemplate/config"
	"servicetemplate/logger"
)

func GetConnectionString(cnf config.DBConfig) string {
	connString := fmt.Sprintf(
		"user=%s password=%s host=%s port=%d dbname=%s",
		cnf.User(),
		cnf.Password(),
		cnf.Host(),
		cnf.Port(),
		cnf.Name(),
	)
	if !cnf.EnableSSLMode() {
		connString += " sslmode=disable"
	}
	return connString
}

func GetDbConnection(cnf config.DBConfig) (*sqlx.DB, error) {
	dbSource := GetConnectionString(cnf)

	dbCon, err := sqlx.Connect("postgres", dbSource)
	if err != nil {
		slog.Error(fmt.Sprintf("Connection error%v", err), logger.Extra(map[string]any{
			"error": err.Error(),
		}))
		return nil, err
	}
	dbCon.SetMaxOpenConns(cnf.MaxOpenConns())
	dbCon.SetMaxIdleConns(cnf.MaxIdleConns())
	dbCon.SetConnMaxIdleTime(
		time.Duration(cnf.MaxIdleTimeInMinutes() * int(time.Minute)),
	)

	return dbCon, nil
}

func CloseDB(db *sqlx.DB) error {
	if err := db.Close(); err != nil {
		return err
	}

	slog.Info("Disconnected from database")

	return nil
}
