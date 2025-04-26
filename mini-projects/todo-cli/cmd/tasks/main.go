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

	default:
		fmt.Println("Unknown command. Available commands: add, list, complete, delete")
	}
	
}