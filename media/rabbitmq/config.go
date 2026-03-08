package rabbitmq

import (
	"fmt"
)

const CortexExchange = "cortex"

func QueueName(queuePrefix, routingKey string) string {
	return fmt.Sprintf("%s%s:queue", queuePrefix, routingKey)
}
