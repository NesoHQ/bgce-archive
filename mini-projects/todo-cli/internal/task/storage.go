package task

import (
	"encoding/json"
	"os"
)

const filename = "tasks.json"

func SaveTasks()error{
	data, err := json.MarshalIndent(Tasks,"", " ")
	if err != nil {
        return err
    }
	return os.WriteFile(filename, data, 0644)
}

func LoadTasks()error{
	file, err := os.Open(filename)
	if err != nil{
		if os.IsNotExist(err){
			Tasks = []Task{}
			return nil
		}
		return err
	}
	defer file.Close()

	decoder := json.NewDecoder(file)
	err = decoder.Decode(&Tasks)
	if err != nil {
		return err
	}
	return nil
}