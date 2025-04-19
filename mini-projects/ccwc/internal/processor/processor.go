package processor

import (
	"bufio"
	"os"
)

func CountBytes(file *os.File)(int, error){
	info , err := file.Stat()
	if err != nil {
		return 0, err
	}
	return int(info.Size()) , nil
}

func CountLines(file *os.File)(int, error){
	scanner := bufio.NewScanner(file)
	lineCount := 0
	
	for scanner.Scan(){
		lineCount ++
	}
	return lineCount, scanner.Err()
}