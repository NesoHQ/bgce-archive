package processor

import (
	"bufio"
	"os"
	"strings"
)

func CountBytes(file *os.File)(int, error){
	info , err := file.Stat()
	if err != nil {
		return 0, err
	}
	return int(info.Size()), nil
}

func CountLines(file *os.File)(int, error){
	scanner := bufio.NewScanner(file)
	lineCount := 0
	
	for scanner.Scan(){
		lineCount ++
	}
	return lineCount, scanner.Err()
}

func CountWords(file *os.File)(int, error){
	scanner := bufio.NewScanner(file)
	wordCount := 0
	for scanner.Scan(){
		words := strings.Fields(scanner.Text())
		wordCount += len(words)
	}
	return wordCount, scanner.Err()
}