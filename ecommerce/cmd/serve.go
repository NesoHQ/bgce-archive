package cmd

import (
	"ecommerce/config"
	"ecommerce/rest"
)

func Serve() {

	cnf := config.GetCConfig()
	rest.Start(cnf)
}
