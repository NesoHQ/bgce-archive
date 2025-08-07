package config

type ReadBgceDB struct {
	DbHost                 string `mapstructure:"READ_BGCE_DB_HOST"                       validate:"required"`
	DbPort                 int    `mapstructure:"READ_BGCE_DB_PORT"                       validate:"required"`
	DbName                 string `mapstructure:"READ_BGCE_DB_NAME"                       validate:"required"`
	DbUser                 string `mapstructure:"READ_BGCE_DB_USER"                       validate:"required"`
	DbPassword             string `mapstructure:"READ_BGCE_DB_PASSWORD"                   validate:"required"`
	DbMaxIdleTimeInMinutes int    `mapstructure:"READ_BGCE_DB_MAX_IDLE_TIME_IN_MINUTES"   validate:"required"`
	DbMaxOpenConns         int    `mapstructure:"READ_BGCE_DB_MAX_OPEN_CONNS"             validate:"required"`
	DbMaxIdleConns         int    `mapstructure:"READ_BGCE_DB_MAX_IDLE_CONNS"             validate:"required"`
	DbEnableSSLMode        bool   `mapstructure:"READ_BGCE_DB_ENABLE_SSL_MODE"`
}

func (db *ReadBgceDB) User() string              { return db.DbUser }
func (db *ReadBgceDB) Password() string          { return db.DbPassword }
func (db *ReadBgceDB) Host() string              { return db.DbHost }
func (db *ReadBgceDB) Port() int                 { return db.DbPort }
func (db *ReadBgceDB) Name() string              { return db.DbName }
func (db *ReadBgceDB) EnableSSLMode() bool       { return db.DbEnableSSLMode }
func (db *ReadBgceDB) MaxIdleTimeInMinutes() int { return db.DbMaxIdleTimeInMinutes }
func (db *ReadBgceDB) MaxOpenConns() int         { return db.DbMaxOpenConns }
func (db *ReadBgceDB) MaxIdleConns() int         { return db.DbMaxIdleConns }

type WriteBgceDB struct {
	DbHost                 string `mapstructure:"WRITE_BGCE_DB_HOST"                       validate:"required"`
	DbPort                 int    `mapstructure:"WRITE_BGCE_DB_PORT"                       validate:"required"`
	DbName                 string `mapstructure:"WRITE_BGCE_DB_NAME"                       validate:"required"`
	DbUser                 string `mapstructure:"WRITE_BGCE_DB_USER"                       validate:"required"`
	DbPassword             string `mapstructure:"WRITE_BGCE_DB_PASSWORD"                   validate:"required"`
	DbMaxIdleTimeInMinutes int    `mapstructure:"WRITE_BGCE_DB_MAX_IDLE_TIME_IN_MINUTES"   validate:"required"`
	DbMaxOpenConns         int    `mapstructure:"WRITE_BGCE_DB_MAX_OPEN_CONNS"             validate:"required"`
	DbMaxIdleConns         int    `mapstructure:"WRITE_BGCE_DB_MAX_IDLE_CONNS"             validate:"required"`
	DbEnableSSLMode        bool   `mapstructure:"WRITE_BGCE_DB_ENABLE_SSL_MODE"`
}

func (db *WriteBgceDB) User() string              { return db.DbUser }
func (db *WriteBgceDB) Password() string          { return db.DbPassword }
func (db *WriteBgceDB) Host() string              { return db.DbHost }
func (db *WriteBgceDB) Port() int                 { return db.DbPort }
func (db *WriteBgceDB) Name() string              { return db.DbName }
func (db *WriteBgceDB) EnableSSLMode() bool       { return db.DbEnableSSLMode }
func (db *WriteBgceDB) MaxIdleTimeInMinutes() int { return db.DbMaxIdleTimeInMinutes }
func (db *WriteBgceDB) MaxOpenConns() int         { return db.DbMaxOpenConns }
func (db *WriteBgceDB) MaxIdleConns() int         { return db.DbMaxIdleConns }
