package processor

import (
	"os"
)

func CountBytes(file *os.File)(int, error){
	info , err := file.Stat()
	if err != nil {
		return 0, err
	}
	return int(info.Size()) , nil

}