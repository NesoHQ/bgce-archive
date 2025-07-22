# Class 46 : 🐹 Go Runtime

## 🧠 Guide to RAM: Kernel Space vs User Space

কম্পিউটার চালু হলে RAM (Random Access Memory) কে দুইটা ভাগে ভাগ করা হয়:

-   🛡️ **Kernel Space**
-   👨‍💻 **User Space**

## 🛡️ Kernel Space:

এটা Operating System (OS) এর নিজের জন্য allocated space

এখানে থাকে:

-   OS এর মূল কোড (kernel code)
-   kernel data structures
-   page table (memory mapping এর জন্য)

> Kernel সব কিছু access করতে পারে।

### 🔐 Why it's protected?

-   যাতে user program গুলো kernel এর sensitive অংশে ভুল করে বা ইচ্ছা করে access করতে না পারে।
-   Security আর stability এর জন্য।

### 🧩 Access from user programs

-   User program যদি OS এর help চায়, তখন system call ব্যবহার করে (যেমন `read()`, `write()`, `open()`).
-   তখন একটা software interrupt (যেমন `0x80`) তৈরি হয়।
-   এতে CPU _user mode_ থেকে _kernel mode_ এ যায়, kernel কাজটা করে দিয়ে আবার ফিরে আসে।

### 🧵 Kernel Stack

-   যখন kernel কাজ করে, তখন একটা kernel stack ব্যবহার করে।
-   এটা সব process মিলে share করে।

## 👨‍💻 User Space:

RAM এর এই space → user application (যেমন browser, notepad) এর জন্য।

প্রতিটা process তার নিজের একটা _virtual memory_ পায়।

এর মধ্যে থাকে:

-   **Code:** প্রোগ্রামের instruction
-   **Data:** global বা static variables
-   **Heap:** dynamic memory allocation (যেমন `malloc`)
-   **Stack:** function call আর local variables

> ⚠️ এই space থেকে kernel space সরাসরি access করা যায় না।

## 🧩 System Call

-   System Call হলো একধরনের function call
-   এর মাধ্যমে কোন user program, Operating System এর kernel থেকে কোন service চায়
-   System Call এর সাহায্য user mode থেকে kernel mode এ সুইচ করে OS এর বিশেষ কাজগুলো করার অনুমতি দেয়

### ⚙️ User Mode vs Kernel Mode

-   সাধারণভাবে program চলে user mode এ, যেখানে resource access সীমিত থাকে।
-   কোন special কাজ (যেমন file read/write, process তৈরি) করতে হলে system call দিতে হয়, তখন program kernel mode এ যায়।

## ✨ Intro to Go Runtime

```bash
go build main.go
```

Go compiler:

-   main.go ফাইলটা compile করে
-   তারপর একটা binary executable file তৈরি করে - সাধারণভাবে সেটা হয় `main` নামে (Linux/Unix-এ)

```bash
./main
```

একটা process create হয়

**🔁 সংক্ষেপে flow:**

```plaintext
go build main.go   →  main (binary file)
./main             →  OS creates a process
                   →  program runs
```

### 📦 Main Stack এবং Stack Frame

-   Main thread এর জন্য একটি stack তৈরি হয় - এটাকে বলে main stack।
-   Go runtime এর function গুলোর জন্য এই main stack এ stack frames তৈরি হয়।
-   Main thread → execute → go runtime stack

**🔹 Stack Frame:**
প্রতিটা function call এর জন্য একটা stack frame তৈরি হয়।

Stack frame এর মধ্যে থাকে:

-   function এর local variables,
-   return address (function শেষে কোথায় ফিরে যাবে),
-   কিছু runtime bookkeeping data।

**🔹Go Runtime -**

-   Memory allocate
-   Set up → Stack & Heap
-   Initialize → Go Scheduler
-   Go Runtime → System Call → Kernel → `epoll_create`

### 🌀 What is epoll in Linux?

-   `epoll` হলো Linux kernel এর একটি I/O _event notification system_
-   এটি ব্যবহার করা হয় একসাথে অনেকগুলো _file descriptor (fd)_ এর ওপর efficiently নজর রাখার জন্য।

> এটি `select()` বা `poll()` এর থেকে আরও scalable, efficient, এবং faster।

Linux-এর epoll এর মতো high-performance I/O event notification mechanisms অন্য OS-গুলোতেও আছে

#### 🖥️ MacOS (Darwin/BSD) ➤ kqueue

