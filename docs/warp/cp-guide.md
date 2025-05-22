# 🧠 কম্পিটিটিভ প্রোগ্রামিং গাইড (CP Guide in Bengali)
> 📘 _এই গাইডটি তৈরি করা হয়েছে বাংলায় CP শেখার সুবিধার্থে। টেকনিক্যাল টার্ম এবং কোড ইংরেজিতে রাখা হয়েছে যাতে ইন্টারন্যাশনাল স্ট্যান্ডার্ড ফলো করা যায়।_

## 📅 Discord session content

| সেশন   | তারিখ      | আলোচনা করা টপিকস                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Instructor (Discord name) |
|--------|------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------|
| সেশন ১ | ২০২৫-০৫-০৫ | 1. প্রবলেম সলভিং আর CP-এর ফিলোসফি<br>2. কেন আমরা CP করবো?<br>3. The Right Problem Solving Mindset<br>4. Exercise vs Problem                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | popcycle                   |
| সেশন ২ | ২০২৫-০৫-০৭ | 1. Problem Solving mindset ঠিক করার দারুন কিছু উপায়<br>2. Strategy, tactics আর pattern চিনে নেওয়ার কৌশল<br>3. Mindset আর knowledge—দুটোরই importance<br>4. Basic math ভিত্তিক problem<br>5. Census-taker problem ও তার solution<br>6. কীভাবে একটা solid math foundation তৈরি করবেন                                                                                                                                                                                                                                                                                                    | popcycle                   |
| সেশন ৩ | ২০২৫-০৫-১২ | 1. কিছু Golang conceptual exercise<br>2. Basic Math problems in CP → GCD, LCM, Prime check, Divisor, Modulo math, Factorial<br>3. Live coding এবং Q&A session                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | popcycle                   |
| সেশন ৪ | ২০২৫-০৫-১৫ | 1. Nebula Clash 001 contest এর প্রব্লেম নিয়ে বিস্তারিত আলোচনা এবং upsolving<br>2. Problem Solving এর পিছনের idea, fastIO, concept এবং কিভাবে একটি problem approach করতে হয়<br>3. Problem solving এর জন্য সাধারণ কিছু math এবং algorithm                                                                                                                                                                                                                                                                                                                                                             | nayemul_islam              |
| সেশন ৫ | ২০২৫-০৫-১৭ | 1. Complexity জিনিসটা আসলে কি?<br>2. দুই ধরণের complexity : time complexity এবং memory complexity<br>3. কেন complexity সম্পর্কে ধারণা থাকটা important<br>4. CP তে complexity কীভাবে কাজে লাগে<br>5. কীভাবে complexity সম্পর্কে জানার মাধ্যমে আমরা একটি algorithm কতটুকু efficient সে সম্পর্কে ধারণা পেতে পারি<br>6. complexity প্রকাশ করার বিভিন্ন Notation (যেমন Big O, Big omega, Big theta)<br>7. কীভাবে Notation গুলো কাজ করে এবং কীভাবে এই notation গুলোর মাধ্যমে complexity হিসেব করা যায়?<br>8. Big O calculate করার বিভিন্ন rules<br>9. বিভিন্ন ধরণের time complexity (O(1), O(logn), O(n), O(nlogn), O(n^2) ইত্যাদি)<br>10. বিভিন্ন ধরণের memory complexity<br>11. Recursive function, nested loop, array declaration এর complexity | MArhamAA                   |
| সেশন ৬ | ২০২৫-০৫-১৯ | 1. Golang এ normal input এবং output method<br>2. `bufio` এবং `os` এর মাধ্যমে I/O handling<br>3. `.txt` file এবং অন্যান্য text file থেকে input এবং output handle করা<br>4. FastIO কি? buffered IO কেন fast?<br>5. buffer কি? buffered IO কীভাবে ভিতরে ভিতরে কাজ করে?<br>6. Buffered I/O vs unbuffered I/O<br>7. Buffered I/O inside Internal Memory<br>8. CP তে fastIO কেন necessary?                                                                                                                                                                                                                                                                         | popcycle                   |
| সেশন ৭ | ২০২৫-০৫-২১ | 1. BruteForce কি এবং কেন BruteForce দরকার?<br>2. প্রত্যেকটা problem কি BruteForce দিয়ে solve করা উচিত?<br>3. BruteForce নিয়ে কি প্রথমেই ভাবা উচিত? কেন?<br>4. বিভিন্ন ধরণের problem BruteForce দিয়ে solve করার উদাহরণ                                                                                                                                                                                                                                                                                                                                                                                                          | MArhamAA                   |



> 💡 নতুন সেশন যুক্ত হতে থাকবে সময় অনুযায়ী।

#### Exercises to Practice with Golang

