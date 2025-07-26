package config

type ReadDB struct {
	DbHost                 string `mapstructure:"READ_DB_HOST"                       validate:"required"`
	DbPort                 int    `mapstructure:"READ_DB_PORT"                       validate:"required"`
	DbName                 string `mapstructure:"READ_DB_NAME"                       validate:"required"`
	DbUser                 string `mapstructure:"READ_DB_USER"                       validate:"required"`
	DbPassword             string `mapstructure:"READ_DB_PASSWORD"                   validate:"required"`
	DbMaxIdleTimeInMinutes int    `mapstructure:"READ_DB_MAX_IDLE_TIME_IN_MINUTES"   validate:"required"`
	DbMaxOpenConns         int    `mapstructure:"READ_DB_MAX_OPEN_CONNS"             validate:"required"`
	DbMaxIdleConns         int    `mapstructure:"READ_DB_MAX_IDLE_CONNS"             validate:"required"`
	DbEnableSSLMode        bool   `mapstructure:"READ_DB_ENABLE_SSL_MODE"`
}

func (db *ReadDB) User() string              { return db.DbUser }
func (db *ReadDB) Password() string          { return db.DbPassword }
func (db *ReadDB) Host() string              { return db.DbHost }
func (db *ReadDB) Port() int                 { return db.DbPort }
func (db *ReadDB) Name() string              { return db.DbName }
func (db *ReadDB) EnableSSLMode() bool       { return db.DbEnableSSLMode }
func (db *ReadDB) MaxIdleTimeInMinutes() int { return db.DbMaxIdleTimeInMinutes }
func (db *ReadDB) MaxOpenConns() int         { return db.DbMaxOpenConns }
func (db *ReadDB) MaxIdleConns() int         { return db.DbMaxIdleConns }

type WriteDB struct {
	DbHost                 string `mapstructure:"WRITE_DB_HOST"                       validate:"required"`
	DbPort                 int    `mapstructure:"WRITE_DB_PORT"                       validate:"required"`
	DbName                 string `mapstructure:"WRITE_DB_NAME"                       validate:"required"`
	DbUser                 string `mapstructure:"WRITE_DB_USER"                       validate:"required"`
	DbPassword             string `mapstructure:"WRITE_DB_PASSWORD"                   validate:"required"`
	DbMaxIdleTimeInMinutes int    `mapstructure:"WRITE_DB_MAX_IDLE_TIME_IN_MINUTES"   validate:"required"`
	DbMaxOpenConns         int    `mapstructure:"WRITE_DB_MAX_OPEN_CONNS"             validate:"required"`
	DbMaxIdleConns         int    `mapstructure:"WRITE_DB_MAX_IDLE_CONNS"             validate:"required"`
	DbEnableSSLMode        bool   `mapstructure:"WRITE_DB_ENABLE_SSL_MODE"`
}

func (db *WriteDB) User() string              { return db.DbUser }
func (db *WriteDB) Password() string          { return db.DbPassword }
func (db *WriteDB) Host() string              { return db.DbHost }
func (db *WriteDB) Port() int                 { return db.DbPort }
func (db *WriteDB) Name() string              { return db.DbName }
func (db *WriteDB) EnableSSLMode() bool       { return db.DbEnableSSLMode }
func (db *WriteDB) MaxIdleTimeInMinutes() int { return db.DbMaxIdleTimeInMinutes }
func (db *WriteDB) MaxOpenConns() int         { return db.DbMaxOpenConns }
func (db *WriteDB) MaxIdleConns() int         { return db.DbMaxIdleConns }