-   Equivalent of epoll in macOS is kqueue.
-   এটি BSD-based systems (macOS, FreeBSD, OpenBSD) এ ব্যবহৃত হয়।

#### 🪟 Windows ➤ IOCP (I/O Completion Ports)

-   Windows-এর equivalent হল ➤ IOCP (I/O Completion Ports)।

**🔹 IOCP-এর কাজ:**

-   Asynchronous I/O operations handle করতে ব্যবহৃত হয়।
-   Efficient এবং scalable, especially high-performance servers-এর জন্য।

### 🧠 epoll কবে দরকার হয়?

-   Network socket
-   File
-   Pipe

ইত্যাদি একসাথে monitor করতে এবং কোনটা read/write এর জন্য ready হয়েছে

```plaintext
epfd = epoll_create1(0);                // epoll instance তৈরি
epoll_ctl(epfd, ADD, sockfd, &event);   // কোন socket watch করবো?
epoll_wait(epfd, events, MAX, timeout); // wait করবো কখন data আসবে
```

### 🔧 epoll এর জন্য ব্যবহৃত ৩টি main syscall

**`epoll_create` / `epoll_create1`**

-   একটি নতুন epoll instance তৈরি করে এবং একটি file descriptor (fd) রিটার্ন করে।
-   এই fd কে ব্যবহার করে আপনি পরবর্তীতে ইভেন্ট monitor করবেন।

**`epoll_ctl`**

-   epoll instance এ কোন file descriptor monitor করতে হবে সেটা বলে দেয়।
-   অর্থাৎ: add / modify / delete operation।

**`epoll_wait`**

-   এটি block করে (অপেক্ষা করে) যতক্ষণ না কোন monitored file descriptor থেকে I/O event আসে।
-   যখন আসে, তখন সেই event return করে দেয়।

### 🏷️ Scenario: epoll-based Non-blocking File Read in Linux

**Process & Threads**

-   P1: T1, T2
-   P2: T1
-   P3: T1, T2, T3

P1-T1 একটি ফাইল পড়তে চায়, অর্থাৎ I/O operation করতে চায়।

আমরা ধরছি এটা non-blocking I/O এবং epoll ব্যবহৃত হচ্ছে (Linux system)।

#### ১️⃣ T1 ফাইল পড়তে চায়

-   T1 kernel-এ read request পাঠায়, কিন্তু ফাইল তখনও রেডি না।
-   তাই T1 বলে, "ফাইল রেডি হলে আমাকে জানিও" — non-blocking mode

#### 2️⃣ T1 syscall করে → epoll_ctl

-   এটা দিয়ে kernel-কে জানানো হয়:
-   "এই ফাইলের জন্য আমি অপেক্ষা করবো। ফাইলটা read করতে পারলেই আমাকে ডাকো।"

#### 3️⃣ Kernel T1 কে ঘুম পাড়িয়ে দেয়

-   যেহেতু ফাইল এখনো রেডি না, তাই kernel T1 কে sleep/wait করিয়ে দেয়।
-   T1 wait queue তে চলে যায়
-   তখন P1-এর অন্য থ্রেড T2, বা অন্য প্রসেসের থ্রেডগুলো স্বাভাবিকভাবে কাজ করে

#### 4️⃣ kernel ফাইল চেক করতে থাকে

-   kernel backend-এ ফাইল ready কিনা সেটা monitor করে।
-   যখন ফাইলটা readable হয়ে যায়, তখন kernel ফাইলটা load করে, এবং ফাইলের জন্য file descriptor তৈরি করে

#### 5️⃣ kernel epoll কে notify করে

-   kernel epoll_wait কে বলে: "এই file descriptor এখন ready"
-   epoll_wait তখন সেই FD কে ready list-এ রাখে

#### 6️⃣ epoll_wait Thread কে জাগিয়ে তোলে

_epoll_wait এর কাজ:_

-   যারা অপেক্ষা করছিল, তাদের জানিয়ে দেয়া "তোমার ফাইল রেডি"
-   T1 এখন wake up হয়

#### 7️⃣ T1 এখন read(fd) দিয়ে ফাইল পড়ে

-   এবার T1 ফাইলটি read করে নেয় file descriptor ব্যবহার করে
-   File descriptor একটি token এর মতো কাজ করে — এটি বলে দেয় kernel-এর কোন জায়গা থেকে ফাইল পড়তে হবে

### 📦 File descriptor

