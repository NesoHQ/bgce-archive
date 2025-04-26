package main

import (
	"fmt"
	"os"
	"strconv"

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
	case "complete":
		if len(args) < 3{
			fmt.Println("Please provide a task ID.")
			return
		}
		id, err := strconv.Atoi(args[2])
		if err != nil {
			fmt.Println("Invalid task ID:", err)
			return
		}
		completed := task.CompleteTask(id)
		if completed {
			fmt.Println("Task completed successfully!")
		} else {
			fmt.Println("Task not found or already completed.")
		}
	case "delete":
		if len(args) < 3{
			fmt.Println("Please provide a task ID.")
			return
		}
		id, err := strconv.Atoi(args[2])
		if err != nil {
			fmt.Println("Invalid task ID:", err)
			return
		}
		deleted := task.DeleteTask(id)
		if !deleted {
			fmt.Println("Task not found or could not be deleted.")
			return
		}
		fmt.Println("Task deleted successfully!")

	default:
		fmt.Println("Unknown command. Available commands: add, list, complete, delete")
	}
	
}