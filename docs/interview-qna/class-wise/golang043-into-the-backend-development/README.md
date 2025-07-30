
# 🌐 Into The Backend Development

---

## 🧱 Static Era of Web Development (Web 1.0)

### 🔹 সময়কাল: Early 1990s
- এই সময়কে Web 1.0 বলা হয়।
- website ছিল একদম Static HTML ফাইলগুলো পূর্বে তৈরি করে সার্ভারে রাখা হতো।

### 💡 কীভাবে কাজ করতো:
- User যখন একটি webpage চায়, তখন browser server একটি request পাঠাতো।
- server সেই HTML ফাইলকে   ইউজারের browser এ পাঠিয়ে দিতো।
- কোনও dynamic content বা user interaction ছিল না।

### 🖥️ Server কী?
Server একটি কম্পিউটার যেটি নেটওয়ার্কের মাধ্যমে ইউজারের অনুরোধে webpage বা data serve করে।

---

## ⚙️ Web 2.0 & Server Side Rendering

### 🔹 সময়কাল: Mid 1990s - Early 2000s

- Web 2.0 সময়কালে web dynamic হয়ে উঠল।
- এখন backend থেকে dynamically generated HTML, CSS পাঠানো শুরু হল।

### ✨ Backend Programming Language:
- এই সময়ে জনপ্রিয় কিছু ভাষা ছিল:
  - PHP
  - Java
  - ASP.NET
  - Python

---

## ⚡ The AJAX Revolution (2005 - 2010)

### 🔄 AJAX কী?
AJAX (Asynchronous JavaScript and XML) এর মাধ্যমে browser, page reload না করেই server এর সাথে data আদান-প্রদান করতে পারে।

### 🔸 API ব্যবহার বাড়ে:
- AJAX এর মাধ্যমে API-এর গুরুত্ব বাড়ে এবং API endpoint ব্যবহার শুরু হয়।

### 🔹 API Endpoint কী?
API endpoint হল সার্ভারে নির্দিষ্ট একটি URL যেটি ডেটা রিসিভ বা রিটার্ন করার জন্য ব্যবহৃত হয়।

### 🕰️ আগের সময়ের তুলনা:
- AJAX আসার আগে: ইউজারের অনুরোধে পুরো পেইজ রিলোড হতো।
- AJAX আসার পরে: শুধুমাত্র প্রয়োজনীয় ডেটা JSON আকারে পাঠানো শুরু হয়।

### 📌 Backend Development এর প্রসার:
- এই সময় থেকে backend বিশেষভাবে important হয়ে ওঠে  API design, authentication, data processing ইত্যাদি কাজ শুরু হয়।

---

## 🔄 REST API & JSON (2010)

### 👨‍🔬 REST-এর জনক:
- Dr. Roy Fielding
- REST ধারণা দেন 2000 সালে তার PhD ডিসার্টেশনে।

### 📖 REST এর পূর্ণরূপ:
**Representational State Transfer**

### 📐 REST কী?
REST হচ্ছে একটি software architectural style বা blueprint, যেটা API বানানোর সময় অনুসরণ করা হয়।

---

## 🧠 REST Concepts

### 📌 Representational মানে কী?
Representation বলতে বোঝায়  resource এর state কে কিভাবে প্রকাশ করা হচ্ছে।

> উদাহরণ: JSON, XML, YAML, HTML ইত্যাদি

---

### 📦 Resource & State

#### 🔹 Resource:
Resource হচ্ছে একটি entity বা ধারণা (concept)  যেমন: `user`, `post`

- `user` বলতে আমরা বুঝি একজন মানুষ, কিন্তু কে সে সেটা আমরা জানি না।
- `post` বলতে আমরা বুঝি একটি কনটেন্ট, কিন্তু কী পোস্ট করা হয়েছে জানি না।

#### 🔹 State:
Resource-এর বর্তমান অবস্থা বা condition হলো state।

**উদাহরণ:**
```json
User:
{
  "id": 42,
  "name": "Shahriar",
  "age": 20
}

Post:
{
  "id": 42,
  "title": "Into the backend development",
  "author": "Shahriar"
}
```

> যখন আমরা এই data-কে JSON এর মতো ফরম্যাটে প্রেজেন্ট করি, তখন সেটিকে বলে Representational State

---

## 🔁 Transfer কী?
Client যখন কোনও resource চায়, তখন server সেই resource এর state কে JSON বা অন্য ফরম্যাটে represent করে পাঠায়। এটিই হল Representational State Transfer (REST)।

---

## 🔍 REST vs RESTful

| ধরন | বর্ণনা |
|------|--------|
| REST | একধরনের design principle বা blueprint |
| RESTful | এমন একটি API বা সার্ভিস যা REST এর principles অনুসরণ করে |

একটি RESTful service অনেকগুলি REST API নিয়ে গঠিত হয়।

---

## 🧰 What is API?

API (Application Programming Interface) হলো এমন একটি ইন্টারফেস যা দুটি সফটওয়্যারের মধ্যে যোগাযোগ করে।

### 💬 Frontend ও Backend কিভাবে কথা বলে?
Frontend এবং Backend API-এর মাধ্যমে একে অপরের সাথে যোগাযোগ করে।

> উদাহরণস্বরূপ, user form পূরণ করে submit করলে, তা backend API-এর মাধ্যমে প্রক্রিয়াজাত হয় এবং ফলাফল ফিরিয়ে আনা হয়।

[Author : @shahriar-em0n  Date: 2025-07-30 Category: interview-qa/class-wise ]