-   File descriptor হচ্ছে kernel-এর একটি token বা ID যা file/socket-এর represent করে।
-   User-space access করতে পারে না, কিন্তু kernel আর Go runtime, file/socket কে চিনে ফেলে এই FD দিয়ে।

### 🚀 Back to Go Runtime Story

**1. Go Runtime শুরুতেই কী করে?**

-   Go runtime নিজের মধ্যে একটা epoll instance তৈরি করে (epoll_create syscall ব্যবহার করে)।
-   যখন epoll তৈরি করে, তখন kernel-কে বলে দেয় কতগুলো file descriptor (FD) একসাথে পড়তে চায়
    -   Go Runtime kernel-কে বলে দেয় 100 file descriptor (FD) একসাথে পড়তে চায়
    -   Max 100 FD read করার জন্য `epoll_ctl` send করা যাবে kernel এর কাছে
    -   100 FD list আকারে epoll_wait thread কে দিয়ে দিবে
    -   `epoll_wait` thread FD list Go runtime কে দিয়ে দিবে
-   এই instance handle করে সব network I/O বা file I/O অপারেশন।
-   এরপর Go runtime একটি আলাদা OS thread তৈরি করে যেখানে `epoll_wait` বসে থাকে। এই থ্রেডকে বলা যায় "Netpoller Thread"।

**2. একটি goroutine file/socket read করতে চায়**

-   main goroutine (যেমন `go func() { conn.Read() }`) socket থেকে কিছু পড়তে চায়।
-   যদি data তখনই available না থাকে, Go runtime:
    -   ওই goroutine কে block না করে park (ঘুম পাড়িয়ে) দেয়।
    -   একইসাথে, সেই socket বা file descriptor কে epoll instance-এ register করে রাখে (`epoll_ctl` দিয়ে)।

**3. epoll_wait কী করে?**

-   আলাদা Netpoller Thread সবসময় epoll_wait syscall চালিয়ে ঘুমিয়ে থাকে।
-   যখন kernel detect করে যে socket/data ready, তখন সেই Netpoller Thread কে wake করে দিয়ে data দেয়।
-   এরপর Netpoller জানায় যে fd ready।

**4. Go Runtime পুনরায় goroutine চালু করে**

-   Go runtime বুঝে যায় যে যে goroutine file/socket read করতে চেয়েছিল তার data এসে গেছে।
-   তাকে আবার runnable করে দেয়, এবং data পড়া শুরু হয়।

### ⚙️ Setting Up Garbage Collector (GC)

-   Go runtime GC চালানোর জন্য আলাদা OS thread ব্যবহার করে, যাতে প্রোগ্রামের মূল কাজ বিঘ্ন না ঘটে
-   thread গুলো background-এ silently কাজ করে memory clean রাখে
-   Go Runtime পুরোপুরি GC thread control করে

### 🧠 Go Scheduling

Go runtime M:P:G model scheduling follow করে, যেখানে

-   M = Machine (OS-level Thread) — যেটা বাস্তবে CPU-তে কাজ চালায়।
-   P = Processor (Logical Processor) — এটি goroutine run করার জন্য প্রয়োজনীয় execution context ধরে রাখে, যেমন: local run queue, stack, scheduler info ইত্যাদি।
-   G = Goroutine — আমরা যেসব Go function/logic concurrently চালাই, এগুলোকে Go runtime “goroutine” নামে চালায়।

#### 🏗️ Go Scheduler Initialization

**M (Machine, বা OS Thread) তৈরি**

Go runtime শুরুতেই exactly vCPU সংখ্যক machine thread (M) তৈরির জন্য OS কে request করে।

-   1 core → 2 vCPU → 2 M
-   2 core → 4 vCPU → 4 M

**P (Logical Processor) তৈরি**

🔹 Go runtime M সংখ্যক "Logical Processor" তৈরি করে, যাকে P বলা হয়

-   4 M : 4 P

🔹 এই P গুলো দেখতে অনেকটা Virtual CPU (vCPU) এর মতো

🔹 কিন্তু এগুলো hardware vCPU না, বরং Go runtime এর internal scheduling unit

**G (Goroutine) তৈরি**

🔸 Go runtime-এর সবচেয়ে lightweight execution unit হচ্ছে Goroutine (G)

🔸 প্রতিটি `go someFunction()` কল করলে নতুন একটা goroutine তৈরি হয়

### 🧩 Go Scheduler: 1M : 1P : 2G Diagram

মনে করি, 1M:1P:2G — এবং মনে হচ্ছে 1P দুইটা goroutine একসাথে চালাচ্ছে, আর 1M চালাচ্ছে সেই 1P-কে

