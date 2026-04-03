# Sample Events for Axon Notification Service

This file contains sample event payloads for testing the Axon notification service.

## User Registered

Sent when a new user registers.

```json
{
  "type": "user.registered",
  "payload": {
    "user_id": 123,
    "email": "your-mail@example.com",
    "name": "Arman Ruhit"
  }
}
```

## Password Reset Requested

Sent when user requests password reset.

```json
{
  "type": "password.reset.requested",
  "payload": {
    "user_id": 123,
    "email": "your-mail@example.com",
    "token": "a1b2c3d4e5f6g7h8i9j0"
  }
}
```

## Email Verification Requested

Sent when user needs to verify email.

```json
{
  "type": "email.verification.requested",
  "payload": {
    "user_id": 123,
    "email": "your-mail@example.com",
    "token": "verify-token-12345"
  }
}
```

## Comment Reply Created

Sent to post author when someone replies to their post.

```json
{
  "type": "comment.reply.created",
  "payload": {
    "post_author_id": 456,
    "post_author_email": "your-mail@example.com",
    "commenter_name": "John Doe",
    "post_title": "Getting Started with Go",
    "comment": "Great post! I found the section on channels really helpful for understanding concurrent programming."
  }
}
```

## Post Published

Sent to followers when an author publishes a post.

```json
{
  "type": "post.published",
  "payload": {
    "author_name": "Arman Ruhit",
    "post_title": "Advanced Go Concurrency Patterns",
    "post_slug": "advanced-go-concurrency",
    "followers": [
      {
        "id": 1,
        "email": "your-mail@example.com"
      },
      {
        "id": 2,
        "email": "your-mail@example.com"
      },
      {
        "id": 3,
        "email": "your-mail@example.com"
      }
    ]
  }
}
```

## Course Enrolled

Sent when user enrolls in a course.

```json
{
  "type": "course.enrolled",
  "payload": {
    "user_id": 789,
    "email": "your-mail@example.com",
    "course_name": "Mastering Microservices with Go"
  }
}
```
