package config

import (
	"fmt"
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

var configuration Config

type Config struct {
	Version     string
	ServiceName string
	HttpPort    int
}

func loadConfig() {

	err := godotenv.Load()
	if err != nil {
		fmt.Println("Fail to load .env variables: ", err)
		os.Exit(1)
	}

	version := os.Getenv("VERSION")
	if version == "" {
		log.Fatal("version is required")
		os.Exit(1)
	}

	serviceName := os.Getenv("SERVICE_NAME")
	if serviceName == "" {
		log.Fatal("service name is required")
		os.Exit(1)
	}

	httpPort := os.Getenv("HTTP_PORT")
	if httpPort == "" {
		log.Fatal("http port is required")
		os.Exit(1)
	}

	port, err := strconv.ParseInt(httpPort, 10, 64)
	if err != nil {
		log.Fatal("post must be a number")
		os.Exit(1)
	}

	configuration = Config{
		Version:     version,
		ServiceName: serviceName,
		HttpPort:    int(port), // type casting ()
	}

}

func GetCConfig() Config {
	loadConfig()
	return configuration
}