```markdown
                        ┌──────────────┐
                        │   Machine M  │  ← OS Thread (Executes G via P)
                        └──────┬───────┘
                               │
                               ▼
                        ┌──────────────┐
                        │ Logical P    │  ← Holds G run queue
                        └──────┬───────┘
                               │
                ┌──────────────┴──────────────┐
                ▼                             ▼
        ┌──────────────┐             ┌──────────────┐
        │ Goroutine G1 │             │ Goroutine G2 │
        └──────────────┘             └──────────────┘
```

### 🧠 1 Core Scenario in Go Scheduler

#### ✅ Initialization Phase:

-   OS থেকে পাওয়া যায় → 1 Core ⇒ 2 vCPU
-   তাই Go runtime তৈরি করে:
    -   2 Machine Thread (M)
    -   2 Logical Processor (P)

```markdown
          🧠 Physical Core (1)
                │
        ╔═══════╧════════╗
        ▼                ▼
     M1 (Thread)      M2 (Thread)
       │                 │
       ▼                 ▼
    ┌─────┐           ┌─────┐
    │  P1 │           │  P2 │
    └─┬───┘           └─┬───┘
      │                 │

┌───▼───┐ ┌───▼───┐
│ G1,G2 │ │ G3,G4 │ ← Each P has its G queue
└───────┘ └───────┘
```

### 🧪 Run Queue

Go এর scheduler-এ ২ ধরনের run queue থাকে

### 🧵 ১. Local Run Queue (per P)

প্রতিটি Logical Processor (P) এর নিজস্ব একটি Run Queue থাকে, যেখানে goroutine (G) গুলো রাখা হয়।

#### 🧩 কীভাবে কাজ করে:

-   প্রতিটি P একটি fixed-size circular run queue মেইনটেইন করে যা ring এর মতো
-   প্রতিটি Local Run Queue এর slot 256 → 256 goroutine
-   প্রতিটি P তার queue এর G গুলোকে FIFO ভিত্তিতে চালায় (First-In-First-Out).
-   যেই P বর্তমানে M দ্বারা চালিত হচ্ছে, সেই P তার queue থেকে goroutine G নিয়ে চালায়।
-   যদি কোন G ব্লক করে (I/O, sleep etc), তাহলে P আবার queue থেকে নতুন G চালায়।
-   যদি P এর queue খালি হয়ে যায়, তাহলে:
    -   সে `work stealing` করে — অন্য P এর queue থেকে G চুরি করে নেয়।

### 🌍 ২. Global Run Queue

যেসব goroutine-কে কোনো নির্দিষ্ট P-তে assign করা যায় না, সেগুলো Global Run Queue-তে রাখা হয়।

-   System-wide queue, সব P access করতে পারে।
-   Locking দরকার পড়ে, তাই একটু ধীর।
-   যখন কোনো P-র local queue খালি হয়, তখন সে Global queue থেকে কাজ নেয়।

> 🔐 Locking হচ্ছে এমন একটা ব্যবস্থা, যেটা দিয়ে একই সময় একাধিক goroutine যেন একসাথে একই জিনিসে হাত না দিতে পারে, সেটা নিশ্চিত করা হয়।

-   newly created goroutines যে local run queue তে জায়গা পাবে বসে যাবে।
-   logical processor free থাকলে local run queue থেকে goroutine নিয়ে execute করতে থাকে।
-   প্রতিটি local run queue একটি করে goroutine execute করে এবং slot গুলোতে 256 টি করে goroutines থাকলে newly created goroutines গুলো global run queue তে গিয়ে বসে
-   যদি local run queue খালি হয়ে যায়, তাহলে সে অন্য P এর queue থেকে half goroutines নিয়ে নেয় (this is called `Work Stealing`).

-   কোন processor free হলে এবং এর local run queue তে কোন goroutine না থাকলে, এবং অন্য logical processor এর local run queue তেও goroutines না থাকলে (এক্ষেত্রে work stealing করতে পারেনা) এটি global run queue থেকে goroutines নিয়ে execute করে

### 🔹 Execution of `main.go`

```go
package main

import (
	"fmt"
	"net/http"
)

func handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	fmt.Fprintln(w, "hello world")
}

func aboutHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "About page")
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/", handler)
	mux.HandleFunc("/about", aboutHandler)

	fmt.Println("Server running on :8080")
	err := http.ListenAndServe(":8080", mux)
	if err != nil {
		fmt.Println("Error starting server", err)
	}
}
```

