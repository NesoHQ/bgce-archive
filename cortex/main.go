package main

import (
	"context"
	"os/signal"
	"syscall"

	"cortex/cmd"
)

func main() {
	ctx, cancel := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer cancel()
	cmd.Execute(ctx)
}
