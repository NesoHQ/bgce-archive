package logger

import (
	"encoding/json"
)

func ConvertToJson(data interface{}) string {
	rv, err := json.Marshal(data)
	if err != nil {
		Error(err.Error())
		return ""
	}
	
	return string(rv)
}
