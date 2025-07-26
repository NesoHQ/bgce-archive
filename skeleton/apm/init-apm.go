package apm

import (
	"log/slog"
	"net/url"

	"go.elastic.co/apm"
	"go.elastic.co/apm/transport"

	"servicetemplate/config"
)

func InitAPM(cnf config.Apm) {
	serverURL, err := url.Parse(cnf.ServerURL)
	if err != nil {
		slog.Error(err.Error())
	}

	transport, err := transport.NewHTTPTransport()
	if err != nil {
		slog.Error(err.Error())
	}

	transport.SetServerURL(serverURL)
	transport.SetSecretToken(cnf.SecretToken)

	apmClient := apm.DefaultTracer
	apmClient.Service.Name = cnf.ServiceName
	apmClient.Transport = transport
	apmClient.Service.Environment = cnf.Environment

	slog.Info("APM client initialized")
}
