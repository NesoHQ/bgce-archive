package logger

import (
	"log/slog"
	"net/url"
	"time"
)

type LogLevel string

const (
	LevelInfo    LogLevel = "info"
	LevelDebug   LogLevel = "debug"
	LevelWarning LogLevel = "warning"
	LevelError   LogLevel = "error"
)

var levels map[slog.Level]string = map[slog.Level]string{
	slog.LevelDebug: string(LevelDebug),
	slog.LevelInfo:  string(LevelInfo),
	slog.LevelWarn:  string(LevelWarning),
	slog.LevelError: string(LevelError),
}

var (
	Debug = slog.Debug
	Info  = slog.Info
	Warn  = slog.Warn
	Error = slog.Error
)

type LogKey string

const (
	ServiceKey   LogKey = "service"
	LevelKey     LogKey = "level"
	TimeKey      LogKey = "timestamp"
	PathKey      LogKey = "path"
	QueryKey     LogKey = "query"
	MethodKey    LogKey = "method"
	MessageKey   LogKey = "message"
	ExtraKey     LogKey = "extra"
	UserAgentKey LogKey = "useragent"
	IpKey        LogKey = "ip"
	CallerKey    LogKey = "caller"
	StatusKey    LogKey = "status"
	LatencyKey   LogKey = "latency"
	LengthKey    LogKey = "length"
	TraceIDKey   LogKey = "trace_id"
	SpanIDKey    LogKey = "span_id"
)

func Path(path string) slog.Attr {
	return slog.String(string(PathKey), path)
}

func SpanID(spanId string) slog.Attr {
	return slog.String(string(SpanIDKey), spanId)
}

func TraceID(traceId string) slog.Attr {
	return slog.String(string(TraceIDKey), traceId)
}

func Query(query url.Values) slog.Attr {
	return slog.Any(string(QueryKey), query)
}

func Method(method string) slog.Attr {
	return slog.String(string(MethodKey), method)
}

func Extra(value any) slog.Attr {
	return slog.Any(string(ExtraKey), value)
}

func UserAgent(ua string) slog.Attr {
	return slog.String(string(UserAgentKey), ua)
}

func Ip(ip string) slog.Attr {
	return slog.String(string(IpKey), ip)
}

func Status(statusCode int) slog.Attr {
	return slog.Int(string(StatusKey), statusCode)
}

func Latency(d time.Duration) slog.Attr {
	return slog.Float64(string(LatencyKey), d.Seconds())
}

func Length(l int) slog.Attr {
	return slog.Int(string(LengthKey), l)
}
