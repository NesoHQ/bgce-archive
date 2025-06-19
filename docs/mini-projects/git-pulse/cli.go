package main

import (
	"errors"
	"os"
)

func RunCLI() error {
	if len(os.Args) < 2 {
		return errors.New("usage: github-activity <username>")
	}

	username := os.Args[1]
	err := FetchAndPrintActivity(username)
	if err != nil {
		return err
	}

	return nil
}