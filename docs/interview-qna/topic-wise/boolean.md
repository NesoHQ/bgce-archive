[**Author:** @mdimamhosen, @n8fury
**Date:** 2025-04-19
**Category:** interview-qa/boolean
**Tags:** [go, boolean, data-types]
]

# একটি boolean data-type হয় "TRUE" অথবা "FALSE" হতে পারে

```go
package main
import "fmt"
func main() {
 isGolangPL := true
 isHtmlPL := false
 fmt.Println(isGolangPL)
 fmt.Println(isHtmlPL)
}
```

## Frequently Asked Questions

### Q1: conditional statement এ boolean value কিভাবে ব্যবহার করব?

**উত্তর:** Boolean value সাধারণত conditional statement এ program এর flow control করার জন্য ব্যবহার করা হয়। উদাহরণ:

```go
package main
import "fmt"
func main() {
 isEven := true
 if isEven {
  fmt.Println("The number is even.")
 } else {
  fmt.Println("The number is odd.")
 }
}
```

### Q2: boolean value গুলো কি সরাসরি compare করা যায়?

**উত্তর:** হ্যাঁ, boolean value গুলো comparison operator ব্যবহার করে সরাসরি compare করা যায়। উদাহরণ:

```go
package main
import "fmt"
func main() {
 isTrue := true
 isFalse := false
 fmt.Println(isTrue == isFalse) // আউটপুট: false
 fmt.Println(isTrue != isFalse) // আউটপুট: true
}
```
