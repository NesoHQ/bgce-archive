# 🧵 Class 41 : Separate Stack For Separate Thread

## 🔁 Recap

- [Thread](https://nesohq.github.io/bgce-archive/interview-qna/class-wise/golang038-thread/index.html) সম্পর্কে জানতে হবে।
- [Process](https://nesohq.github.io/bgce-archive/interview-qna/class-wise/golang034-breaking-the-cpu-and-process/index.html) সম্পর্কে জানতে হবে।
- [SP BP](https://nesohq.github.io/bgce-archive/interview-qna/class-wise/golang035-BP-SP/index.html) সম্পর্কে ভালো ধারনা থাকতে হবে।

## 🧠 Program Execution

- Program execute -> Process create
- Process create -> default একটি thread create (main thread)
- OS (Kernel) -> Thread execute করে
- Thread execute -> Independent task / features

### 🧪 Example

একটি প্রোগ্রাম যেমন Music Player — তার অনেক গুলো কাজ (functionality) একসাথে চালানো লাগে:
যেমন:

- 🎵 Music List দেখানো
- ▶️ Music PLay
- 🎶 বিট/Visualizer দেখানো

এগুলো একসাথে চলতে পারে, কিন্তু একটার কাজ আরেকটাকে আটকে রাখতে পারে না।
এই জন্যই Thread ব্যবহার করা হয়।

```plaintext

Program (Process)
│
├── Thread 1 (Main Thread)
│   └── Stack: funcA(), var x, return addr
│
├── Thread 2
│   └── Stack: funcPlay(), var song, return addr
│
└── Thread 3
    └── Stack: funcVisual(), var beat, return addr
```

## 🧷 Main Function Execution

প্রায় প্রতিটি compiled এবং structured language-এ execution শুরু হয় main() function দিয়ে, কারণ এটি একটি নির্ধারিত entry point যা runtime system বা OS খুঁজে নিয়ে চালায়।

- `main` function -> stackframe create হয়
- `main()` এর ভিতর অন্য function invoke -> তার জন্য stackframe create হয়
- প্রতিটি Stack, একটি Thread এর জন্য বরাদ্দ থাকে
- Stack Execute -> Thread Execute

> Stack একটা একটা করে সব function execute করে।

> Stack কে Thread execute করে।

## 🗂️ Thread এবং Stack

একটি Program execute করতে হলে multiple tasks parallely করতে হতে পারে।

এর জন্য দরকার হয় Multiple Threads।

প্রতিটি Thread যখন তৈরি হয়, তখন নিজস্ব Stack memory বরাদ্দ পায়।

এই Stack এ থাকে:

- ফাংশন কলের return address
- Local variables
- Function arguments

## 💾 Stack কোথায় থাকে

- main thread -> main stack
- Linux -> RAM এ Stack এর জন্য `8MB` allocate হয়
- Independent task এর জন্য আলাদা Thread লাগবে -> new Stack -> RAM এ 8MB Storage
- Process এর জন্য -> No. of Thread `*` 8MB allcoate হয়
  - Process এ `10` Thread থাকলে `10 * 8 = 80` MB RAM allocated হয়
- Stack, RAM এর যে কোন ফাঁকা জায়গায় থাকতে পারে
- Code Segment, Data Segment, Heap -> সব thread access / use করতে পারে
- Process, main thread বাদে অন্য thread track / execute করে না
- Thread -> Stack এ কোন variable / function না থাকলে -> kernel কে code segment, data segment এ search করতে request করে

## 🖥️ Kernel

- main thread বাদে অন্য thread -> Kernel create করে
- Thread execute -> Opeating System (Kernel)
- Kernel decide করে -> কোন processor কোন process / thread কে execute করবে
- Kernel track রাখে -> কোন process এর under এ কয়টি thread থাকে
- Kernel (Modern computer) -> execution এর ক্ষেত্রে only thread count রাখে

> 📌 Code Segment, Data Segment, Stack এর size fixed থাকে। Heap dynamically grow / shrink করতে পারে তাই data, Heap এ বেশি রাখা হয়।

> 🧠 Operating System core component -> Kernel; Kernel process schedule, concurrency / parallelism handle করে।

> 🧾 Programming language এর উপর depend করে কীভাবে thread create হবে।

## 📊 Default Stack Sizes by Platform

| OS         | Default Stack Size (main thread) | Default Stack Size (new threads) | Notes                                                            |
| ---------- | -------------------------------- | -------------------------------- | ---------------------------------------------------------------- |
| 🪟 Windows | 1 MB                             | 1 MB                             | Can be changed via linker or `CreateThread`                      |
| 🐧 Linux   | 8 MB                             | 8 MB                             | Controlled by `ulimit -s` and `pthread_attr_setstacksize()`      |
| 🍎 macOS   | 8 MB                             | 512 KB                           | Main thread gets 8MB, but `pthread` threads get 512KB by default |
