package config

type ReadCortexDB struct {
	DbHost                 string `mapstructure:"READ_CORTEX_DB_HOST"                       validate:"required"`
	DbPort                 int    `mapstructure:"READ_CORTEX_DB_PORT"                       validate:"required"`
	DbName                 string `mapstructure:"READ_CORTEX_DB_NAME"                       validate:"required"`
	DbUser                 string `mapstructure:"READ_CORTEX_DB_USER"                       validate:"required"`
	DbPassword             string `mapstructure:"READ_CORTEX_DB_PASSWORD"                   validate:"required"`
	DbMaxIdleTimeInMinutes int    `mapstructure:"READ_CORTEX_DB_MAX_IDLE_TIME_IN_MINUTES"   validate:"required"`
	DbMaxOpenConns         int    `mapstructure:"READ_CORTEX_DB_MAX_OPEN_CONNS"             validate:"required"`
	DbMaxIdleConns         int    `mapstructure:"READ_CORTEX_DB_MAX_IDLE_CONNS"             validate:"required"`
	DbEnableSSLMode        bool   `mapstructure:"READ_CORTEX_DB_ENABLE_SSL_MODE"`
}

func (db *ReadCortexDB) User() string              { return db.DbUser }
func (db *ReadCortexDB) Password() string          { return db.DbPassword }
func (db *ReadCortexDB) Host() string              { return db.DbHost }
func (db *ReadCortexDB) Port() int                 { return db.DbPort }
func (db *ReadCortexDB) Name() string              { return db.DbName }
func (db *ReadCortexDB) EnableSSLMode() bool       { return db.DbEnableSSLMode }
func (db *ReadCortexDB) MaxIdleTimeInMinutes() int { return db.DbMaxIdleTimeInMinutes }
func (db *ReadCortexDB) MaxOpenConns() int         { return db.DbMaxOpenConns }
func (db *ReadCortexDB) MaxIdleConns() int         { return db.DbMaxIdleConns }

type WriteCortexDB struct {
	DbHost                 string `mapstructure:"WRITE_CORTEX_DB_HOST"                       validate:"required"`
	DbPort                 int    `mapstructure:"WRITE_CORTEX_DB_PORT"                       validate:"required"`
	DbName                 string `mapstructure:"WRITE_CORTEX_DB_NAME"                       validate:"required"`
	DbUser                 string `mapstructure:"WRITE_CORTEX_DB_USER"                       validate:"required"`
	DbPassword             string `mapstructure:"WRITE_CORTEX_DB_PASSWORD"                   validate:"required"`
	DbMaxIdleTimeInMinutes int    `mapstructure:"WRITE_CORTEX_DB_MAX_IDLE_TIME_IN_MINUTES"   validate:"required"`
	DbMaxOpenConns         int    `mapstructure:"WRITE_CORTEX_DB_MAX_OPEN_CONNS"             validate:"required"`
	DbMaxIdleConns         int    `mapstructure:"WRITE_CORTEX_DB_MAX_IDLE_CONNS"             validate:"required"`
	DbEnableSSLMode        bool   `mapstructure:"WRITE_CORTEX_DB_ENABLE_SSL_MODE"`
}

func (db *WriteCortexDB) User() string              { return db.DbUser }
func (db *WriteCortexDB) Password() string          { return db.DbPassword }
func (db *WriteCortexDB) Host() string              { return db.DbHost }
func (db *WriteCortexDB) Port() int                 { return db.DbPort }
func (db *WriteCortexDB) Name() string              { return db.DbName }
func (db *WriteCortexDB) EnableSSLMode() bool       { return db.DbEnableSSLMode }
func (db *WriteCortexDB) MaxIdleTimeInMinutes() int { return db.DbMaxIdleTimeInMinutes }
func (db *WriteCortexDB) MaxOpenConns() int         { return db.DbMaxOpenConns }
func (db *WriteCortexDB) MaxIdleConns() int         { return db.DbMaxIdleConns }
