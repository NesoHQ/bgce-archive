# 🧠 CPU Structure and Stack Frame Execution Notes

## 🔹 CPU: Two Core Components

1. **Processing Unit**

   - **Arithmetic Logic Unit (ALU)**: সব ধরনের গাণিতিক (arithmetic) এবং যৌক্তিক (logical) operations করে থাকে।
   - **Control Unit (CU)**: CPU এর মধ্যে গাণিতিক (arithmetic) এবং যৌক্তিক (logical) operations পরিচালনা করে, input/output এবং instruction decoding কীভাবে হবে তা কন্ট্রোল করে।

2. **Register Set**
   - **Program Counter (PC)**: পরবর্তীতে যেই Instruction টি execute হবে তার address ধারণ করে ।
   - **Stack Pointer (SP)**: মেমরিতে বর্তমানে যে stack আছে তার Top কে point করে।
   - **Base Pointer (BP)**: বর্তমান stack frame এর base কে point করে।
   - **Instruction Register (IR)**: এই মুহূর্তে যে instruction টি execute হচ্ছে সেটি রাখে।
   - **General Purpose Registers**: Data manipulation যেমন arithmetic ও logical operation এবং data movement এর জন্য অস্থায়ীভাবে data রাখে।

---

## 🔹 Bits and Bytes

- **8-bit = 1 byte**
- **16-bit = 2 bytes**
- **32-bit = 4 bytes**
- **64-bit = 8 bytes**

Memory addressing = \( 2^n \)

---

## 🔹 RAM Addressing on 32-bit System

Memory cell 4 bytes করে বাড়তে থাকে। (since 32-bit = 4 bytes):

```
Address:  0   4   8  12  16  20  24  ...
         [ ] [ ] [ ] [ ] [ ] [ ] [ ]
```

---

## 🔹 OS, RAM, and Process Execution

1. **OS executable code আনে** HDD থেকে → **RAM** এ লোড করে
2. **OS একটি process create করে**
3. **RAM process memory কে কয়েকটি ভাগে ভাগ করে:**

- Code Segment (constants এবং instructions এর জন্য)
- Data Segment (global/static variables এর জন্য)
- Stack (function calls এবং local variables এর জন্য)
- Heap (dynamically memory allocate করার জন্য)

---

## 🔹 Stack Frame in Function Call

- OS, **SP** এবং **BP** set করে দেয়।
- **SP** < **BP** ( SP memory তে lower address কে point করে)।

### Stack Frame Layout:

```
[ Local Variables        ]   <-- SP (grows downward)
[ Old Base Pointer       ]
[ Return Address         ]
[ Parameters (right→left)]   <-- BP
```

- **Return Address** সাধারণত রাখা হয় `BP + 4` (32 bit computer), `BP + 8` (64 bit computer) etc. ( Base pointer এর ঠিক উপরে )
- **BP** ব্যবহার করে CPU সহজেই যা access করতে পারে:
  - Function parameters
  - Return address
  - Local variables

---

## 🔹 Stack Frame Exit

- Stack frame যা pop করে (সরিয়ে ফেলে):
  - Local variables
  - Old BP value register set এর BP তে restore হয়
  - SP reset হয়
  - Execution, Return Address কে follow করে সেখানে jump করে

### Final Condition:

```
BP == SP  => Stack Frame Close হয়ে যায়
```

---

## 🧭 Diagram: Stack Frame Example (32-bit)

```plaintext
Memory Address ↓

+----------------------+  <- BP
| Parameter 1          |
+----------------------+
| Parameter 2          |
+----------------------+
| Return Address       | <- BP + 4
+----------------------+
| Old Base Pointer     | <- BP + 8
+----------------------+
| Local Variable A     | <- SP
+----------------------+

Stack grows downward ↓
```

---

## ✅ Summary

- CPU mainly **Processing Unit** এবং **Register Set** এ বিভক্ত।
- **Stack Frame** function call handling এর জন্য responsible থাকে।
- **Base Pointer (BP)** একটি fixed reference point হিসেবে কাজ করে।
- **Stack Pointer (SP)** function execution এর সময় move করতে থাকে।
- একটি function **Return** করলে **BP** এবং **SP** reset হয়ে যায়।

---

> debugging, compiler design, এবং low-level programming এর জন্য stack frames বুঝা অত্যন্ত প্রয়োজনীয়।
