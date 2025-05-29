## 🌀 Golang এর `defer`: ভিতরের স্ট্যাক, রিটার্ন ফাঁদ, এবং বাস্তব উদাহরণে ডুব

> "`defer` মানে হচ্ছে — তোমার কাজ হবে, কিন্তু পরে হবে।"

Go-এর `defer` হলো এমন একটা ফিচার যেটা clean code লেখার জন্য অনবদ্য, কিন্তু ভুল বুঝলে subtle bug এর উৎস। চলুন আজ `defer`-কে সম্পূর্ণভাবে বোঝার চেষ্টা করি — তার পেছনের স্টোরি সহ।

---

### 🔸 `defer` কি?

`defer` একটি কিওয়ার্ড যেটি কোন ফাংশনের শেষ মুহূর্তে অন্য একটি ফাংশনকে চালাতে বলে। মূলতঃ এটি ব্যবহৃত হয় cleanup কাজের জন্য — যেমন:

- `file.Close()`
- `unlock()`
- `recover()`
- লগিং

---

### 🎯 কীভাবে কাজ করে `defer`?

Go কম্পাইলার `defer` স্টেটমেন্টগুলোকে compile time এ detect করে এবং runtime এ একটি internal stack এ রেখে দেয়। যখন function return করে, তখন এই stack থেকে একে একে ফাংশনগুলো **পিছন থেকে সামনে (LIFO)** চালানো হয়।

```go
func main() {
    defer fmt.Println("A")
    defer fmt.Println("B")
    fmt.Println("C")
}
```

🖨️ Output:

```
C
B
A
```

📌 `defer` গুলো পিছনের দিকে যায় কারণ: Go stack এ `push` করে defer গুলোকে → পরে reverse করে `pop` করে।

---

### 🔧 পিছনের দিক থেকে ব্যাখ্যা (Behind-the-scenes)

```go
func sayHello() {
    defer log("1")
    defer log("2")
    defer log("3")
}
```

Go internally কিছুটা এরকম করে:

```go
deferStack := []func(){}
deferStack = append(deferStack, log("1"))
deferStack = append(deferStack, log("2"))
deferStack = append(deferStack, log("3"))

for i := len(deferStack)-1; i >= 0; i-- {
    deferStack[i]()
}
```

Go runtime defer গুলিকে একটি linked list structure-এ সংরক্ষণ করে, কিন্তু সেটা **Stack behavior** অনুযায়ী কাজ করে।

---

### 🎭 Named Return vs Unnamed Return — `defer` এর দুইরকম ব্যবহার

এই হলো `defer` এর “দুই মুখো” চরিত্র। 🤹‍♂️

#### ✅ Named Return Value ব্যবহার করলে:

```go
func example1() (result int) {
    defer func() {
        result = 99
    }()
    return 10
}
```

📌 এখানে `result` হল named return variable, তাই `defer` যখন চলে, তখন `result` এখনও accessible, এবং সেটাকে modify করা যায়।

🖨️ Output:

```
99
```

---

#### ❌ Unnamed Return Value ব্যবহার করলে:

```go
func example2() int {
    result := 10
    defer func() {
        result = 99
    }()
    return result
}
```

📌 এখানে `return result` বলার সাথে সাথে result এর ভ্যালু রিটার্ন buffer-এ কপি হয়ে যায় — তারপরে `defer` চালানো হয়, তাই এর কোনো প্রভাব পড়ে না।

🖨️ Output:

```
10
```

---

### 🧠 আরও কিছু মন ভোলানো Example

#### 🔄 `defer` with loop

```go
func loopDefer() {
    for i := 1; i <= 3; i++ {
        defer fmt.Println("Deferred:", i)
    }
}
```

🖨️ Output:

```
Deferred: 3
Deferred: 2
Deferred: 1
```

📌 প্রতিবার loop এ `defer` নতুন করে register হয়। তাই stack অনুযায়ী উল্টোভাবে execute হয়।

---

#### 📛 Variable Capture Trap (Closure)

```go
func closureDefer() {
    for i := 1; i <= 3; i++ {
        defer func() {
            fmt.Println("Deferred:", i)
        }()
    }
}
```

🖨️ Output:

```
Deferred: 4
Deferred: 4
Deferred: 4
```

😵‍💫 কেন?

কারণ closure-এ `i` capture হচ্ছে by reference — প্রতিবার একই i এর address!

👉 Fix:

```go
func fixedClosureDefer() {
    for i := 1; i <= 3; i++ {
        val := i
        defer func() {
            fmt.Println("Deferred:", val)
        }()
    }
}
```

🖨️ Output:

```
Deferred: 3
Deferred: 2
Deferred: 1
```

---

### 🛠️ Practical Use Cases

1. **File Handling**:

```go
func readFile(path string) error {
    f, err := os.Open(path)
    if err != nil {
        return err
    }
    defer f.Close()

    // read file...
    return nil
}
```

2. **Mutex Unlock**:

```go
mu.Lock()
defer mu.Unlock()
// critical section
```

3. **Recover from panic**:

```go
func safe() {
    defer func() {
        if r := recover(); r != nil {
            fmt.Println("Recovered:", r)
        }
    }()
    panic("something went wrong")
}
```

---

### 🧾 Key Takeaways (সংক্ষেপে)

| বৈশিষ্ট্য          | ব্যাখ্যা                                 |
| ------------------ | ---------------------------------------- |
| Execution order    | LIFO (Last In, First Out)                |
| Internal structure | Linked List with Stack behavior          |
| Named return       | `defer` can modify it                    |
| Unnamed return     | `defer` can’t modify it                  |
| Variable capture   | Closure captures by reference — careful! |
| Use cases          | File close, Mutex unlock, Panic recovery |

---

### 🎁 Bonus: Debug Suggestion

✅ If you're debugging `defer` issues:

- Use `go run -gcflags=all="-m"` to see escape analysis.
- Print log inside defer to see the order.
- Add named returns if defer needs to modify output.

---

### 🧠 শেষ কথা

Go-এর `defer` যত ছোট দেখতে, তত গভীর তার আচরণ। একে সঠিকভাবে বোঝা মানে হচ্ছে —

- Cleaner code
- Resource leak রোধ
- কম Bug

শুধু syntax জানলেই হবে না — এর ভিতরের Stack-মাথা, Return-trap, এবং Variable-capture খেলাও বোঝা জরুরি।