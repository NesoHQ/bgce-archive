package task

import (
	"slices"
	"time"
)

type Task struct{
	ID int
	Description string
	CreatedAt time.Time
	Done bool
}

var Tasks []Task

func AddTask(description string)error{
	err := LoadTasks()
	if err != nil {
		return err
	}
	id := len(Tasks) + 1
	task := Task{
		ID : id,
		Description: description,
		CreatedAt: time.Now(),
		Done: false,
	}
	Tasks = append(Tasks, task)
	return SaveTasks()
}
func ListTasks(all bool)[]Task{
	err := LoadTasks()
    if err != nil {
        return nil
    }
	if all{
		return Tasks
	}
	var incompleteTasks []Task
	for _, task := range Tasks{
		if !task.Done{
			incompleteTasks = append(incompleteTasks, task)
		}
	}
	return incompleteTasks
}
func CompleteTask(id int) bool {
    err := LoadTasks()
    if err != nil {
        return false
    }

    for i, task := range Tasks {
        if task.ID == id {
            if Tasks[i].Done {
                return false 
            }
            Tasks[i].Done = true
            err = SaveTasks()
            if err != nil {
                return false
            }
            return true 
        }
    }
    return false 
}
func DeleteTask(id int)bool{
	err := LoadTasks()
	if err != nil {
		return false
	}
	for i, task := range Tasks{
		if task.ID == id{
			Tasks = slices.Delete(Tasks, i, i+1)
			err = SaveTasks()
			if err != nil {
				return false
			}
			return true
		}
	}
	return false
}