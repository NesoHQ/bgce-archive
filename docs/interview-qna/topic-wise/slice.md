[**Author:** @mdimamhosen, @mahabubulhasibshawon
**Date:** 2025-04-19
**Category:** interview-qa/slices
**Tags:** [go, slices, arrays, make]
]

# Slices

Slices একই ধরনের একাধিক মান একটি ভেরিয়েবলেই সংরক্ষণ করতে ব্যবহৃত হয়, তবে arrays-এর মতো নির্দিষ্ট দৈর্ঘ্যের নয়। Slice-এর দৈর্ঘ্য আপনি চাইলে বড় বা ছোট করতে পারেন।

Slices তৈরি করার কয়েকটি উপায় 👇

1. `[]datatype{values}` ফরম্যাট ব্যবহার করে
2. একটি array থেকে slice তৈরি করে
3. `make()` ফাংশন ব্যবহার করে

```go
// name := []datatype{values}
// name := []int{}
package main
import ("fmt")

func main() {
  myslice1 := []int{}
  fmt.Println(len(myslice1))
  fmt.Println(cap(myslice1))
  fmt.Println(myslice1)

  myslice2 := []string{"Go", "Slices", "Are", "Powerful"}
  fmt.Println(len(myslice2))
  fmt.Println(cap(myslice2))
  fmt.Println(myslice2)
}
```

---

## Make() Method

`make` ফাংশন একটি শূন্য (zeroed) array তৈরি করে এবং তার একটি slice রিটার্ন করে। এটি একটি ডাইনামিক সাইজের slice তৈরি করার ভালো উপায়। `make` ব্যবহার করতে হলে তিনটি প্যারামিটার দিতে হয়: টাইপ, দৈর্ঘ্য এবং ক্যাপাসিটি।

```go
package main
import "fmt"

func main() {
    slice := make([]string, 3, 5)
    fmt.Println("Length", len(slice))
    fmt.Println("Capacity", cap(slice))
    fmt.Println(slice)
}
```

## Frequently Asked Questions

### ১. Go-তে কীভাবে একটি খালি slice তৈরি করবেন?

**উত্তর:** `[]datatype{}` ব্যবহার করে একটি খালি slice তৈরি করতে পারেন।

```go
package main
import "fmt"

func main() {
    myslice := []int{}
    fmt.Println("Empty Slice:", myslice) // []
}
```

---

### ২. কীভাবে প্রাথমিক মান সহ একটি slice তৈরি করবেন?

**উত্তর:** `[]datatype{values}` ব্যবহার করুন।

```go
package main
import "fmt"

func main() {
    myslice := []int{1, 2, 3}
    fmt.Println("Slice with Values:", myslice) // [1 2 3]
}
```

---

### ৩. কীভাবে একটি array থেকে slice তৈরি করবেন?

**উত্তর:** slicing সিনট্যাক্স `array[start:end]` ব্যবহার করুন।

```go
package main
import "fmt"

func main() {
    arr := [5]int{1, 2, 3, 4, 5}
    myslice := arr[1:4]
    fmt.Println("Slice from Array:", myslice) // [2 3 4]
}
```

---

### ৪. `make` ফাংশন ব্যবহার করে কীভাবে slice তৈরি করবেন?

**উত্তর:** `make(type, length, capacity)` ব্যবহার করুন।

```go
package main
import "fmt"

func main() {
    myslice := make([]int, 3, 5)
    fmt.Println("Slice with Make:", myslice) // [0 0 0]
}
```

---

### ৫. কীভাবে slice-এ নতুন উপাদান যোগ করবেন?

**উত্তর:** `append` ফাংশন ব্যবহার করুন।

```go
package main
import "fmt"

func main() {
    myslice := []int{1, 2, 3}
    myslice = append(myslice, 4, 5)
    fmt.Println("Appended Slice:", myslice) // [1 2 3 4 5]
}
```

---

### ৬. কীভাবে একটি slice কপি করবেন অন্যটিতে?

**উত্তর:** `copy` ফাংশন ব্যবহার করুন।

```go
package main
import "fmt"

func main() {
    src := []int{1, 2, 3}
    dest := make([]int, len(src))
    copy(dest, src)
    fmt.Println("Copied Slice:", dest) // [1 2 3]
}
```

---

### ৭. slice-এর দৈর্ঘ্য ও ক্যাপাসিটি কীভাবে জানবেন?

**উত্তর:** `len(slice)` এবং `cap(slice)` ব্যবহার করুন।

```go
package main
import "fmt"

func main() {
    myslice := []int{1, 2, 3}
    fmt.Println("Length:", len(myslice)) // 3
    fmt.Println("Capacity:", cap(myslice)) // 3
}
```

---

### ৮. কীভাবে একটি মাল্টিডাইমেনশনাল slice তৈরি করবেন?

**উত্তর:** slice-এর ভিতরে slice ব্যবহার করে।

```go
package main
import "fmt"

func main() {
    matrix := [][]int{
        {1, 2, 3},
        {4, 5, 6},
        {7, 8, 9},
    }
    fmt.Println("Multidimensional Slice:", matrix)
}
```

---

### ৯. slice থেকে একটি উপাদান কীভাবে সরাবেন?

**উত্তর:** slicing এবং `append` ব্যবহার করে।

```go
package main
import "fmt"

func main() {
    myslice := []int{1, 2, 3, 4, 5}
    myslice = append(myslice[:2], myslice[3:]...)
    fmt.Println("Slice after Removal:", myslice) // [1 2 4 5]
}
```

---

### ১০. Go-তে কীভাবে slice-এর উপর লুপ চালাবেন?

**উত্তর:** `for` লুপ বা `range` ব্যবহার করুন।

```go
package main
import "fmt"

func main() {
    myslice := []int{1, 2, 3}
    for i, v := range myslice {
        fmt.Printf("Index: %d, Value: %d\n", i, v)
    }
}
```

---

## ⚡ Array বনাম Slice

| ফিচার          | Array                             | Slice                                             |
| -------------- | --------------------------------- | ------------------------------------------------- |
| সাইজ           | নির্দিষ্ট                         | ডাইনামিক (বাড়তে/কমতে পারে)                       |
| টাইপ           | Value type                        | Reference type                                    |
| মেমোরি         | অ্যাসাইন করলে পুরো ডেটা কপি হয়   | কেবল রেফারেন্স কপি হয় (shallow copy)             |
| তৈরি           | `var a [5]int`                    | `var s []int` বা array থেকে slice                 |
| সাধারণ ব্যবহার | খুব কম (low-level memory control) | খুবই সাধারণ                                       |
| পারফরম্যান্স   | কোনো অতিরিক্ত খরচ নেই             | ডাইনামিক গ্রোথের কারণে সামান্য ওভারহেড থাকতে পারে |

---
