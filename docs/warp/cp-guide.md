# 🧠 কম্পিটিটিভ প্রোগ্রামিং গাইড (CP Guide in Bengali)
> 📘 _এই গাইডটি তৈরি করা হয়েছে বাংলায় CP শেখার সুবিধার্থে। টেকনিক্যাল টার্ম এবং কোড ইংরেজিতে রাখা হয়েছে যাতে ইন্টারন্যাশনাল স্ট্যান্ডার্ড ফলো করা যায়।_

---

## 🚀 Intro

এই গাইডটি **Golang দিয়ে Competitive Programming শেখার জন্য** একটি সহজ পথপ্রদর্শক।  
আপনি যদি CP-তে নতুন হয়ে থাকেন বা Golang-কে CP-তে ব্যবহার করতে চান, তাহলে এই গাইড আপনার জন্যই! এখানে থাকছে:

- Easy থেকে Hard লেভেলের categorized problems
- Bengali explanation সহ curated exercises
- Community-made contest problems এবং revision list
- Golang-specific tips & fast I/O templates

---

## 🛠️ কিভাবে এই Guide ব্যাবহার করবেন

1. নিচে থাকা **Exercises** গুলো থেকে শুরু করুন Golang দিয়ে প্র‍্যাকটিস করতে।
2. তারপর Problem List অনুযায়ী প্রতিদিন ২-৩টা করে CP Problem solve করুন।
3. "Tag" দেখে বুঝে নিন কোনটা কোন contest/level এর অংশ।
4. “UID” ব্যবহার করে solution submit এবং discuss করুন BGCE server এ।
5. Extra Resource এবং Revision Topics অংশ ব্যাবহার করুন আপনার দক্ষতা বাড়ানোর জন্য।
6. আমাদের CP সেশনগুলোতে কি কি topic নিয়ে আলোচনা হয়েছে এবং কোন কোন topic আপনি নিজে নিজে practice করবেন তা জানতে [Discord CP session log](https://nesohq.github.io/bgce-archive/warp/cp-session-log.html) দেখুন। 
7. This is how we are moving forward [CP Roadmap](https://nesohq.github.io/bgce-archive/warp/roadmap.html)

---

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
- [ ] [Divide into 3](https://www.codechef.com/problems/DIVIDE3?tab=statement) (dncpc7) 

> পরবর্তীতে আরও `exercise` add করা হবে। 
---

## 🧮 Problem List

### 🔢 Basic Mathematical Problems

| #   | UID   | Title                         | Link                                                                 | Tag       |
|-----|-------|-------------------------------|----------------------------------------------------------------------|-----------|
| 1   | 4832  | Timus 1000                    | [Link](https://acm.timus.ru/problem.aspx?space=1&num=1000)           |           |
| 2   | 7940  | Timus 1409                    | [Link](https://acm.timus.ru/problem.aspx?space=1&num=1409)           |           |
| 3   | 1602  | Project Euler 1               | [Link](https://projecteuler.net/problem=1)                           |           |
| 4   | 2314  | Children and Candies          | [Link](https://atcoder.jp/contests/abc043/tasks/abc043_a?lang=en)   | dncpc1    |
| 5   | 6851  | Cloudberry Jams               | [Link](https://codeforces.com/problemset/problem/2086/A)            | dncpc1    |
| 6   | 9473  | Restuarant                    | [Link](https://atcoder.jp/contests/abc055/tasks/abc055_a?lang=en)   | dncpc1    |
| 7   | 5119  | Hashmat the Brave Warrior     | [Link](https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=996) |           |
| 8   | 8640  | Between Two Integers          | [Link](https://atcoder.jp/contests/abc061/tasks/abc061_a?lang=en)   | dncpc2    |
| 9   | 1208  | Domino Piling                 | [Link](https://codeforces.com/problemset/problem/50/A)              | dncpc2    |
| 10  | 3765  | Easy Problem                  | [Link](https://codeforces.com/problemset/problem/2044/A)            | dncpc3    |
| 11  | 9021  | Election Go Brrr              | [Link](https://atcoder.jp/contests/abc366/tasks/abc366_a?lang=en)   | dncpc3    |
| 12  | 1459  | A Game of Choice              | [Link](https://codeforces.com/problemset/problem/959/A)             | dncpc3    |
| 13  | 5184  | Sandglass                     | [Link](https://atcoder.jp/contests/abc072/tasks/abc072_a?lang=en)   | dncpc3    |
| 14  | 7804  | Multiple of 2 and N           | [Link](https://atcoder.jp/contests/abc102/tasks/abc102_a?lang=en)   | dncpc4    |
| 15  | 2691  | Atocoder Crackers             | [Link](https://atcoder.jp/contests/abc105/tasks/abc105_a?lang=en)   | dncpc4    |
| 16  | 4302  | Soldier and Bananas           | [Link](https://codeforces.com/problemset/problem/546/A)             | dncpc4    |
| 17  | 6789  | Vasya and Socks               | [Link](https://codeforces.com/problemset/problem/460/A)             | dncpc4    |
| 18  | 9032  | Garden                        | [Link](https://atcoder.jp/contests/abc106/tasks/abc106_a?lang=en)   | dncpc5    |
| 19  | 1025  | Clock Conversion              | [Link](https://codeforces.com/problemset/problem/1950/C)            | dncpc5    |
| 20  | 5671  | Plus Minus X                  | [Link](https://atcoder.jp/contests/abc137/tasks/abc137_a?lang=en)   | dncpc6    |
| 21  | 3421  | Square Year                   | [Link](https://codeforces.com/problemset/problem/2114/A)            | dncpc7    |

---

### 🔨 Brute Force Problems (Easy → Hard)

| UID   | Title                         | Link                                                                 | Tag       |
|-------|-------------------------------|----------------------------------------------------------------------|-----------|
| 4598  | Weird Algorithm               | [Link](https://cses.fi/problemset/task/1068)                         |           |
| 7334  | Concatenation of Array        | [Link](https://leetcode.com/problems/concatenation-of-array/description/) |        |
| 1019  | Sakurako's Exam               | [Link](https://codeforces.com/problemset/problem/2008/A)             |           |
| 0313  | Ilya and Bank Account         | [Link](https://codeforces.com/problemset/problem/313/A)              |           |
| 1676  | Equal Candies                 | [Link](https://codeforces.com/problemset/problem/1676/B)             |           |
| 8123  | Good Kid                      | [Link](https://codeforces.com/problemset/problem/1873/B)             | dncpc6    |
| 6831  | Three Doors                   | [Link](https://codeforces.com/problemset/problem/1709/A)             | dncpc6    |
| 9301  | Buy a Shovel                  | [Link](https://codeforces.com/problemset/problem/732/A)              | NC        |
| 9302  | Games                         | [Link](https://codeforces.com/problemset/problem/268/A)              | NC        |
| 9303  | IQ Test                       | [Link](https://codeforces.com/problemset/problem/25/A)               | NC        |
| 9304  | New Year and Hurry            | [Link](https://codeforces.com/problemset/problem/750/A)              | NC        |
| 9401  | Substring Problem             | [Link](https://atcoder.jp/contests/abc177/tasks/abc177_b)            | NC        |

---

### 🪙 Greedy Problems (Easy → Hard)

| UID   | Title                         | Link                                                                 | Tag       |
|-------|-------------------------------|----------------------------------------------------------------------|-----------|
| 5640  | Fifty-Fifty                   | [Link](https://atcoder.jp/contests/abc132/tasks/abc132_a?lang=en)    | dncpc6    |
| 9276  | Distance Table                | [Link](https://atcoder.jp/contests/abc411/tasks/abc411_b?lang=en)    | dncpc7    |
| 3915  | Sushi for Two                 | [Link](https://codeforces.com/problemset/problem/1138/A)             | dncpc7    |
| 9305  | Candies                       | [Link](https://codeforces.com/problemset/problem/1343/A)             | NC        |
| 9306  | Phoenix and Balance           | [Link](https://codeforces.com/problemset/problem/1348/A)             | NC        |
| 9307  | Turtle Puzzle                 | [Link](https://codeforces.com/problemset/problem/1933/A)             | NC        |
| 9308  | Park Lighting                 | [Link](https://codeforces.com/problemset/problem/1358/A)             | NC        |
| 9309  | Desorting                     | [Link](https://codeforces.com/problemset/problem/1853/A)             | NC        |

---

### 🔤 String Problems

| UID   | Title                         | Link                                                                 | Tag       |
|-------|-------------------------------|----------------------------------------------------------------------|-----------|
| 1295  | Find Numbers with Even Number of Digits | [Link](https://leetcode.com/problems/find-numbers-with-even-number-of-digits/) |       |
| 930A  | Two Substrings                | [Link](https://codeforces.com/problemset/problem/550/A)              | NC        |
| 930B  | Dreamoon and WiFi             | [Link](https://codeforces.com/problemset/problem/476/B)              | NC        |
| 930C  | Distinct Split                | [Link](https://codeforces.com/problemset/problem/1791/D)             | NC        |
| 9402  | Greedy Takahashi              | [Link](https://atcoder.jp/contests/abc149/tasks/abc149_b)            | NC        |
| 9403  | Festival                      | [Link](https://atcoder.jp/contests/abc322/tasks/abc322_c)            | NC        |

---

### 🔍 Binary Search / Two Pointers Problems

| UID   | Title                         | Link                                                                 | Tag       |
|-------|-------------------------------|----------------------------------------------------------------------|-----------|
| 930D  | Books                         | [Link](https://codeforces.com/problemset/problem/279/B)              | NC        |
| 930E  | Flipping Game                 | [Link](https://codeforces.com/problemset/problem/327/A)              | NC        |

---

### ⚡ Implementation / Ad-hoc Problems

| UID   | Title                         | Link                                                                 | Tag       |
|-------|-------------------------------|----------------------------------------------------------------------|-----------|
| 2047  | Make it Big                   | [Link](https://toph.co/p/make-it-big)                                | dncpc6    |
| 930F  | Constructive Problem          | [Link](https://codeforces.com/problemset/problem/2122/A)             | NC        |
| 930G  | Math Problem                  | [Link](https://codeforces.com/problemset/problem/2122/B)             | NC        |

---

### 📐 Geometry / Constructive Problems

| UID   | Title                         | Link                                                                 | Tag       |
|-------|-------------------------------|----------------------------------------------------------------------|-----------|
| 930H  | Cut Ribbon                    | [Link](https://codeforces.com/problemset/problem/189/A)              | NC        |
| 930I  | Towers                        | [Link](https://codeforces.com/problemset/problem/189/B)              | NC        |
| 930J  | Turtle Magic                  | [Link](https://codeforces.com/problemset/problem/193/E)              | NC        |

---

### 🔢 Math / Number Theory Problems

| UID   | Title                         | Link                                                                 | Tag       |
|-------|-------------------------------|----------------------------------------------------------------------|-----------|
| 930K  | Divisibility by Eight         | [Link](https://codeforces.com/problemset/problem/550/C)              | NC        |
| 930L  | Common Divisors               | [Link](https://codeforces.com/problemset/problem/182/D)              | NC        |
| 9404  | Next Prime                    | [Link](https://atcoder.jp/contests/abc149/tasks/abc149_c)            | NC        |
| 9405  | Factorial Yen Coin            | [Link](https://atcoder.jp/contests/abc208/tasks/abc208_b)            | NC        |

---


#### 🧩 Problems made by the community

| Problem Code | Problem Name & Link                                                                                                  | Author(Discord name)      |
|--------------|----------------------------------------------------------------------------------------------------------------------|-------------|
| 2101         | [সমান ভাগের রহস্য](https://www.hackerrank.com/contests/nebula-clash/challenges/challenge-5718)                     | popcycle    |
| 2102         | [চেস বোর্ডের সংকেত](https://www.hackerrank.com/contests/nebula-clash/challenges/challenge-5719)                     | popcycle    |
| 2103         | [একই হিরে দু’বার!](https://www.hackerrank.com/contests/nebula-clash/challenges/challenge-5720)                      | popcycle    |
| 2201         | [BGCE CP sessions](https://www.hackerrank.com/contests/nebula-clash-002/challenges/bgce-cp-sessions)                | popcycle    |
| 2202         | [Tai Lung’s Trial of Balance](https://www.hackerrank.com/contests/nebula-clash-002/challenges/mad-tai-lung)         | popcycle    |
| 2203         | [An Easy Problem : Revisited to Combination](https://www.hackerrank.com/contests/nebula-clash-002/challenges/an-easy-problem-revisited-to-combination) | toji        |
| 2204         | [Challenge to Kraken](https://www.hackerrank.com/contests/nebula-clash-002/challenges/challenge-to-kraken)          | toji        |
| 2205         | [Divisible Positive Subset](https://www.hackerrank.com/contests/nebula-clash-002/challenges/divisible-positive-subset) | MArhamAA |
| 2206         | [Yet Another LCS Problem](https://www.hackerrank.com/contests/nebula-clash-002/challenges/yet-another-lcs-problem-1) | MArhamAA |
| 3001  | [Kraken’s Patience (Easy Version)](https://www.hackerrank.com/contests/nebula-clash-003/challenges/krakens-patience-easy-version) | HasanMubin |
| 3002  | [Housing Crisis in Rentoria](https://www.hackerrank.com/contests/nebula-clash-003/challenges/housing-crisis-in-rentoria) | toji |
| 3003  | [Kraken’s Many Titles (Hard Version)](https://www.hackerrank.com/contests/nebula-clash-003/challenges/krakens-many-titles-hard-version) | HasanMubin |
| 3004  | [Chronicles of the Royal Scribe](https://www.hackerrank.com/contests/nebula-clash-003/challenges/chronicles-of-the-royal-scribe) | toji |
| 3005  | [Max Equal Sum](https://www.hackerrank.com/contests/nebula-clash-003/challenges/max-equal-sum)            | MArhamAA |
| 3006  | [Traveler Rigan](https://www.hackerrank.com/contests/nebula-clash-003/challenges/traveler-rigan)           | MArhamAA |





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
| 8.  | Weekly      | [NC002](https://www.hackerrank.com/contests/nebula-clash-002) |

---

> _এই গাইডের সাথে থাকুন, নিজের প্রগ্রেস ট্র্যাক করুন, আর শেখা চালিয়ে যান!_

## Events (full term)
1. dncpc = Daily (Nebula-Clash) practice contest
2. NC = Nebula Clash 

---

[**Author:** @ifrunruhin12
**Date:** 2025-05-09
**Category:** docs/warp
]