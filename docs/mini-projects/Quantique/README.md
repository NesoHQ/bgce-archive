[**Author:** @mdimamhosen
**Date:** 2025-04-23
**Category:** e.g., mini-projects/Quantique
**Tags:** [go, Quantique, mini-projects]
]

# 🔁 Quantique - Unit Converter CLI

**Quantique** is a beautiful CLI-based Unit Converter written in Go.  
Easily convert between popular units with a modern, stylish terminal interface using `box-cli-maker` and `fatih/color`.

---

## 🚀 Features

- ✅ Convert:
  1. Meters ⇌ Feet
  2. Feet ⇌ Meters
  3. Celsius ⇌ Fahrenheit
  4. Fahrenheit ⇌ Celsius
  5. Kilograms ⇌ Pounds
  6. Pounds ⇌ Kilograms
- 🎨 Elegant terminal UI with colors and box layout
- 🔁 Seamless interactive loop with graceful exit

---

## 📦 Dependencies

Make sure you have [Go](https://golang.org/dl/) installed.

Initialize a Go module and install the required libraries:

```bash
go mod init quantique
go get github.com/fatih/color
go get github.com/Delta456/box-cli-maker/v2
```

---

## 🛠️ How to Run

```bash
go build quantique.go
```

```bash
./quantique.exe
```

---

## 📸 CLI Preview

```
╔════════════════════════════════════════════════════╗
║                     UNIT CONVERTER                ║
║  Convert Meters ⇌ Feet | Celsius ⇌ Fahrenheit     ║
║          | Kilograms ⇌ Pounds                     ║
╚════════════════════════════════════════════════════╝
```

---

## 📁 File Structure

```
Quantique/
├── go.mod
├── go.sum
└── main.go
```

---

## 🤝 A Note from the Author

A small contribution to the incredible Best GoLang Community Ever
