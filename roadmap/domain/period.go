package domain

import (
	"fmt"
	"time"
)

type Quartile string

const (
	Q1 Quartile = "Q1"
	Q2 Quartile = "Q2"
	Q3 Quartile = "Q3"
	Q4 Quartile = "Q4"
)

type Period struct {
	Quartile Quartile `json:"quartile" bson:"quartile"`
	Year     int      `json:"year" bson:"year"`
}

func (p Period) String() string {
	return fmt.Sprintf("%s %d", p.Quartile, p.Year)
}

func GetPeriodFromTime(t time.Time) Period {
	month := t.Month()
	year := t.Year()

	var quartile Quartile
	switch {
	case month >= 1 && month <= 3:
		quartile = Q1
	case month >= 4 && month <= 6:
		quartile = Q2
	case month >= 7 && month <= 9:
		quartile = Q3
	case month >= 10 && month <= 12:
		quartile = Q4
	}

	return Period{
		Quartile: quartile,
		Year:     year,
	}
}
