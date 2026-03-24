package config

const (
	DebugMode   = "debug"
	ReleaseMode = "release"
)

type Config struct {
	Version     string
	Mode        string
	ServiceName string
	HTTPPort    string

	JWTSecret string

	MongoDBURI   string
	MonggoDBName string
}

var AppConfig *Config

func GetConfig() *Config {
	if AppConfig == nil {
		AppConfig = LoadConfig()
	}
	return AppConfig
}
