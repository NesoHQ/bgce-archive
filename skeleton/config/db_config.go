package config

type DBConfig interface {
	User() string
	Password() string
	Host() string
	Port() int
	Name() string
	EnableSSLMode() bool
	MaxIdleTimeInMinutes() int
	MaxIdleConns() int
	MaxOpenConns() int
}
