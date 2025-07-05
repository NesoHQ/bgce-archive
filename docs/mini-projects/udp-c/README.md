````markdown
# UDP Server in C

This is a simple UDP server program written in C. It binds to `127.0.0.1` on port `5501` and listens for incoming datagrams.

## Files

- `main.c` : The UDP server code.

## Requirements

- GCC or any C compiler
- Linux or macOS (or WSL on Windows)

## How to Compile and Run

1. **Compile:**

```bash
gcc main.c -o udp_server
````

2. **Run:**

```bash
./udp_server
```

It will start and wait for incoming UDP packets.

## Code Explanation (Brief)

* **socket()** – creates a UDP socket.
* **bind()** – binds to `127.0.0.1:5501`.
* **recvfrom()** – receives data from any UDP client.
* **printf()** – prints the received message.

## Example Client (Testing)

To test quickly, use `netcat` as a UDP client:

```bash
echo "Hello Server" | nc -u 127.0.0.1 5501
```

Or write your own simple C client to send a datagram to port `5501`.

## Reference

[UDP Client-Server Program in C](https://github.com/nikhilroxtomar/UDP-Client-Server-Program-in-C)

---

### Notes

* Change `127.0.0.1` to `0.0.0.0` to bind on all interfaces.
* Always handle errors in production-grade code (`if (sockfd < 0) { perror("socket failed"); exit(1); }` etc).

---

Feel free to modify and extend this as needed for your networking practice or system programming portfolio.

```