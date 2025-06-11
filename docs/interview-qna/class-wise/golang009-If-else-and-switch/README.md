 # Class 09 : If else and switch

Go তে কন্ডিশনাল স্টেটমেন্ট ব্যবহৃত হয় সিদ্ধান্ত নেওয়ার জন্য। নিচে `if`, `else if`, `else`, এবং `switch` এর বিস্তারিত ব্যাখ্যা এবং উদাহরণ দেওয়া হলো।

---

## ✅ if Statement

```go
package main
import "fmt"

func main() {
    number := 10
    if number > 5 {
        fmt.Println("Number is greater than 5")
    }
}
```

>যদি `if` এর স্টেটমেন্ট সত্য হয়, তবে ব্লকের ভিতরের কোড এক্সিকিউট হবে।

---

## ✅ if-else Statement

```go
package main
import "fmt"

func main() {
    number1 := 3
    if number1 > 5 {
        fmt.Println("Greater than 5")
    } else {
        fmt.Println("5 or less")
    }
}
```

>যদি `if` এর স্টেটমেন্ট মিথ্যা হয়, তাহলে `else` ব্লকের কোড এক্সিকিউট হবে |

---

## ✅ if,else if, else Statement

```go
package main
import "fmt"

func main() {
    package main
import "fmt"

func main() {
    age := 18 // বয়স ১৮ সেট করা হয়েছে

    if age > 18 {
        // যদি বয়স ১৮ এর বেশি হয়, তাহলে নিচের মেসেজ দেখা যাবে
        fmt.Println("You are eligible to be married") // প্রাপ্তবয়স্ক, বিয়ের জন্য উপযুক্ত
    } else if age < 18 {
        // যদি বয়স ১৮ এর কম হয়, তাহলে এই অংশ এক্সিকিউট হবে 
        fmt.Println("You are not eligible to be married, but you can love someone") // নাবালক, প্রেম করা যেতে পারে
    } else if age == 18 {
        // যদি বয়স একদম ১৮ হয়, তাহলে এই অংশ এক্সিকিউট হবে
        fmt.Println("You are just a teenager, not eligible to be married") // টিনএজার, বিয়ের জন্য ঠিক উপযুক্ত না
    }
}

}
```

>একাধিক স্টেটমেন্ট চেক করার জন্য `else if` ব্যবহার করা হয় | উপরের কোডে বয়স অনুসারে তিনটি ভিন্ন রেসপন্স দেখানো হয়েছে।

---

## 🔁 switch Statement

```go
package main
import "fmt"

func main() {
    day := 3 // day ভ্যারিয়েবলটি ৩ দেওয়া হয়েছে

    switch day {
    case 1:
        fmt.Println("Sunday") // যদি day == 1 হয়, তাহলে Sunday প্রিন্ট হবে
    case 2:
        fmt.Println("Monday") // যদি day == 2 হয়, তাহলে Monday প্রিন্ট হবে
    case 3:
        fmt.Println("Tuesday") // যদি day == 3 হয়, তাহলে Tuesday প্রিন্ট হবে
    default:
        fmt.Println("Another day") // যদি কোন case না মিলে , তাহলে default অংশে চলে যাবে 
    }
}
```

>`switch` স্টেটমেন্ট অনেকগুলো `if-else if` কে রিপ্লেস করতে পারে এবং কোডকে cleaner করে তোলে। এটি একটি নির্দিষ্ট ভ্যালুর উপর ভিত্তি করে বিভিন্ন আউটপুট দেয়।

---

## ⚠️ Note:
- Go তে `if` এবং `switch` ব্লকে ব্র্যাকেট `{}` আবশ্যক।
- `switch` ব্লকে প্রতিটি case এর পরে `break` লিখতে হয় না, কারণ Go নিজেই implicity break করে দেয়, যদি না `fallthrough` ব্যবহার করা হবে |

[Author : @shahriar-em0n  Date: 2025-06-11 Category: interview-qa/class-wise ]
