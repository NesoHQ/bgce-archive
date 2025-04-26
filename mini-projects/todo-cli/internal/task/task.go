package task

import "time"

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
// func CompleteTask(id int)bool{}
// func DeleteTask(id int)bool{}