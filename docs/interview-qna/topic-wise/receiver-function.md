[**Author:** @mdimamhosen, @mahabubulhasibshawon
**Date:** 2025-04-22
**Category:** interview-qa/Receiver Function
**Tags:** [go, Receiver Function]
]


# 📦 Go-তে Receiver Function

Go-তে একটি receiver function হল এমন একটি মেথড যা একটি নির্দিষ্ট টাইপের—সাধারণত struct-এর সাথে যুক্ত থাকে। এটি user-defined টাইপে মেথড সংজ্ঞায়িত করার মাধ্যমে object-oriented আচরণ বাস্তবায়ন করতে সাহায্য করে।

---

## 🧱 Struct এবং Receiver বেসিকস

### Struct Definition

```go
// User struct with basic fields
type User struct {
	Name string
	Age  int
}
```

---

## 📞 Regular Function বনাম Receiver Function

### Regular Function

```go
func printUser(user User) {
	fmt.Println("User Name:", user.Name)
	fmt.Println("User Age:", user.Age)
}
```

এটি একটি স্ট্যান্ডঅ্যালোন ফাংশন যা `User` প্যারামিটার হিসেবে গ্রহণ করে।

### Value Receiver Method

```go
func (u User) printDetails() {
	fmt.Println("Name:", u.Name)
	fmt.Println("Age:", u.Age)
}
```

এখানে, `printDetails()` মেথডটি `User` টাইপের সাথে value receiver হিসেবে যুক্ত। এটি একটি কপির উপর কাজ করে, তাই মূল ডেটা পরিবর্তন হয় না।

### Pointer Receiver Method

```go
func (u *User) updateAge(newAge int) {
	u.Age = newAge
}
```

এই মেথডটি মূল `User` struct-কে পরিবর্তন করে কারণ এটি pointer receiver ব্যবহার করছে।

---

## ✅ Main Function সহ ব্যবহার

```go
func main() {
	user1 := User{Name: "John", Age: 30}
	user2 := User{Name: "Jane", Age: 25}

	// Regular function call
	printUser(user1)

	// Receiver function calls
	user1.printDetails()
	user2.printDetails()

	// Update age using pointer receiver
	user1.updateAge(35)
	fmt.Println("Updated Age of user1:", user1.Age)

	// Demonstrate value receiver (no change to original)
	user2.call(100)
	fmt.Println("User2's age after call():", user2.Age)
}
```

---

## 🔍 অতিরিক্ত Receiver Method

```go
// Value receiver that does not affect original struct
func (u User) call(age int) {
	u.Age = age
	fmt.Println("Inside call() - temporary age:", u.Age)
}
```

এটি আসল `User.Age` পরিবর্তন করবে না, শুধুমাত্র অস্থায়ী মান দেখাবে।

---

## 🧪 Example Output

```
User Name: John
User Age: 30
Name: John
Age: 30
Name: Jane
Age: 25
Updated Age of user1: 35
Inside call() - temporary age: 100
User2's age after call(): 25
```

---

## 💡 মূল পয়েন্টসমূহ

* ✅ Value receivers শুধুমাত্র পড়ার জন্য কার্যকর।
* ✅ Pointer receivers ব্যবহার করা হয় যখন আসল ডেটা পরিবর্তন করতে হয়।
* ✅ Go object-এর মতো আচরণ সমর্থন করে receiver function-এর মাধ্যমে।
* ✅ Pointer receiver দিয়ে লেখা মেথড struct-এর value বা pointer—দুই অবস্থায়ই কল করা যায়।

## 10টি ইন্টারভিউ প্রশ্ন ও উত্তর

1. **Go-তে receiver function কী?**

   * একটি মেথড যা একটি নির্দিষ্ট টাইপের সাথে যুক্ত থাকে, এবং struct বা অন্য টাইপের উপর মেথড সংজ্ঞায়িত করতে সাহায্য করে।

2. **Value receiver ও Pointer receiver-এর মধ্যে পার্থক্য কী?**

   * Value receiver একটি অবজেক্টের কপির উপর কাজ করে, আর Pointer receiver আসল অবজেক্টের উপর কাজ করে ও সেটি পরিবর্তন করতে পারে।

3. **একই টাইপের জন্য কি একাধিক receiver function সংজ্ঞায়িত করা যায়?**

   * হ্যাঁ, একই টাইপের জন্য একাধিক receiver function সংজ্ঞায়িত করা যায়।

4. **Receiver function সংজ্ঞায়নের সিনট্যাক্স কী?**

   * `func (receiverType TypeName) methodName(parameters) {}`

5. **Built-in টাইপের জন্য কি receiver function ব্যবহার করা যায়?**

   * না, receiver function শুধুমাত্র user-defined টাইপের জন্যই সংজ্ঞায়িত করা যায়।

6. **Pointer-এ call করা হলে Value receiver কিভাবে কাজ করে?**

   * Go স্বয়ংক্রিয়ভাবে pointer dereference করে, তাই ফাংশনটি ঠিকভাবে কাজ করে।

7. **Receiver function-এর উদ্দেশ্য কী?**

   * টাইপের সাথে মেথড সংযুক্ত করে object-oriented programming এর সুবিধা দেয়।

8. **Receiver function কি আসল অবজেক্ট পরিবর্তন করতে পারে?**

   * শুধুমাত্র তখনই পারে, যদি pointer receiver ব্যবহার করা হয়।

9. **Regular function ও Receiver function-এর মধ্যে পার্থক্য কী?**

   * Regular function কোনো টাইপের সাথে যুক্ত নয়, কিন্তু Receiver function একটি নির্দিষ্ট টাইপের সাথে যুক্ত থাকে।

10. **Interfaces-এর সাথে কি Receiver function ব্যবহার করা যায়?**

    * হ্যাঁ, Receiver function প্রায়ই Interface মেথড ইমপ্লিমেন্ট করতে ব্যবহৃত হয়।

## Example Output

```
User Name: John
User Age: 30
User Name: Jane
User Age: 25
User Age: 10
User Age: 20
```