```bash
go build main.go
./main
```

#### 📦 Go Program Memory Layout

```markdown
                        +----------------------------+
                        |        Code Segment        |
                        |----------------------------|
                        | - func handler             |
                        | - func aboutHandler        |
                        | - func main                |
                        | - imported fmt, net/http   |
                        +----------------------------+

                        +----------------------------+
                        |       Data Segment         |
                        |----------------------------|
                        | - Static/global data       |
                        | - Function/method metadata |
                        | - String constants         |
                        |   e.g., "hello world"      |
                        |         "About page"       |
                        |         ":8080"            |
                        +----------------------------+

                        +----------------------------+
                        |           Heap             |
                        |----------------------------|
                        | - Dynamically allocated    |
                        |   memory during runtime    |
                        | - mux := http.NewServeMux()|
                        | - Each request's data      |
                        | - Goroutines' data         |
                        +----------------------------+

                        +----------------------------+
                        |           Stack            |
                        |----------------------------|
                        | - Go Runtime Code          |
                        |                            |
                        +----------------------------+
```

### 🌀 Go HTTP Server Execution

**🔹 ১. Go রানটাইম চালু হওয়ার শুরুতে:**

-   Go প্রোগ্রাম চালু হলে:
    -   প্রথমে **init()** ফাংশনগুলো (যদি থাকে) execute হয়।
    -   এরপর memory layout অনুযায়ী code segment, data segment, ইত্যাদি সেটআপ হয়।

**🔹 ২. Main Thread & Stack Setup**

-   Go runtime একটা main OS thread তৈরি করে।
-   এই থ্রেডের জন্য একটা main stack allocate করে।
-   এই stack-এ runtime code ও অন্যান্য execution চলবে।

**🔹 ৩. Main Goroutine তৈরি**

-   Go automatically একটা main goroutine তৈরি করে।
-   এর initial stack size হয় 2KB (heap-এ allocate করা হয়)।
-   এই goroutine থাকবে local run queue-তে।

**🔹 ৪. Scheduler এবং Processor**

-   Go runtime-এ আছে:
    -   M (Machine = Thread)
    -   P (Processor = Logical executor)
    -   G (Goroutine)
-   যখন Go start হয়, main goroutine local run queue তে enqueue হয়।
-   একটি P (logical processor) active থাকে — শুধু সে কাজ করে কারণ এই মুহূর্তে একমাত্র main goroutine-টাই active।
-   অন্য P গুলো sleep করে থাকবে যদি আর কোনো goroutine না থাকে।

**🔹 ৫. main() Function Execution শুরু**

-   Main goroutine-এর ভিতর:
    -   main() function-এর জন্য একটা stack frame তৈরি হয়।
    -   তারপর main() ফাংশনের ভিতরের কোড execute হতে থাকে।

**🔹 ৬. Router Creation**

-   http.NewServeMux() কল করা হয়:
    -   এটি একটি ServeMux object তৈরি করে।
    -   এই object টি main goroutine-এর stack frame এ থাকে।

**🔹 ৭. Route Register**

-   mux.Handle("/", handler):
    -   Mux object-এর ভিতরে route pattern ও handler function register হয়।
    -   এগুলো map আকারে ServeMux struct-এ store হয়।

**🔹 ৮. Server Start**

-   http.ListenAndServe(":8080", mux):
    -   এটা main goroutine থেকে call হয়।
    -   এর জন্য একটি নতুন stack frame তৈরি হয়।

**🔹 ৯. Internal serve() Call**

-   ListenAndServe() এর ভিতর:
    -   srv.Serve(l net.Listener) function call হয়।
    -   এর জন্য আরেকটি stack frame তৈরি হয়।

**🔂 🔁 ১০. Server-এর Infinite Loop**

-   Serve() function-এর ভিতরে থাকে একটি infinite for loop:
    -   যেটা প্রতি iteration-এ করে:
        -   Accept() করে নতুন connection।
        -   প্রতিটি connection এর জন্য নতুন goroutine তৈরি করে।
        -   সেই goroutine handle করে HTTP request-response।

```markdown
Program Start
│
├─> Execute init()
├─> Setup code/data segment
├─> Create main thread + main stack
├─> Create main goroutine (2KB heap stack)
│
└─> main goroutine enqueued → local run queue → executed by P

Main Goroutine:
│
├─> main() stack frame created
│ ├─> mux := http.NewServeMux()
│ ├─> mux.Handle("/", handler)
│ └─> http.ListenAndServe(":8080", mux)
│ └─> srv.Serve(listener)
│ └─> infinite for loop
│ └─> accept conn → new goroutine → handle request
```

