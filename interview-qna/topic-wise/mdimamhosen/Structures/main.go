package main

import "fmt"

type Person struct {
	Name   string
	Age    int
	Job    string
	Salary float64
}

type Employee struct {
	Person
	isActive bool
}

func main() {
	var personOne Person

	personOne.Name = "John Doe"
	personOne.Age = 30
	personOne.Job = "Software Engineer"
	personOne.Salary = 1000.00

	fmt.Println(personOne)
	fmt.Println("Name:", personOne.Name)
	fmt.Println("Age:", personOne.Age)
	fmt.Println("Job:", personOne.Job)

	employeeOne := Employee{
		Person: Person{
			Name:   "John Doe",
			Age:    30,
			Job:    "Software Engineer",
			Salary: 1000.00,
		},
		isActive: true,
	}

	fmt.Println(employeeOne)
	fmt.Println("Name:", employeeOne.Name)
	fmt.Println("Age:", employeeOne.Age)
	fmt.Println("Job:", employeeOne.Job)
	fmt.Println("Active:", employeeOne.isActive)


	annonymousStruct := struct {
		Name string
		Age  int
	}{
		Name: "John Doe",
		Age:  30,
	}
	fmt.Println(annonymousStruct)
	fmt.Println("Name:", annonymousStruct.Name)
	fmt.Println("Age:", annonymousStruct.Age)
}
