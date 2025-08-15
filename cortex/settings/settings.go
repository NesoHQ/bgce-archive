package settings

import (
	"cortex/config"
)

type settings struct {
	Cnf *config.Config
}

func GetSettings(
	cnf *config.Config,
) Settings {
	return &settings{
		Cnf: cnf,
	}
}
