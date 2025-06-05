# 💐 Class 39 - Vogus Data Types

## 🔢 Signed Integer Type

Golang এ `int8`, `int16`, `int32`, এবং `int64` হল signed integer types যাদের specific bit size থাকে। নিচে এ সম্পর্কে বিস্তারিত দেওয়া হল:

| Type    | Size                 | Range                                                       |
| ------- | -------------------- | ----------------------------------------------------------- |
| `int8`  | `8 bit` / `1 byte`   | `-128` to `127`                                             |
| `int16` | `16 bit` / `2 bytes` | `-32,768` to `32,767`                                       |
| `int32` | `32 bit` / `4 bytes` | `-2,147,483,648` to `2,147,483,647`                         |
| `int64` | `64 bit` / `8 bytes` | `-9,223,372,036,854,775,808` to `9,223,372,036,854,775,807` |

> **Go Runtime** handles how to store each type of variable

### **🧠 int type কী?**

Golang এ `int` টাইপের কোন নির্দিষ্ট সাইজ নেই। এটি Computer architecture এর উপর নির্ভর করে:

32-bit computer → int = 32 bit

64-bit computer → int = 64 bit

### 🌷 Example

```go
package main

import "fmt"

func main() {
    var a int8 = 5

    fmt.Println(a)
}
```

### 🖼️ Visualization of storing `int8` in 32-bit computer

**Decimal to Binary (8-bit signed)**:

5 in binary = `00000101` (as `int8`)

#### 🧮 32-bit Memory Cell Visualization for `int8 a = 5`

| Bits       | 31 ... 8 (Unused/Padding)  | 7   | 6   | 5   | 4   | 3   | 2   | 1   | 0   |
| ---------- | -------------------------- | --- | --- | --- | --- | --- | --- | --- | --- |
| Bit Values | 00000000 00000000 00000000 | 0   | 0   | 0   | 0   | 0   | 1   | 0   | 1   |

### 📌 Tips:

- Memory save → `int8`, `int16`
- Performance / Process easy → `int` বা `int32`
- সব সময় Range এর মধ্যে data থাকবে কিনা তা আগে ভাবুন।

---

## 📦 Unsigned Integer Type

Golang এ unsigned int - `uint` টাইপ হলো এমন সংখ্যা যা কখনোই ঋণাত্মক (negative) হতে পারে না।

- 👉 শুধুমাত্র ধনাত্মক সংখ্যা (positive) বা শূন্য (0) নিতে পারে।

| Type     | Size                 | Range                               |
| -------- | -------------------- | ----------------------------------- |
| `uint8`  | `8 bit` / `1 byte`   | `0` to `255`                        |
| `uint16` | `16 bit` / `2 bytes` | `0` to `65,535`                     |
| `uint32` | `32 bit` / `4 bytes` | `0` to `4,294,967,295`              |
| `uint64` | `64 bit` / `8 bytes` | `0` to `18,446,744,073,709,551,615` |

### 🧪 Example

```go
package main

import "fmt"

func main() {
    var age uint8 = 25
    fmt.Println(age)
}
```

### **🧠 uint type**

Golang এ `uint` টাইপের কোন নির্দিষ্ট সাইজ নেই। এটি Computer architecture এর উপর নির্ভর করে:

32-bit computer → uint = 32 bit

64-bit computer → uint = 64 bit

## 🔢 Float Type

দশমিক সংখ্যা (fractional numbers) রাখার জন্য `float` টাইপ ব্যবহার করা হয়। যেমনঃ `3.14`, `-2.75`, `0.001`।

### 🧪 Golang এ Float দুই types:

| type      | size   | Precision                          |
| --------- | ------ | ---------------------------------- |
| `float32` | 32-bit | প্রায় ৭ দশমিক ঘর পর্যন্ত সঠিক     |
| `float64` | 64-bit | প্রায় ১৫-১৭ দশমিক ঘর পর্যন্ত সঠিক |

> শুধু float নামে কোনো type নেই।

### 🧪 Example

```go
package main

import "fmt"

func main() {
    var x float32 = 3.1415
    var y float64 = 2.7182818284

    fmt.Println("x =", x)
    fmt.Println("y =", y)
}

```

> 📌 Note: Golang এ দশমিক সংখ্যা লিখলে সেটা default `float64` হয়।

```go
f := 1.5 // float64
```

## 🔢 Boolean Type

Boolean টাইপ `bool` শুধু দুইটি value রাখতে পারে:

- `true`
- `false`

### 🌸 Example

```go
package main

import "fmt"

func main() {
    var isActive bool = true

    fmt.Println("isActive:", isActive)
}
```

> `bool` type memory তে সঠিকভাবে 1 bit নয়, বরং 1 byte (8 bits) জায়গা নেয়।

## ✳️ Byte Type

- alias for `uint8`
- 8 bits per character

```go
package main

import "fmt"

func main() {
    var a byte = 65
    fmt.Println(a)           // Output: 65
    fmt.Println(string(a))   // Output: A
}
```

#### 🔎 Note:

- `byte` শুধু `0` থেকে `255` পর্যন্ত value রাখতে পারে।
- character encoding এর সাথে কাজ করতে গেলে byte খুবই দরকারি।

## 🧮 Rune

- alias for `int32` (unicode point) - `32 bits` / `4 bytes`
- Unicode character রাখে

### 🌻 Example

```go
package main

import "fmt"

func main() {
    r := '❤'
    fmt.Printf("%c\n", r) // Output: ❤
}
```

## 🔢 Format Specifiers Table

| Format | Type   | Description                       | Example               |
| ------ | ------ | --------------------------------- | --------------------- |
| `%d`   | int    | Decimal integer                   | `42`                  |
| `%f`   | float  | Decimal float (default precision) | `3.14`                |
| `%.2f` | float  | Float with 2 decimal points       | `3.14`                |
| `%s`   | string | String                            | `"Hello"`             |
| `%t`   | bool   | true/false                        | `true`                |
| `%c`   | rune   | Character (Unicode)               | `🙂`                  |
| `%U`   | rune   | Unicode format                    | `U+1F642`             |
| `%v`   | any    | Default value (auto detect)       | `true`, `42`, etc.    |
| `%T`   | any    | Type of the variable              | `int`, `string`, etc. |

### 🌻 Example

```go
package main

import "fmt"

func main() {
	var a int8 = -128

	var x uint8 = 255

	var j float32 = 10.23343
	var k float64 = 10.4455235

	var flag bool = true

	var s string = "The sky is beautiful"

	r := '❤'

	fmt.Printf("%c\n", r) // Output: ❤
	fmt.Printf("%d\n", a) // Output: -128
    fmt.Printf("%d\n", x) // Output: 255
	fmt.Printf("%.2f\n", j) // Output: 10.23
    fmt.Printf("%.5f\n", k) // Output: 10.44552
	fmt.Printf("%v\n", flag) // Output: true
	fmt.Printf("%s\n", s) // Output: The sky is beautiful

	fmt.Printf("** Type of variable s = %T", s) // Output: string
}
```

[**Author:** @nazma98
**Date:** 2025-06-05
**Category:** interview-qa/class-wise
]
