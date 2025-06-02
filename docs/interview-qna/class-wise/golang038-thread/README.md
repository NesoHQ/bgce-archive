# Class 38 - Thread

## 🧵 Thread কী?

- **Thread** হল কোন process এর একটি **execution unit**.
- একটি **process creation** এর সাথে সাথে by **default** একটি thread create হয় যাকে **main thread** ও বলা হয়।
- Thread মূলত **RAM এ load করা instruction/program code গুলো execute** করে থাকে।

---

## 🧠 Thread কোথায় থাকে?

```plaintext
                User software/program এ double click করে
                                  ⬇️
            RAM এ লোড হওয়া program এর binary executable code load হয়
                                  ⬇️
                      OS একটি process create করে
                                  ⬇️
                      default thread create হয়

```

- Thread কে **process এর একটি অংশ** বলা যায়।
- **Process creation** এর শুরুতে thread এবং process একই থাকে।
- Process is **container**, thread is **executor**

---

## 🔍 Thread কে Virtual Process কেন বলা হয়?

- **New Process create** ➡️ **Default Thread Create** হয়
- Thread এর **Code Segment, Data Segment, Stack, Heap** ইত্যাদি থাকে ➡️ Process এর অনুরূপ
- Process এর মতোই behave করে থাকে।
- **Logical Process** বলা হয়।

---

## 🧶🔄 Multi-threading

একটি process এর মধ্যে অনেকগুলো কাজ বা functionality execute করার জন্য, OS ওই process এর ভেতরে একাধিক execution unit তৈরি করে, যেগুলো একসাথে কাজ করে, তখন তাকে **`Multi-threading`** বলে।

### ✨ একই Process এর অন্তর্ভুক্ত Multiple Threads এর কিছু Characteristics

- প্রতিটি Thread এর নিজস্ব CPU state (যেমন: Register, Program Counter) এবং Stack থাকে।
- সব Thread একই Process এর code section, data section এবং OS resources (e.g. open files and signals) share করে।
- প্রতিটি Thread এর নিজস্ব **TCB (Thread Control Block)** থাকে।
- Thread গুলো **lightweight** হওয়ায় **context switching** দ্রুত হয়।
- একে অপরের সাথে সহজে Data শেয়ার করতে পারে → Fast Communication সম্ভব।
- এক Thread এ bug থাকলে পুরো process crash করতে পারে।
- Data sharing এর জন্য synchronization দরকার (mutex/semaphore)।

---

## 🧵 Visualization: Multi-threading Inside a Process

```
                  +-----------------------------+
                  |         Process             |
                  |  (e.g., Media Player App)   |
                  |                             |
                  |  +-----------------------+  |
                  |  |       Thread 1        |  |  --> Play Audio
                  |  +-----------------------+  |
                  |                             |
                  |  +-----------------------+  |
                  |  |       Thread 2        |  |  --> Display Video
                  |  +-----------------------+  |
                  |                             |
                  |  +-----------------------+  |
                  |  |       Thread 3        |  |  --> Handle User Input
                  |  +-----------------------+  |
                  |                             |
                  +-----------------------------+
```

### 🔍 Explanation

Process হচ্ছে একটি চলমান প্রোগ্রাম (যেমন: VLC Player)। সেই প্রোগ্রামের ভেতরে একাধিক Thread কাজ করছে। যেমন:

- 🎵 **Thread 1:** অডিও প্লে করছে
- 📺 **Thread 2:** ভিডিও দেখাচ্ছে
- 🎮 **Thread 3:** ইউজারের কীবোর্ড/মাউস ইনপুট নিচ্ছে

সব thread মিলে একটি process এর কাজকে দ্রুত ও কার্যকর করে।

## 🔄 Context Switching in Thread

- Thread ➡️ একটি নির্দিষ্ট কাজ/functionality এর জন্য দায়ী
- Process দ্রুত execute করার লক্ষ্যে ➡️ OS, multiple thread create করে
- Program Counter একটি নির্দিষ্ট সময়ে শুধু একটি thread এর instruction address ধরে রাখতে পারে ➡️ CPU একসাথে সব থ্রেড চালাতে পারে না
- CPU কিছু সময় একটি thread execute করে ➡️ একটি thread এর সময় শেষ বা thread blocked (যেমন: I/O wait)
- OS সেই thread এর current state (registers, stack pointer, program counter) সংরক্ষণ করে ➡️ **TCB (Thread Control Block)**
- এরপর OS অন্য thread এর state load করে
- এই পুরো প্রক্রিয়াটিকেই বলা হয় ➡️ **Thread Context Switching**

## Thread Pool 🧵🧵

**Thread pool** হলো আগেই তৈরি করা কিছু Thread, যেগুলো Process এ বসে থাকে আর কাজ এলে তা করে ফেলে।
প্রতিবার নতুন Thread না বানিয়ে আগের তৈরি Thread ব্যবহার করায় সময় ও রিসোর্স বাঁচে; বিশেষভাবে ছোট ও অনেক কাজ থাকলে এটা খুবই উপকারী।

## ⚙️ Process Vs Thread 🧵

| Feature                   | Process                                                         | Thread                                                                |
| ------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------- |
| 🔒 **Resource Isolation** | প্রতিটি Process এর নিজস্ব memory ও resources থাকে               | একই Process এর মধ্যে সব Thread একই memory ও resources শেয়ার করে      |
| 🔄 **Communication**      | জটিল; Inter-Process Communication (IPC) mechanisms প্রয়োজন হয় | সহজ; shared memory ব্যবহার করে Thread গুলো একে অপরের সাথে যোগাযোগ করে |
| ⚡ **Overhead**           | Process তৈরি ও পরিচালনার জন্য বেশি overhead লাগে                | Thread তৈরি ও পরিচালনা তুলনামূলকভাবে কম overhead                      |
| ⏱️ **Concurrency**        | Concurrency সম্ভব, তবে cost বেশি                                | একই Process এর মধ্যে concurrency অর্জনে বেশি কার্যকর                  |
| 🛡️ **Isolation**          | এক Process অন্য Process এর memory তে সরাসরি প্রবেশ করতে পারে না | Threads একে অপরের উপর প্রভাব ফেলতে পারে, কারণ তারা memory শেয়ার করে  |
| 📌 **Example**            | প্রতিটি browser tab আলাদা Process হিসেবে চলে                    | rendering, networking, JavaScript execution ইত্যাদি আলাদা Thread এ হয় |

---

[**Author:** @nazma98
**Date:** 2025-06-02
**Category:** interview-qa/class-wise
]