```go
for {
    rw, err := l.Accept()
    go c.serve(connCtx)
}
```

### 🧠 Go HTTP Server accepts connection and handles it

**🔹 ১. l.Accept() কল হয়**

-   এটি একটি network socket accept call।
-   এর জন্য একটি নতুন stack frame তৈরি হয়।
-   এর কাজ হচ্ছে:
    -   নতুন কেউ connect করতে চাইলে, তার সাথে communication শুরু করা।

**🔹 ২. Accept() কী করে?**

-   main goroutine → Accept() call করে → এটি Go runtime কে বলে:
    -   “আমাকে একটা socket দাও, যাতে আমি নতুন connection handle করতে পারি।”
    -   Go runtime তখন দেখে, “আমার কাছে কি socket আগে থেকেই ready আছে?”

**🔹 ৩. Socket না থাকলে কী হয়?**

-   যদি socket না থাকে:
    -   Go runtime → epoll_ctl() call করে → kernel কে বলে:
        -   “তুমি একটা socket তৈরি করো এবং future-এ ready হলে আমাকে জানিও।”
-   এই কাজটা Go-এর netpoll library এর মাধ্যমে করা হয়।

**🔹 ৪. epoll_ctl → kernel**

-   epoll_ctl() একটা asynchronous system call:
    -   মানে এটা main goroutine কে block করে না।
    -   Go runtime meanwhile অন্যান্য কাজ চালাতে পারে।

**🔹 ৫. Linux kernel কী করে?**

-   Linux-এ সবকিছু file হিসেবে treat করা হয় (socket, file, device — সবকিছু)।
-   Kernel একটি socket তৈরি করে — এটা এক প্রান্ত যা দিয়ে data পাঠানো ও গ্রহণ করা যায় (like pipe)।
-   এই socket-এর জন্য kernel একটি file descriptor (FD) দেয়।
    -   যেমন, ধরো FD = 5

**🔹 ৬. Main Thread Sleep করে**

-   main goroutine তখন sleep করে থাকে, কারণ সে অপেক্ষা করছে নতুন socket connection-এর জন্য।
-   কিন্তু এই সময়েও Go runtime বন্ধ হয় না — অন্যান্য goroutine গুলো চালু থাকতে পারে।

**🔹 ৭. New Connection এলে**

-   কেউ যখন connect করে:
    -   Kernel বলে: “এই socket (FD 5) now ready!”
    -   Go runtime এর netpoller জেগে উঠে (via epoll_wait) এবং সেই connection গ্রহণ করে।

**🔹 ৮. New goroutine handle করে**

-   তারপর Go runtime:
    -   `go c.serve(connCtx)` কল করে
    -   নতুন goroutine তৈরি হয় → এটি সেই connection এর request/response handle করে

| Step | Description                                        |
| ---- | -------------------------------------------------- |
| 1️⃣   | `Accept()` call → নতুন connection চাই              |
| 2️⃣   | Go runtime checks → socket available?              |
| 3️⃣   | না থাকলে → `epoll_ctl()` → kernel socket তৈরি      |
| 4️⃣   | Kernel → socket তৈরি করে (e.g. FD = 5)             |
| 5️⃣   | main goroutine sleeps → non-blocking epoll         |
| 6️⃣   | New connection এলে → `epoll_wait` wakes Go runtime |
| 7️⃣   | `go c.serve()` → new goroutine handles request     |

### 🌐 যখন একটি HTTP Request করা হয় — ভিতরের জগৎ (Go HTTP Server + OS + NIC + Kernel)

