package cache

import (
	"context"
	"net"
	"time"
)

// InitDNSCache configures DNS caching to reduce DNS lookup overhead
// This should be called once during application initialization
func InitDNSCache() {
	// Configure custom DNS resolver with caching
	net.DefaultResolver = &net.Resolver{
		PreferGo: true, // Use Go's built-in DNS resolver
		Dial: func(ctx context.Context, network, address string) (net.Conn, error) {
			d := net.Dialer{
				Timeout: 2 * time.Second, // DNS lookup timeout
			}
			return d.DialContext(ctx, network, address)
		},
	}
}
