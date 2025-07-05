````markdown
# Simple UDP Server in Node.js

This is a **minimal UDP server** built using Node.js `dgram` module. It listens on `127.0.0.1:41234` and optionally replies back to the client.

## Files

- `server.js` : Contains the UDP server code.

## Requirements

- Node.js (v12+ recommended)
- npm

## How to Run

1. **Install dependencies (if any)**

This script uses only core Node.js modules, so no installation is required. But initialize your project for good practice:

```bash
npm init -y
````

2. **Run the server**

```bash
node server.js
```

You should see:

```
UDP Server listening on 127.0.0.1:41234
```

## Code Explanation (Brief)

* **dgram.createSocket("udp4")** – creates an IPv4 UDP socket.
* **server.on("message")** – handles incoming datagrams.
* **server.send()** – sends a reply back to the client.
* **server.bind()** – binds the server to the specified port and host.

## 📡 Testing the Server

### 🔧 Using netcat (nc)

Open a separate terminal and run:

```bash
echo "Hello from client" | nc -u 127.0.0.1 41234
```

You should see the server log the received message and send a reply.

### 🔧 Using a Node.js UDP client

Create a simple `client.js`:

```js
import dgram from "dgram";

const client = dgram.createSocket("udp4");
const msg = Buffer.from("Hello server!");

client.send(msg, 0, msg.length, 41234, "127.0.0.1", (err) => {
    if (err) console.error(err);
    else console.log("Message sent!");
    client.close();
});
```

Run it:

```bash
node client.js
```

## Reference

* [Node.js dgram documentation](https://nodejs.org/api/dgram.html)

---

### Notes

* For production use, handle errors and edge cases gracefully.
* Use `udp6` instead of `udp4` for IPv6 sockets.
* Adjust `HOST` to `0.0.0.0` if you want to accept messages from any network interface.

---

Happy UDP hacking!

```