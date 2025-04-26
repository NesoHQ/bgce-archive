package main

import (
	"fmt"
	"os"

	"github.com/OxRokib/todo-cli/internal/task"
)

func main() {

	args := os.Args

	if len(args) < 2{
		fmt.Println("Please provide a command: add, list, complete, delete")
        return
	}
	command := args[1]

	switch command{
	case "add":
		if len(args) < 3{
			fmt.Println("Please provide a task description.")
            return
		}
		description := args[2]
		err := task.AddTask(description)
		if err != nil {
			fmt.Println("Error adding task:", err)
			return
		}
		fmt.Println("Task added successfully!")
	
	case "list":
		all := false
		if len(args) > 2 && args[2] == "--all"{
			all = true
		}
		tasks := task.ListTasks(all)
		if len(tasks) == 0 {
			fmt.Println("No tasks found.")
			return
		}
		for _, task := range tasks {
			fmt.Printf("ID: %d, Description: %s, Created At: %s, Done: %t\n", task.ID, task.Description, task.CreatedAt.Format("2006-01-02 15:04:05"), task.Done)
		}

	default:
		fmt.Println("Unknown command. Available commands: add, list, complete, delete")
	}
	
}