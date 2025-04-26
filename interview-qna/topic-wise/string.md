[**Author:** @mdimamhosen
**Date:** 2025-04-19
**Category:** interview-qa/strings
**Tags:** [go, strings, operations]]

# GoLang Strings

This document provides an overview of string operations in GoLang with examples.

## Frequently Asked Questions

### 1. How do you concatenate strings in Go?

You can concatenate strings using the `+` operator.

```go
fmt.Println("Hello, " + "World!")
```

### 2. How do you find the length of a string in Go?

Use the `len` function to get the length of a string.

```go
message := "Hello World!"
fmt.Println("Length:", len(message))
```

### 3. How do you extract a substring in Go?

Use slice notation to extract substrings.

```go
message := "Hello World!"
fmt.Println("Substring:", message[0:5]) // "Hello"
```

### 4. How do you compare two strings in Go?

You can use `==` and `!=` operators or the `strings.Compare` function.

```go
msg1 := "one"
msg2 := "two"
fmt.Println("Equal?", msg1 == msg2)
fmt.Println("Not Equal?", msg1 != msg2)
fmt.Println(strings.Compare(msg1, msg2))
```

### 5. How do you check if a string contains a substring?

Use the `strings.Contains` function.

```go
message := "Hello World!"
fmt.Println(strings.Contains(message, "World")) // true
```

### 6. How do you convert a string to uppercase or lowercase?

Use `strings.ToUpper` and `strings.ToLower` functions.

```go
message := "Hello World!"
fmt.Println(strings.ToUpper(message)) // "HELLO WORLD!"
fmt.Println(strings.ToLower(message)) // "hello world!"
```

### 7. How do you split a string into substrings?

Use the `strings.Split` function.

```go
message := "Hello World!"
fmt.Println(strings.Split(message, " ")) // ["Hello", "World!"]
```

### 8. How do you replace a substring in a string?

Use the `strings.Replace` function.

```go
message := "Hello World!"
fmt.Println(strings.Replace(message, "World", "Go", 1)) // "Hello Go!"
```

### 9. How do you trim spaces from a string?

Use the `strings.TrimSpace` function.

```go
message := "  Hello World!  "
fmt.Println(strings.TrimSpace(message)) // "Hello World!"
```

### 10. How do you get the first character of a string?

Use indexing to access the first character.

```go
message := "Hello World!"
fmt.Printf("First character: %c\n", message[0])
```

## Basic String Operations

### Concatenation

You can concatenate strings using the `+` operator.

```go
fmt.Println("Hello, " + "World!")
```

### Formatting Strings

Go provides several ways to format strings using `fmt.Printf`.

```go
message := "Hello World!"
fmt.Printf("Data: %v\n", message)
fmt.Printf("Data: %+v\n", message)
fmt.Printf("Data: %#v\n", message)
fmt.Printf("Data: %T\n", message)
fmt.Printf("Data: %q\n", message)
fmt.Printf("First character: %c\n", message[0])
```

### String Length

You can get the length of a string using the `len` function.

```go
fmt.Println("Length:", len(message))
```

### Substrings

You can extract substrings using slice notation.

```go
fmt.Println("Substring:", message[0:5]) // this will print "Hello"
```

### String Comparison

You can compare strings using `==` and `!=` operators or the `strings.Compare` function.

```go
msg1 := "one"
msg2 := "two"

fmt.Println("Equal?", msg1 == msg2)
fmt.Println("Not Equal?", msg1 != msg2)
fmt.Println(strings.Compare(msg1, msg2))
```

## Additional String Functions

### Contains

Check if a string contains a substring.

```go
fmt.Println(strings.Contains(message, "World")) // true
```

### ToUpper and ToLower

Convert strings to upper or lower case.

```go
fmt.Println(strings.ToUpper(message)) // "HELLO WORLD!"
fmt.Println(strings.ToLower(message)) // "hello world!"
```

### Split

Split a string into a slice of substrings.

```go
fmt.Println(strings.Split(message, " ")) // ["Hello", "World!"]
```

### Replace

Replace occurrences of a substring.

```go
fmt.Println(strings.Replace(message, "World", "Go", 1)) // "Hello Go!"
```

### Trim

Trim leading and trailing spaces.

```go
fmt.Println(strings.TrimSpace("  Hello World!  ")) // "Hello World!"
```

Refer to the [Go documentation](https://golang.org/pkg/strings/) for more string functions and detailed usage.