**🔹 ১. ব্রাউজারে আমরা URL দিই (যেমন: http://localhost:8080/)**

-   এই request প্রথমে যায় router → router → server router এর দিকে (DNS resolve ধরে নেওয়া হয়েছে)।

**🔹 ২. Server এর Network Interface**

-   Server-side এর Network Interface Controller (NIC) — হতে পারে Ethernet Cable বা Wi-Fi Adapter — এই request ধরে।
-   এই NIC data গুলো লেখে তার NIC Receive Buffer (RAM এর একটা অংশ) এ।

**🔹 ৩. NIC Interrupt **

-   যেই মুহূর্তে NIC data পায়, সে তখন Interrupt Signal পাঠায় Kernel কে।
-   Kernel তখন এসে NIC Receive Buffer থেকে data পড়ে।

**🔹 ৪. Kernel → Socket Receive Buffer**

-   Kernel data কে write করে Socket Receive Buffer এ (যেটা File Descriptor fd 5 এর সাথে যুক্ত)।

**🔹 ৫. Kernel → fd 5 Ready**

-   এরপর Kernel fd 5 কে ready for read হিসেবে mark করে।

**🔹 ৬. epoll_wait() → Wake Up**

-   যেহেতু Go runtime epoll_wait() দিয়ে অপেক্ষা করছিল, kernel এখন:
    -   সেই sleeping epoll_wait() thread কে wake করে।
    -   এবং বলে: “fd 5 এখন ready।”

**🔹 ৭. epoll_wait → Go Runtime**

-   epoll_wait() এই fd 5 কে Go runtime এর কাছে পাঠায়।

**🔹 ৮. Go Runtime → Sleeping Goroutines**

-   Go runtime দেখে, “এই fd 5 এর জন্য কোনো goroutine আগে থেকে ঘুমিয়ে ছিলো?”
-   যদি থাকে, তবে সেই goroutine কে wake করে।
-   এরপর Go runtime এর scheduler সেই goroutine কে Local Run Queue তে রাখে।
-   একটি Logical Processor (P) সেই goroutine টি চালানোর জন্য একটি dedicated OS thread (M) পায়।

**🔹 🔁 Execution শুরু**

-   সেই Logical Processor এখন main goroutine execute করে।
-   Go runtime fd 5 কে main goroutine এর কাছে পাঠায়।

**🔹 🔍 Data Read হয়**

-   এখন main goroutine fd 5 থেকে data পড়ে
-   socket receive buffer থেকে data আসে
-   rw → data store হয়

**🔹 🚀 Serve করার জন্য নতুন goroutine তৈরি**

-   এরপর Go runtime `go c.serve(connCtx)` কল করে  
    -নতুন একটা goroutine তৈরি হয়

এই goroutine টি rw তে থাকা data ব্যবহার করে HTTP request handle করে।

**🔄 পরবর্তী request-এর জন্য অপেক্ষা**

-   এরপর main goroutine আবার `l.Accept()` এ যায়।
-   Go runtime জানে যে আগেই socket (fd 5) তৈরি হয়েছে।
-   সে এখন new incoming request এর জন্য অপেক্ষা করে।

**🔁 নতুন data এলে আবারো একই cycle**

-   NIC → kernel → socket receive buffer → mark fd ready → wake epoll_wait

-   Go runtime → wake goroutine → read → serve

এভাবেই একটি HTTP server concurrency + efficiency সহকারে thousands of connections handle করতে পারে।

```markdown
Client Request (Browser)
↓
Router → Server NIC → NIC Buffer (RAM)
↓ (Interrupt)
Linux Kernel → Copy to Socket Buffer (fd 5)
↓
Mark fd 5 ready → Wake epoll_wait()
↓
Go Runtime → Finds sleeping goroutine
↓
Wake up → Scheduler → Local Run Queue → OS Thread
↓
Execute main goroutine
↓
main goroutine reads from fd 5 → rw = l.Accept()
↓
go c.serve(connCtx) → spawn goroutine to handle
↓
main goroutine again waits for next request...
```

### 📦 Newly Spawned goroutine

-   যখন `go c.serve(connCtx)` এর মাধ্যমে একটি নতুন goroutine spawn করা হয়,
    তখন একটি নতুন stack তৈরি হয়, এবং এই stack টি heap memory এর মধ্যে সংরক্ষিত হয়।
-   Go তে goroutine এর stack ছোট (প্রথমে 2KB), কিন্তু এটি dynamic ভাবে বাড়তে পারে।
-   এই goroutine টি তারপর local run queue তে যুক্ত হয়, যেখানে অনেক goroutine লাইন ধরে অপেক্ষা করে।
-   প্রতিটি logical processor (P) এর সাথে একটি dedicated OS thread (M) mapped থাকে। এই logical processor (P) সেই local run queue থেকে goroutine টিকে তুলে নেয় এবং execution শুরু করে।

> 🧵 goroutine spawn = “নতুন একটি lightweight thread তৈরি করে সেটাকে চালু করা।”

### ✅ mux এবং handler execution ধাপ:

-   এর আগে server এর মধ্যে mux (যেমন `http.NewServeMux()`) তৈরি করা হয়েছে এবং সেখানে `HandleFunc()` এর মাধ্যমে route ও handler function register করা হয়েছে।
-   goroutine ওই router-এর মধ্যে খুঁজে দেখে, request-এর URL path /about এর মতো কোন route এর সাথে match করে কিনা।
-   নতুন goroutine যখন চালু হয়, তখন request-এর URL path, header, এবং অন্যান্য metadata দেখে বোঝার চেষ্টা করে, কোন route বা path টি মিলে যাচ্ছে।
-   যখন একটি HTTP request আসে, তখন router চেক করে সেই URL path এর সাথে কোন pattern match করছে এবং সেই অনুযায়ী handler function execute করে।
    -   যেমন goroutine ওই router-এর মধ্যে খুঁজে দেখে, request-এর URL path `/about` এর মতো কোন route এর সাথে match করে কিনা।
    -   `/about` path এর জন্য `aboutHandler()` নামের handler function register করা আছে।
-   handler match হবার পর, সেই matched handler function এর জন্য একটি নতুন stack frame তৈরি হয়, যাতে ওই ফাংশনটি তার কোড execute করতে পারে।
    -   যখন `aboutHandler()` চালু হয়:
        -   তার জন্য একটি নতুন stack frame তৈরি হয়, যাতে ফাংশনের ভিতরের কোড execute করা যায়।
        -   এই ফাংশন `w (response writer)` & `fprintln` এর মাধ্যমে socket এর কাছে `"About page"` write করে।
        -   socket send buffer এ syscall এর মাধ্যমে data store হয়।

### 🧠 NIC-এ ডেটা যাওয়ার প্রসেস

-   **Go app থেকে socket**
    -   fmt.Fprintln(w, "About page") → Go runtime ResponseWriter এর ভিতরে Write() method call করে → অবশেষে `syscall.Write()` এর মাধ্যমে kernel _socket send buffer_ এ data জমা হয়।
    -   `ResponseWriter.Write()` → অবশেষে Go syscall layer-এ গিয়ে syscall.Write() call হয়।
    -   `syscall.Write()` এর মাধ্যমে data kernel space-এ যায় এবং Socket Send Buffer এ জমা হয়।
    -   Kernel তখন socket FD (File Descriptor) অনুযায়ী check করে data ready কিনা।
-   **Kernel থেকে NIC**
    -   Kernel-এর network stack সেই data কে প্যাকেট করে (TCP/IP header সহ) NIC-এর _TX (Transmit) ring buffer_-এ লেখা হয় (এটা _hardware circular queue_)।
-   **NIC প্যাকেট নেয় এবং Physical Layer-এ পাঠায়**
    -   NIC Controller → DMA (Direct Memory Access) দিয়ে data ring buffer থেকে পড়ে → electromagnetic signal আকারে Ethernet cable / WiFi দিয়ে router/switch-এর দিকে পাঠায়।
-   **Router hopping**
    -   একাধিক router, switch এবং network node পার হয়ে destination client (user-এর PC বা mobile) পর্যন্ত পৌঁছায়।
-   **Client receives**
    -   Client এর NIC → OS → Browser → renders **"About page"**

```plaintext
+--------------------+               +-----------------+
|  Go Application    |               |     Kernel      |
|--------------------|               |-----------------|
| fmt.Fprintln(w,…)  |               |                 |
|   ↓                |               | syscall.Write() |
| ResponseWriter     |               |   ↓             |
|   ↓                |               | Socket Buffer   |
+--------------------+               |   ↓             |
                                     | NIC Driver      |
                                     +--------↓--------+
                                              |
                           +------------------↓-------------------+
                           |       NIC TX Ring Buffer (DMA)       |
                           +------------------↓-------------------+
                                              |
                                 Electromagnetic Signal
                                              ↓
                                        Ethernet/WiFi
                                              ↓
                                           Router
                                              ↓
                                          Client PC
                                        "About page"

```

| Term                     | Meaning                                           |
| ------------------------ | ------------------------------------------------- |
| **Socket**               | 2-way data pipe, communication endpoint           |
| **File Descriptor (FD)** | kernel-assigned number for tracking sockets/files |
| **epoll_ctl**            | kernel কে বলি — “এই socket ready হলে আমাকে জানিও” |
| **epoll_wait**           | Go runtime waits here — non-blocking              |
| **goroutine**            | Go-এর ultra-light thread — request handle করে     |

[**Author:** @nazma98
**Date:** 2025-07-30
**Category:** interview-qa/class-wise
]