- [ ] প্রিন্ট করুন: `"Hello World"`
- [ ] দুটি সংখ্যার যোগফল বের করুন
- [ ] If-Else দিয়ে Even/Odd চেক
- [ ] Loop দিয়ে ১ থেকে N পর্যন্ত প্রিন্ট করুন
- [ ] Function ব্যবহার করে দুই সংখ্যার গড় বের করুন
- [ ] [Vowel or Consonant](https://atcoder.jp/contests/abc049/tasks/abc049_a?lang=en) (dncpc1)
- [ ] [Restricted](https://atcoder.jp/contests/abc063/tasks/abc063_a?lang=en) (dncpc2)
- [ ] [Fitness](https://www.codechef.com/problems/FIT) (dncpc2)
- [ ] [Programming Education](https://atcoder.jp/contests/abc112/tasks/abc112_a?lang=en) (dncpc5)

> পরবর্তীতে আরও `exercise` add করা হবে। 
---

## Problem list 

#### Basic Mathematical problems 
1. [Timus 1000](https://acm.timus.ru/problem.aspx?space=1&num=1000)
2. [Timus 1409](https://acm.timus.ru/problem.aspx?space=1&num=1409)
3. [Project Euler 1](https://projecteuler.net/problem=1)
4. [Children and Candies](https://atcoder.jp/contests/abc043/tasks/abc043_a?lang=en) (dncpc1)
5. [Cloudberry Jams](https://codeforces.com/problemset/problem/2086/A) (dncpc1)
6. [Restuarant](https://atcoder.jp/contests/abc055/tasks/abc055_a?lang=en) (dncpc1)
7. [Hashmat the Brave warrior](https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=996)
8. [Between two integers](https://atcoder.jp/contests/abc061/tasks/abc061_a?lang=en) (dncpc2)
9. [Domino Piling](https://codeforces.com/problemset/problem/50/A) (dncpc2)
10. [Easy problem](https://codeforces.com/problemset/problem/2044/A) (dncpc3)
11. [Election go brrr](https://atcoder.jp/contests/abc366/tasks/abc366_a?lang=en) (dncpc3)
12. [A game of choice](https://codeforces.com/problemset/problem/959/A) (dncpc3)
13. [Sandglass](https://atcoder.jp/contests/abc072/tasks/abc072_a?lang=en) (dncpc3)
14. [Multiple of 2 and N](https://atcoder.jp/contests/abc102/tasks/abc102_a?lang=en) (dncpc4)
15. [Atocoder Crackers](https://atcoder.jp/contests/abc105/tasks/abc105_a?lang=en) (dncpc4)
16. [Soldier and Bananas](https://codeforces.com/problemset/problem/546/A) (dncpc4)
17. [Vasya and Socks](https://codeforces.com/problemset/problem/460/A) (dncpc4)
18. [Garden](https://atcoder.jp/contests/abc106/tasks/abc106_a?lang=en) (dncpc5)
19. [Clock Conversion](https://codeforces.com/problemset/problem/1950/C) (dncpc5)
20. [Plus Minus X](https://atcoder.jp/contests/abc137/tasks/abc137_a?lang=en) (dncpc6)



#### Beginner Friendly CP problems
21. [Weird Algorithm](https://cses.fi/problemset/task/1068)
22. [Concatenation of Array](https://leetcode.com/problems/concatenation-of-array/description/)
23. [Sakurako's Exam](https://codeforces.com/problemset/problem/2008/A)
24. [Fifty-Fifty](https://atcoder.jp/contests/abc132/tasks/abc132_a?lang=en) (dncpc6)
25. [Good Kid](https://codeforces.com/problemset/problem/1873/B) (dncpc6)
26. [Make it Big](https://toph.co/p/make-it-big) (dncpc6)
27. [Three Doors](https://codeforces.com/problemset/problem/1709/A) (dncpc6)



> পরবর্তীতে আরও প্রব্লেম এবং ক্যাটাগরি যুক্ত করা হবে। 
---

## 📘 Tips & Resources

> Important লিংকস আর রিসোর্স:

- 📚 [Competitive Programming Handbook - CSES](https://cses.fi/book/book.pdf)
- 🌐 [CP Algorithms](https://cp-algorithms.com/)
- 📊 [Big-O Cheat Sheet](https://www.bigocheatsheet.com/)
- 🧪 [CS50x Problem Sets](https://cs50.harvard.edu/x/2024/)
- 👀 [Blind 75](https://leetcode.com/discuss/post/460599/blind-75-leetcode-questions-by-krishnade-9xev/)
- [Fast I/O template for Golang](https://github.com/ifrunruhin12/gopher-grind-cp/blob/main/templates/base.go)
- [DSA Series by Shradha Ma'am](https://docs.google.com/spreadsheets/d/1mvlc8EYc3OVVU3X7NKoC0iZJr_45BL_pVxiJec0r94c/edit?gid=0#gid=0)


> _আস্তে আস্তে আরও resources যুক্ত করা হবে।_ 
---

## আমাদের যত previous contest

| No. | Contest type | Contest link |
|-----|--------------|--------------|
| 1.  | Daily       | [dncpc1](https://vjudge.net/contest/715404) |
| 2.  | Daily       | [dncpc2](https://vjudge.net/contest/715654) |
| 3.  | Daily       | [dncpc3](https://vjudge.net/contest/715880) |
| 4.  | Weekly      | [NC001](https://www.hackerrank.com/nebula-clash) |
| 5.  | Daily       | [dncpc4](https://vjudge.net/contest/717751) |
| 6.  | Daily       | [dncpc5](https://vjudge.net/contest/718350) |
| 7.  | Daily       | [dncpc6](https://vjudge.net/contest/718594) |

---

## কিভাবে এই guide ব্যাবহার করবেন 
1. প্রতিদিন discord এ দেওয়া exercises/problems গুলো solve করবেন।
2. নিয়মিত আমাদের session এবং contest গুলোতে participate করুন। 
3. সেশন লিস্ট নিয়মিত আপডেট করুন। 
4. বেশি problem solve করা উদ্দেশ্য নয়, বরং ভালোভাবে বুঝে problem solving করবেন। 
5. নিজের একটি github repo তৈরি করুন এবং এই guide এর problem solution গুলো সেখানে add করতে পারেন।
---

> _এই গাইডের সাথে থাকুন, নিজের প্রগ্রেস ট্র্যাক করুন, আর শেখা চালিয়ে যান!_

## Events (full term)
1. dncpc = Daily (Nebula-Clash) practice contest
2. NC = Nebula Clash 

[**Author:** @ifrunruhin12
**Date:** 2025-05-09
**Category:** docs/warp
]