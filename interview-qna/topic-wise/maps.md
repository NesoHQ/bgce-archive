[**Author:** @mdimamhosen
**Date:** 2025-04-19
**Category:** interview-qa/maps
**Tags:** [go, maps, data-structure]
]

# Maps

Maps are a data structure which allow us to store data values in key:value pairs.
A map is an unordered and changeable collection that does not allow duplicates.
The default value of a map is `nil`.

```go
userInfo := map[string]int{
    "huxn": 17,
    "alex": 18,
    "john": 27,
}

fmt.Println(userInfo)
userInfo["jordan"] = 15
fmt.Println(userInfo["huxn"])
fmt.Println(userInfo["alex"])
fmt.Println(userInfo["john"])
```

## Frequently Asked Questions

### 1. How do you create a map in Go?

**Answer:**
You can create a map using the `make` function or by using a map literal.

**Code Example:**

```go
// Using make function
userInfo := make(map[string]int)
userInfo["huxn"] = 17
userInfo["alex"] = 18
fmt.Println(userInfo)

// Using map literal
userInfo := map[string]int{
    "huxn": 17,
    "alex": 18,
}
fmt.Println(userInfo)
```

### 2. How do you check if a key exists in a map?

**Answer:**
You can use the second return value of a map lookup to check if a key exists.

**Code Example:**

```go
userInfo := map[string]int{
    "huxn": 17,
    "alex": 18,
}

value, exists := userInfo["huxn"]
if exists {
    fmt.Println("Key exists with value:", value)
} else {
    fmt.Println("Key does not exist")
}
```

### 3. How do you delete a key from a map?

**Answer:**
You can use the `delete` function to remove a key from a map.

**Code Example:**

```go
userInfo := map[string]int{
    "huxn": 17,
    "alex": 18,
}
delete(userInfo, "huxn")
fmt.Println(userInfo)
```

### 4. Can a map key be of any type?

**Answer:**
No, map keys must be of a type that is comparable (e.g., strings, integers, etc.).

**Code Example:**

```go
// Valid keys
userInfo := map[string]int{
    "huxn": 17,
    "alex": 18,
}

// Invalid keys (e.g., slices)
// userInfo := map[[]int]int{} // This will throw an error
```

### 5. How do you iterate over a map?

**Answer:**
You can use a `for` loop with the `range` keyword to iterate over a map.

**Code Example:**

```go
userInfo := map[string]int{
    "huxn": 17,
    "alex": 18,
}

for key, value := range userInfo {
    fmt.Printf("Key: %s, Value: %d\n", key, value)
}
```

### 6. What is the zero value of a map?

**Answer:**
The zero value of a map is `nil`.

**Code Example:**

```go
var userInfo map[string]int
fmt.Println(userInfo == nil) // true
```

### 7. Can you compare two maps in Go?

**Answer:**
No, maps cannot be compared directly. You need to compare them manually by iterating over their keys and values.

**Code Example:**

```go
map1 := map[string]int{"huxn": 17, "alex": 18}
map2 := map[string]int{"huxn": 17, "alex": 18}

// Direct comparison is not allowed
// fmt.Println(map1 == map2) // This will throw an error

// Manual comparison
areEqual := true
for key, value := range map1 {
    if map2[key] != value {
        areEqual = false
        break
    }
}
fmt.Println("Maps are equal:", areEqual)
```

### 8. How do you find the length of a map?

**Answer:**
You can use the `len` function to find the number of key-value pairs in a map.

**Code Example:**

```go
userInfo := map[string]int{
    "huxn": 17,
    "alex": 18,
}
fmt.Println("Length of map:", len(userInfo))
```

### 9. Can you nest maps in Go?

**Answer:**
Yes, you can create a map where the value is another map.

**Code Example:**

```go
nestedMap := map[string]map[string]int{
    "group1": {
        "huxn": 17,
        "alex": 18,
    },
    "group2": {
        "john": 27,
    },
}
fmt.Println(nestedMap)
```

### 10. How do you copy a map in Go?

**Answer:**
You need to manually copy the key-value pairs from one map to another.

**Code Example:**

```go
originalMap := map[string]int{
    "huxn": 17,
    "alex": 18,
}
copiedMap := make(map[string]int)

for key, value := range originalMap {
    copiedMap[key] = value
}
fmt.Println("Original Map:", originalMap)
fmt.Println("Copied Map:", copiedMap)
```
