# 🧠 CPU Structure and Stack Frame Execution Notes

## 🔹 CPU: Two Core Components

1. **Processing Unit**

    - **Arithmetic Logic Unit (ALU)**: Performs all arithmetic and logical operations.
    - **Control Unit (CU)**: Directs operations within the CPU; controls input/output and instruction decoding.

2. **Register Set**
    - **Program Counter (PC)**: Holds the address of the next instruction to be executed.
    - **Stack Pointer (SP)**: Points to the top of the current stack in memory.
    - **Base Pointer (BP)**: Points to the base of the current function stack frame.
    - **Instruction Register (IR)**: Holds the currently executing instruction.
    - **General Purpose Registers**: For temporary data manipulation.

---

## 🔹 Bits and Bytes

-   **8-bit = 1 byte**
-   **32-bit = 4 bytes**
-   **64-bit = 8 bytes**

Memory addressing = \( 2^n \)

---

## 🔹 RAM Addressing on 32-bit System

Memory cells increase by 4 bytes (since 32-bit = 4 bytes):

```
Address:  0   4   8  12  16  20  24  ...
         [ ] [ ] [ ] [ ] [ ] [ ] [ ]
```

---

## 🔹 OS, RAM, and Process Execution

1. **OS pulls executable code** from HDD → loads into **RAM**
2. **OS creates a process**
3. **RAM segments the process memory into:**
    - Code Segment (for constants and instructions)
    - Data Segment (for global/static variables)
    - Stack (for function calls and local variables)
    - Heap (for dynamically allocated memory)

---

## 🔹 Stack Frame in Function Call

-   The OS sets up **SP** and **BP**.
-   **SP < BP** (SP points lower in memory).

### Stack Frame Layout:

```
[ Local Variables        ]   <-- SP (grows downward)
[ Old Base Pointer       ]
[ Return Address         ]
[ Parameters (right→left)]   <-- BP
```

-   **Return Address** is typically at `BP + 4`, `+8`, `+16`, etc.
-   Using **BP**, the CPU can easily access:
    -   Function parameters
    -   Return address
    -   Local variables

---

## 🔹 Stack Frame Exit

-   Stack frame pops:
    -   Local variables
    -   Old BP is restored
    -   SP is reset
    -   Execution jumps to Return Address

### Final Condition:

```
BP == SP  => Stack Frame Closed
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

-   CPU is divided into **Processing Unit** and **Register Set**
-   The **Stack Frame** is key to function call handling
-   **Base Pointer (BP)** acts as a fixed reference point
-   **Stack Pointer (SP)** moves during function execution
-   **Returning** from a function resets **BP** and **SP**

---

> Understanding stack frames is essential for debugging, compiler design, and low-level programming.
