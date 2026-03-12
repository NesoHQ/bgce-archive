package main

import (
	"axon/cache"
	"axon/cmd"
)

func main() {
	// Initialize DNS caching to reduce DNS lookup overhead
	cache.InitDNSCache()

	cmd.Execute()
}
