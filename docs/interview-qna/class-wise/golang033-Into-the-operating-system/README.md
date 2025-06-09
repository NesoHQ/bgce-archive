# ✨ CLass 33 - Into The Operating System

## 🖥️ ENIAC ও Punch Card

**ENIAC (Electronic Numerical Integrator and Computer)** ছিল একেবারে প্রথম দিকের একটি general purpose computer যা Punch card ব্যবহার করত:

- Input (Data এবং Instruction)
- Output (Result)
- Storage (Storing temporary data)

ENIAC সাধারণত IBM এর **৮০ কলামের Punch card** ব্যবহার করত।

### 🧠 Punch Card (80x12)

- শক্ত কাগজ, যাতে ৮০টি কলাম ও ১২টি সারি থাকে।
- ছিদ্র দিয়ে তথ্য encode করা হয়
- ছিদ্র = `1`
- ছিদ্র না থাকলে = `0`

---

### 🧾 Punch card RAM এ লোড এবং Program execute

- **Punch Card তৈরি**
  - প্রোগ্রামের কোড বা ডেটা আগে কাগজে Punch card এ লেখা হতো (প্রতিটি কার্ড = ১ লাইন কোড বা তথ্য)।
  - **keypunch machine** দিয়ে ছিদ্র করা হতো।
- **Computer এ Feed**
  - Punch card গুলো card reader এ ঢোকানো হতো।
  - Reader ছিদ্রগুলো পড়ে Binary signal এ (1 বা 0) রূপান্তর করত।
- **RAM এ Load**
  - Binary signal গুলো কম্পিউটারের Memory ইউনিটে পাঠানো হতো।
  - সেই সময়কার RAM ছিল টিউব বা flip-flop ধরনের মেমোরি।
  - প্রতিটি instruction বা data নির্দিষ্ট location এ সংরক্ষিত হতো।
- **Execution**
  - কম্পিউটারের control unit(CU), memory থেকে একে একে instruction নিত।
  - Pointing Register (Program Counter) প্রথমে প্রথম instruction address কে point করে।
  - CPU সেই instruction -> fetch -> decode -> execute করে।
  - Instruction শেষ হলে, Pointing register এক ধাপ বাড়ে, অর্থাৎ পরবর্তী instruction address এ চলে যায়।
  - Loop বা condition থাকলে সেটা plugboards বা বিশেষ কার্ডে আগে থেকেই সেট করে দিতে হতো।

### 🛠️ Note:

- তখন কোনো operating system ছিল না। সব কিছু manually করতে হতো।
- RAM আজকের মতো উন্নত ছিল না; বরং ছিল একটি সীমিত মেমোরি ইউনিট।
- পুরো কাজটি ছিল ধীর ও খুবই টেকনিক্যাল।

> CPU = Register Set (ডেটা রাখে) + Processing Unit (ডেটা প্রসেস করে) এবং Processing Unit = ALU + Control Unit

## 💡 The Idea of Operating System

**🕰️ ১৯৪০ - ৫০ দশকে**, কম্পিউটারে প্রতিটি প্রোগ্রাম manually চালাতে হতো - punch card, আলাদা কোড, অনেক সময়।

**🎯 সমাধান :**

"একটা সফটওয়্যার থাকুক, যা প্রোগ্রাম চালানোসহ সব কাজ নিজে করবে" - এটাই Operating System।

প্রথম দিকে OS শুধু প্রোগ্রাম চালাত, পরে I/O, memory, file, security management যুক্ত হয়।

---

## ⚙️ OS এর Pointing Register (Program Counter) ব্যবহার করে Program Execution

💡 Pointing Register (Program Counter aka PC)

- CPU-র একটি register।
- পরবর্তী যেই instruction execute হবে, তার address রাখে।

### 👣 Program Execution Steps:

