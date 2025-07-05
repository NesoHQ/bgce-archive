# URL Shortener - Go

A simple URL shortening service built with Go and MySQL. This project allows users to generate short URLs and redirect to the original long URL using a unique key.

## Features

- Generate short URLs with unique keys
- Redirect to the original URL
- MySQL integration for URL storage
- JSON-based HTTP API
- Environment variable support via `.env` file

## Project Structure

```
UrlShortner-Go/
├── config/            # Loads MySQL connection using env vars
├── database/
│   └── mysql.go       # MySQL operations for saving and retrieving URLs
├── handlers/
│   └── UrlHandler.go  # HTTP handlers for shortening and redirecting
├── models/            # Request/response models
├── utils/
│   └── utils.go       # Random key generation
├── .env               # Environment variables
└── main.go            # Entry point of the server
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/0baydullah/UrlShortner-Go.git
   ```
2. Navigate to the project directory:
   ```bash
   cd UrlShortner-Go
   ```

3. Set up your MySQL database and table:
   ```sql
   CREATE DATABASE urlshortener;
   USE urlshortener;
   CREATE TABLE urls (
       id INT AUTO_INCREMENT PRIMARY KEY,
       short_key VARCHAR(255) NOT NULL UNIQUE,
       original_url TEXT NOT NULL
   );
   ```

4. Create a `.env` file in the root directory:
   ```env
   DB_USER=your_db_username
   DB_PASSWORD=your_db_password
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=urlshortener
   ```

5. Run the application:
   ```bash
   go run main.go
   ```

## Usage

### Shorten a URL

Send a `POST` request to `/shorten`:

```bash
curl -X POST http://localhost:8081/shorten -H "Content-Type: application/json" -d '{"url": "https://example.com"}'
```

**Response:**
```json
{
  "key": "abc123",
  "url": "https://example.com",
  "shortUrl": "http://localhost:8081/abc123"
}
```
or If you want to  test it you can use `PostMan` too! ;-)

### Here is a preview from Postman (had been hosted on a free VPS, maybe expired already)
![App Preview](https://github.com/0baydullah/UrlShortner-Go/blob/main/image.png?raw=true)


### Redirect to Original URL

Visit the shortened URL:

```bash
http://localhost:8081/abc123
```

This will redirect to `https://example.com`.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.
