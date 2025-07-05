import dgram from "dgram";

const PORT = 41234;
const HOST = "127.0.0.1";

// Create UDP socket
const server = dgram.createSocket("udp4");

// On receiving a message
server.on("message", (msg, rinfo) => {
    console.log(
        `Received message from ${rinfo.address}:${rinfo.port} - ${msg}`
    );

    // Optional: send a reply
    const reply = Buffer.from("Hello from UDP server!");
    server.send(reply, 0, reply.length, rinfo.port, rinfo.address, (err) => {
        if (err) console.error("Error sending reply:", err);
        else console.log("Reply sent.");
    });
});

// On server listening
server.on("listening", () => {
    const address = server.address();
    console.log(`UDP Server listening on ${address.address}:${address.port}`);
});

// On error
server.on("error", (err) => {
    console.error(`UDP server error:\n${err.stack}`);
    server.close();
});

// Bind server to port and host
server.bind(PORT, HOST);