- Computer On -> OS প্রথমে HDD থেকে RAM এ Load হয়
- OS sets up -> Hardware, memory, File System ইত্যাদি
- একটি Program execute -> Click app icon
- OS সেই Program টি HDD থেকে খুঁজে বের করে এবং RAM এ লোড করে
- OS এরপর Pointing Register কে program এর first instruction address সেট করে দেয়
- CPU সেই address থেকে instruction -> fetch -> decode -> execute করতে শুরু করে

> ➡️ প্রতিটি Instruction শেষ হওয়ার পর, Pointing Register নিজে থেকেই পরবর্তী address update হয়। যদি কোনো loop, function call বা condition থাকে, তাহলে Pointing Register সেই অনুযায়ী নতুন address এ jump করে।

---

## 🧬 Evolution of Operating System

### 🕰️ **_Early Stages (1940s-1960s):_**

**🔹 1st Generation: Batch Processing Systems:**

- প্রথমদিকে কম্পিউটার OS ছাড়াই কাজ করত, প্রোগ্রাম manually load করতে হতো।
- _GM-NAA I/O_ (1956) ছিল **First Operating System**, যা `IBM 704` এর জন্য input/output ম্যানেজ করত।

**🔹 2nd Generation: Multiprogramming & Timesharing:**

- Multiprogramming: CPU একাধিক প্রোগ্রামের মাঝে কাজ ভাগ করে efficiency বাড়ায়।
- Time-sharing systems (যেমন: _CTSS_, _Multics_): একাধিক ব্যবহারকারী একসাথে কম্পিউটারের সাথে কাজ করতে পারে।

### 🖥️ **_The Rise of User-Friendly Interfaces (1970s-1990s)_**:

**🔹 3rd Generation: Graphical User Interfaces (GUIs)**
Apple Macintosh ও Microsoft Windows. Graphical User Interface (GUI) চালু করে, যা কম্পিউটারকে সহজ করে তোলে।

**🔹 Unix ও Personal Computers**

- Unix: সহজ, বহনযোগ্য ও multitasking সাপোর্টের জন্য জনপ্রিয়।
  - 🏛️ History:
    - 📅 1970 সালে _AT&T Bell Labs_ এ _Ken Thompson_ ও _Dennis Ritchie_ Unix তৈরি করেন।
    - 🧪 এটি **C programming language** ব্যবহার করে লেখা হয়, যা একে আরও বহনযোগ্য করে তোলে।
  - 📚 Unix থেকে জন্ম নেওয়া জনপ্রিয় OS:
    - Linux 🐧
    - Mac OS 🍎
    - BSD, Solaris ইত্যাদি
- _CP/M_, _PC-DOS_: ব্যক্তিগত কম্পিউটারের জন্য সহজ Operating System।

**🔹 Linux ও উন্নত GUI**

- Linux: Open source OS হিসেবে জনপ্রিয় হয়।

**🔹 Windows ও Mac OS**

- GUI আরও উন্নত করে।

### **_📱 Modern Era (2000s-Present)_**:

**🔹 Mobile & Cloud Computing**
iOS, Android: মোবাইল OS বাজারে আধিপত্য বিস্তার করে।

Cloud ও Virtualization প্রযুক্তি কম্পিউটিংকে নতুন রূপ দেয়।

**🔹 AI Integration**
AI, Machine Learning, Quantum Computing OS কে আরও বুদ্ধিমান ও অভিযোজিত করে তুলছে।

### 📌 Key Milestones:

| Year | Events                                                            |
| ---- | ----------------------------------------------------------------- |
| 1990 | **Windows 3.0** – GUI, computing experience এ ব্যাপক পরিবর্তন আনে |
| 1995 | **Windows 95** – Taskbar, Start Menu ও Plug-and-Play              |
| 2009 | **Windows 7** – Enhanced features, speed, and resource usage      |
| 2012 | **Windows 8** – Metro Interface, significant revamp               |

[**Author:** @nazma98
**Date:** 2025-06-09
**Category:** interview-qa/class-wise
]
