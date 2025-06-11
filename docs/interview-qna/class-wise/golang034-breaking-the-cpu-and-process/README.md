# Class-34 : 🧩 Breaking The CPU and Process

## 🧠 Central Processing Unit (CPU)

- **The brain of the computer**
- Process instructions

CPU এর ২টি প্রধান অংশ হলো:

**1. Processing Unit (PU)**

- Arithmetic Logic Unit(ALU) + Control Unit(CU) থাকে।

**2. Register Set**

- Data ও Instructions সাময়িক রাখা হয়।
- Processing Unit এর কাজ সহজ করতে সাহায্য করে।

## 🔹 Register Set

| রেজিস্টার নাম                 | পূর্ণরূপ / বর্ণনা     | কাজের ধরন                                    |
| ----------------------------- | --------------------- | -------------------------------------------- |
| **SP**                        | Stack Pointer         | stack এর Top কে point করে                    |
| **BP**                        | Base Pointer          | Stack frame এর base কে point করে             |
| **IR**                        | Instruction Register  | বর্তমানে execute হওয়া instruction রাখে       |
| **PC**                        | Program Counter       | পরবর্তী instruction address ধরে রাখে         |
| **General Purpose Registers** | (যেমন AX, BX, CX, DX) | Data transfer, calculation ইত্যাদিতে ব্যবহৃত |

### 🗄️ General Purpose Registers

| Register | Size  | Description        | Typical Use                                                      |
| -------- | ----- | ------------------ | ---------------------------------------------------------------- |
| AL       | 8-bit | Lower 8 bits of AX | store data during arithmetic, logic, or data transfer operations |
| BL       | 8-bit | Lower 8 bits of BX | General-purpose data storage                                     |
| CL       | 8-bit | Lower 8 bits of CX | Loop counters, shift/rotate counts                               |
| DL       | 8-bit | Lower 8 bits of DX | I/O operations, data storage                                     |

### 🧮 Registers AL, BL, CL, DL in x86 Architecture

AL, BL, CL, এবং DL respective general-purpose register এর lower 8 bits কে represent করে। CPU architecture এর ওপর ভিত্তি করে এগুলো 16-bit, 32-bit, এবং 64-bit হয়।

| 8-bit | 16-bit | 32-bit | 64-bit | Description                                          |
| ----- | ------ | ------ | ------ | ---------------------------------------------------- |
| AL    | AX     | EAX    | RAX    | **Accumulator register family**                      |
| BL    | BX     | EBX    | RBX    | **Base register family**                             |
| CL    | CX     | ECX    | RCX    | **Count register family** _(used for loops, shifts)_ |
| DL    | DX     | EDX    | RDX    | **Data register family**                             |

---

### 🏛️ Register Hierarchy

| Register | 64-bit part | 32-bit part | 16-bit part | 8-bit high | 8-bit low |
| -------- | ----------- | ----------- | ----------- | ---------- | --------- |
| RAX      | RAX         | EAX         | AX          | AH         | AL        |
| RBX      | RBX         | EBX         | BX          | BH         | BL        |
| RCX      | RCX         | ECX         | CX          | CH         | CL        |
| RDX      | RDX         | EDX         | DX          | DH         | DL        |

---

## ⚙️ Control Unit (CU) executes a program stored on a HDD

### 💾 Program যখন HDD এ থাকে

- Program file → HDD এ থাকে
- Direct access → Slow

### ⚡ RAM এ Load

- Operating System → Program, HDD থেকে RAM এ নিয়ে আসে → _Program Load_ / _Fetch_

### 🚀 Execution শুরু

- Control Unit (CU) → RAM থেকে Program এর First memory address নেয়
- memory address → Program Counter (PC) এ set করা হয়

### 📥 CU RAM থেকে Instruction Fetch

- CU → PC থেকে memeory address নিয়ে RAM থেকে Instruction fetch করে
- Instruction → Instruction Register (IR) এ store হয়

### ⚙️ Decode & Execute

- CU → IR এর Instruction কে Decode করে
- CU → ALU/অন্যান্য ইউনিটকে কাজ করতে নির্দেশ দেয়
- PC → পরের Instruction memory address update হয়

---

## ⚙️ Go Program Execution Flow by CPU

### 🧠 Go প্রোগ্রাম রান

- `go run main.go` → Go compiler → binary executable file
- CPU, load এবং execute করে → binary executable file

### 📦 Memory Division

- `Code Segment` → `const`, `func` / instructions (যা পরিবর্তন হবে না / Read only)
- `Data Segment` → global variable
- `Stack` → function calls & local variable
- `Heap` → dynamic memory

### 🧱 Stack Frame

`main()` (বা অন্য কোনো function) call হলে Stack Frame create হয়। Stack Frame এ থাকে:

- Local variables (`a := 10`)
- Return address (function শেষে কোথায় return)
- Function parameters (যদি থাকে)
- Saved registers (CPU registers)

### 📊 Stack Frame Structure

```plaintext
↑ Higher memory address
---------------------
| Return Address    | ← main() call
--------------------
| Old Base Pointer  | ← BP
--------------------
| Local variable y  |
| Local variable x  | ← SP (grows downwards)
--------------------
↓ Lower memory address

```

Stack pointer (SP) এবং Base pointer (BP) হল CPU registers, যা stack frame manage করতে ব্যবহৃত হয়।

## 💡 Process

- Program execution শুরু হলে → process create হয়
- Process → Program execution সাহায্য করে
- এর ভেতরে থাকে → Code Segment, Data Segment, Stack, Heap, এবং CPU রেজিস্টার
- Process **Dead** বা **Terminated** → OS সমস্ত memory ও resources (RAM, file, etc.) free করে

        | অংশ                  |
        | -------------------- |
        | Code Segment         |
        | Data Segment         |
        | Heap                 |
        | Stack                |
        | Registers            |
        | Program Counter (PC) |
        | File Descriptors     |

[**Author:** @nazma98
**Date:** 2025-06-11
**Category:** interview-qa/class-wise
]
