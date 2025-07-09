# Class 42 : ✨ Complex And Beautiful Go Routine

## 🌀 Goroutine

- **Lightweight thread** / **Virtual thread**
- **Logically thread** এর মতো কাজ করে
- Concurrently অনেকগুলো function execute করে
- **Go Runtime** একে manage করে

## 🛠️ Creating a Goroutine

কোনো function এর আগে `go` keyword লিখে দিলে সেটা _goroutine_ হয়।

### 💡 Example

```go
package main

import (
    "fmt"
    "time"
    )

var a = 10

const p = 11

func printHello(num int) {
	fmt.Println("Hello Habib", num)
}

func main() {
	go printHello(1)

	go printHello(2)

	go printHello(3)

	go printHello(4)

	go printHello(5)

	fmt.Println(a, " ", p)

	time.Sleep(5 * time.Second)
}
```

এই Go কোডে একটা `printHello` নামের ফাংশন আছে, যেটা `"Hello Habib"` লিখে সাথে একটা সংখ্যা প্রিন্ট করে।

`main()` ফাংশনে এই ফাংশনটা ৫ বার _goroutine_ দিয়ে চালানো হয়েছে

সবগুলা _goroutine_ যেন কাজ শেষ করতে পারে, তাই শেষে `time.Sleep(5 * time.Second)` দিয়ে ৫ সেকেন্ড প্রোগ্রামটাকে অপেক্ষা করানো হয়েছে।

## 📦 How gorouitne works Internally

**Goroutine** কীভাবে কাজ করে বুঝার জন্য আমাদের একটি Go program এর _compilation_, _execution phase_ এবং _Thread_ ভালভাবে বুঝতে হবে।

### 🔧 Compilation Phase of Go Program

Go program কে compile করার জন্য নিচের command টি ব্যবহার করা হয়

```go
go build main.go
```

- এতে একটি binary executable file তৈরি হবে (_Linux_ এ `main`, _Windows_ এ `main.exe`)
- Binary executable file → Code Segment
- Code Segment → `const` (read only)
  → **functions**
- `main` binary executable file store → **HDD**

```plaintext
                        **Code Segment**

			p = 11
			printHello = printHello() {...}
			main = main() {...}

```

### 🚀 Execution Phase of Go Program

Binary executable file run করার জন্য command -

```bash
./main
```

- Binary executable file load → RAM
- RAM Memory Layout → Code Segment, Data Segment, Stack, Heap
- `main` program → Process create হয়

| Segment      | Purpose                                   | Size / Behavior                   |
| ------------ | ----------------------------------------- | --------------------------------- |
| Code Segment | compiled machine code (functions)         | Fixed size                        |
| Data Segment | global & static variables                 | Fixed or small                    |
| Heap         | dynamically allocated data (`make`, etc.) | Grows **upward**                  |
| Stack        | function call info, local vars            | Grows **downward**, \~8MB (Linux) |

> যে কোনও programming language (যেমন C, C++, Go, Rust) এর প্রোগ্রাম যখন compile হয়ে binary (.exe / .out) তে convert হয় এবং execution শুরু হয়, তখন একটা process তৈরি হয় এবং সেই process এর জন্য memory তে _Code Segment, Data Segment, Stack, Heap_ থাকে।

### 🔍 RAM Memory Layout Visualization

```plaintext
┌──────────────────────────┐
│       Heap               │ ← Grows Upward
├──────────────────────────┤
│     Stack (Top ↓)        │ ← Grows Downward
├──────────────────────────┤
│     Data Segment         │ ← Initialized global/static variables
├──────────────────────────┤
│     Code Segment         │ ← Machine Instructions
└──────────────────────────┘
```

### ⚙️ Program Execution Process Visualization

```plaintext

HDD ➜ OS Loader ➜ RAM ➜ CPU Executes

📁 HDD (Hard Disk)
│
│  → Executable File (.exe, .out, etc.)
│
▼
📥 Loader (Operating System)
│
│  → Loads program into RAM
│
▼
🧠 RAM (Main Memory)
│
├── 📄 Code Segment        → compiled machine code (instructions)
│
├── 🗃️ Data Segment        → global & static variables
│
├── 📦 Heap Segment        → dynamic memory (malloc/new)
│
├── 📚 Stack Segment       → function calls, local variables
│
▼
⚡ CPU (Processor)
   ├── Fetch → Decode → Execute instructions
   ├── Uses Registers (like AL, BL, etc.)
   └── Uses Stack Pointer (SP), Base Pointer (BP)
```

### 🖥️ Process & Thread

- Process initially একটি Thread থাকে → Deafult Thread / Main Thread
- Thread কে OS এর kernel execute করলে → Stack execute হয়
- Stack execute → Stack frame create & execute হয়

### 🌀 Go Runtime = A Mini OS or Virtual Operating System

Go program → Run → `main` binary load → Code Segment

> ⚙️ **`main` Binary – More Than Just Code Segment**
>
> - শুধু code segment নয়
> - আরও অনেক binary থাকে
> - code segment শুধু একটা অংশ মাত্র

- Thread execute → Process start
- Process → Virtual computer
- Go Runtime → Virtual Operating System
- Process start → Go Runtime execute

#### 🧩 Go Runtime Code Execute

- Stack → 8MB Stack (main stack) → Stack Frame create
- main thread execute করে → Go runtime

Go Runtime initialize করে -

- **1. Go Routine Scheduler**
- **2. Heap Allocator**
- **3. Garbage Collector**
- **4. Logical Processors**

#### Go Routine Scheduler

_OS Kernel scheduler_ → Process schedule, Concurrency, Parallelism handle করে।

_Go Routine Scheduler_ ও Real OS Kernel Scheduler এর মতো কাজ করে।

#### Logical Processors

> 🔁 _Recap_
>
> - [CPU কীভাবে Code execute করে](https://nesohq.github.io/bgce-archive/interview-qna/class-wise/golang034-breaking-the-cpu-and-process/index.html)

- OS এর ভিতর → virtual processors (vCPU) create হয়
- CPU তে যে কয়টি vCPU (virtual CPU / logical Processor) থাকে → Go Runtime সে কয়টি logical processor create করে
- প্রতিটি logical processor এর জন্য → OS আলাদা OS Thread create করে
  - CPU 2 core → 4 vCPU
  - Go Runtime initilize করে → 4 logical processors
  - 4 logical processors এর জন্য → OS আলাদা 4 OS Thread create করে
  - 4 OS Thread → 4 stack
  - Total threads in process → 4 (OS thread) + 1 (main thread) → 5 threads
  - OS kernel → 5 threads কে track করে
  - 1 main thread এর জন্য → 1 main stack
  - 4 supporting thread এর জন্য → 4 supporting stack
- go runtime kernel → go routine schedule করে
  - 4 thread → 10 goroutine execute করে concurrency follow করে

### 🧠 Go Runtime: OS Thread, Scheduler, and Logical Processor Mapping

```plaintext
                    🌀 Go Runtime Scheduler
                             │
                             ▼
──────────────────────────────────────────────────────
|                   Logical Processors (P)           |
|────────────────────────────────────────────────────|
|      P1               P2              P3           |
|        										     |
|   [G1, G4, G6]     [G2, G5]        [G3, G7, G8]    |
──────────────────────────────────────────────────────
      │               │              │
      ▼               ▼              ▼
  Assigned to     Assigned to    Assigned to
      │               │              │
      ▼               ▼              ▼
─────────────────────────────────────────────
|             OS Threads (M)                 |
|─────────────────────────────────────────── |
|     M1             M2             M3       |
|   (running)     (running)      (idle)      |
─────────────────────────────────────────────
      │               │
      ▼               ▼
   🖥️ CPU Core 1     🖥️ CPU Core 2

```

> Go runtime, OS Thread কীভাবে create করতে হয় সেটি handle করে।

> Go runtime শুরুতেই সিস্টেমের vCPU (logical core) অনুযায়ী Logical Processor (P) তৈরি করে।

- Go Runtime নিজেই একটি kernel এর মতো কাজ করে
- এই "kernel" এর scheduler থাকে
- Scheduler, Goroutine গুলোকে execute করতে OS thread কে কাজ ভাগ করে দেয়
- OS Thread গুলোই CPU তে বসে goroutine গুলো execute করে
- Go Scheduler ঠিক করে কোন goroutine কখন execute হবে
- Scheduler OS thread এ map করে thousands of goroutine efficiently চালায়

### 🖥️ Go Runtime Kernel & Goroutine Scheduling

```plaintext
                       🌀 Go Runtime (Mini Kernel)
                               │
                               ▼
                      🧠 Go Routine Scheduler (Scheduler)
                               │
      -----------------------------------------------------
      |                       |                           |
      ▼                       ▼                           ▼
  G1: Goroutine         G2: Goroutine               G3: Goroutine
 (Task 1)                 (Task 2)                     (Task 3)
      \_______________________|________________________/
                               │
                               ▼
                    📦 Placed into P's Run Queue
                               │
                               ▼
        🔄 Scheduler decides which G to run on which M
                               │
      -----------------------------------------------------
      |                       |                          |
      ▼                       ▼                          ▼
   🧵 M1: OS Thread        🧵 M2: OS Thread           🧵 M3: OS Thread
 (Executes Gs)          (Executes Gs)              (Executes Gs)
      |                       |                          |
      ▼                       ▼                          ▼
   🖥️ CPU Core 1          🖥️ CPU Core 2             🖥️ CPU Core 3


   → G (goroutine)
   → P (Processor)
   → M (OS Thread)

```

> Programmer Goroutine create করে।

#### 📈🧵 Effects of Excessive Goroutines in Go

- Scheduler notice করে → excessive gorutines
- Go Runtime → প্রয়োজন অনুযায়ী logical processors & OS Thread create করে
- RAM full → OS Thread create করা possible হয় না
- ❌ OS Thread → ❌ Goroutine execution

> First যে goroutine run হয় → main goroutine

> main function execute হয় → main goroutine এ

## 🏠 Goroutine's Home: Stack & Heap

Goroutine - mini thread / virtual thread / logical thread

প্রতিটি goroutine

- এর **stack থাকে heap** memory এ
- শুরুতে মাত্র **2KB stack** পায়

### `main()` → Main Goroutine

- Go প্রোগ্রাম রান হলেই `main()` function চালু হয়
- এটিই প্রথম goroutine - যাকে বলে **Main Goroutine**
- সব normal function call (যেমন `f()`, `g()`) এর stack frame তৈরি হয় এই একই stack এ

### `go functionName()` → New Goroutine

`go functionName()` লিখলে তখন Go runtime:

- নতুন goroutine তৈরি করে
- সেটার জন্য আলাদা stack তৈরি করে (initially 2KB)
- এটিকে scheduling queue তে দেয়

#### 🖼️ Example

```go
var a = 10

const p = 11

func add(a, b int) {
  fmt.Println(a + b)
}

func printHello(num int) {
	fmt.Println("Hello Habib", num)

     add(2, 4)
}

func main() {
    var x int = 10

    fmt.Println("Hello", x)

    printHello(10)

    go printHello(1)

    go printHello(2)

    go printHello(3)

    go printHello(4)

    go printHello(5)

    fmt.Println(a, " ", p)

    time.Sleep(5 * time.Second)
}
```

**Main Goroutine**

- এখানে `main()` এর জন্য _main goroutine_ create হবে
- main goroutine এ `main()`, `printHello(10)` এবং `fmt.Println()` এর জন্য Stack Frame create হবে
- যদি Go program এ `init()` থাকে তবে `init()` এর জন্য ও Stack Frame, _main goroutine_ এ create হবে

**Other Goroutines**

- `printHello()` এর জন্য Go runtime ৫টি আলাদা goroutine তৈরি করবে
- `go printHello(1)` এর জন্য Heap এ যে goroutine create হয় সেখানে `printHello(1)`, `fmt.Println()` এবং `add(2, 4)` এর জন্য Stack Frame create হবে
- একই ভাবে অন্য goroutine এর জন্যও Stack Frame create হবে

**🔍 যদি 2KB Stack যথেষ্ট না হয়**

- ➡️ Go runtime automatically stack এর size বড় করে দেয় (dynamic grow করে)

**📈 কিভাবে কাজ করে?**

- _শুরুতে:_ **2KB**
- _দরকার হলে:_ **4KB**, **8KB**, **16KB**... → যত দরকার তত বাড়তে পারে
- _সর্বোচ্চ_: **1 GB** পর্যন্ত

> Go runtime পুরা stack copy করে নতুন বড় stack এ নিয়ে যায়, old stack ফেলে দেয়।

> Go Runtime reallocate করতে পারে।

Heap এর Stack এ যে [SP, BP](https://nesohq.github.io/bgce-archive/interview-qna/class-wise/golang035-BP-SP/index.html) থাকে তা মূলত **Go Runtime এর initialized logical processor** এর SP, BP, return address etc.

```

                    🧵 Goroutines & Their Stack Memory

┌──────────────────────────────┬─────────────────────────────┬─────────────────────────────┐
│ Goroutine 1 (main)           │ Goroutine 2 (printHello 1)  │ Goroutine 3 (printHello 2)  │
├──────────────────────────────┼─────────────────────────────┼─────────────────────────────┤
│ Stack:                       │ Stack:                      │ Stack:                      │
│ - main()                     │ - printHello(1)             │ - printHello(2)             │
│ - printHello(10)             │ - fmt.Println()             │ - fmt.Println()             │
│ - fmt.Println()              │ - add(2, 4)                 │ - add(2, 4)                 │
└──────────────────────────────┴─────────────────────────────┴─────────────────────────────┘

┌─────────────────────────────┬─────────────────────────────┬──────────────────────────────┐
│ Goroutine 4 (printHello 3)  │ Goroutine 5 (printHello 4)  │ Goroutine 6 (printHello 5)   │
├─────────────────────────────┼─────────────────────────────┼──────────────────────────────┤
│ Stack:                      │ Stack:                      │ Stack:                       │
│ - printHello(3)             │ - printHello(4)             │ - printHello(5)              │
│ - fmt.Println()             │ - fmt.Println()             │ - fmt.Println()              │
│ - add(2, 4)                 │ - add(2, 4)                 │ - add(2, 4)                  │
└─────────────────────────────┴─────────────────────────────┴──────────────────────────────┘

```

> Main goroutine শেষ হলেই পুরো program শেষ,
> তাই অন্য goroutine চালাতে চাইলে main goroutine কে কিছু সময় বাঁচিয়ে রাখতে হবে ✅

**💥 When & How _Main Thread_, _Go Runtime_ & _Main Goroutine_ Get Destroyed**

> main thread ≠ main goroutine

| Component            | Destruction Point                      |
| -------------------- | -------------------------------------- |
| **Main Goroutine**   | Ends when `main()` returns or panics   |
| **Main Thread**      | Exits after main goroutine ends        |
| **Go Runtime**       | Terminates when main goroutine ends    |
| **Other Goroutines** | Force-killed when main goroutine exits |

> goroutine গুলো শেষ পর্যন্ত execute করার জন্য `main()` কে block করে রাখা যায় যেমন:
>
> - `time.Sleep()`
> - `sync.WaitGroup`
> - `select {}` (infinite block)

## 🧵 Thread vs Goroutine

| Feature               | **Thread**                  | **Goroutine**                                |
| --------------------- | --------------------------- | -------------------------------------------- |
| **Definition**        | OS-level execution unit     | Go’s lightweight concurrent execution unit   |
| **Created By**        | Operating System            | Go Runtime Scheduler                         |
| **Memory Usage**      | \~1 MB stack (fixed)        | Starts with \~2 KB stack (grows dynamically) |
| **Creation Cost**     | High (involves system call) | Very Low (simple runtime function)           |
| **Scheduling**        | Done by OS                  | Done by Go runtime (user-space scheduler)    |
| **Communication**     | Using shared memory, locks  | Using channels (safe and built-in)           |
| **Concurrency Limit** | Limited (few thousand max)  | Huge (millions possible)                     |
| **Blocking**          | Blocks entire thread        | Blocking one goroutine doesn’t block others  |
| **Context Switching** | Costly (kernel-level)       | Cheap (user-space context switch)            |
| **Portability**       | Depends on OS               | Cross-platform (managed by Go)               |

[**Author:** @nazma98
**Date:** 2025-06-24
**Category:** interview-qa/class-wise
]
