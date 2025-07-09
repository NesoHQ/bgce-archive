// https://github.com/nikhilroxtomar/UDP-Client-Server-Program-in-C

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <netinet/in.h>
#include <arpa/inet.h>

int main(int argc, char **argv) {

    int port = 5501;
    int sockfd;
    struct sockaddr_in myaddr, remoteAddr;
    char buffer[1024];
    socklen_t addr_size;

    sockfd = socket(AF_INET, SOCK_DGRAM, 0);

    memset(&myaddr, '\0', sizeof(myaddr));
    myaddr.sin_family = AF_INET;
    myaddr.sin_port = htons(port);
    myaddr.sin_addr.s_addr = inet_addr("127.0.0.1");

    bind(sockfd, (struct sockaddr*)&myaddr, sizeof(myaddr));

    addr_size = sizeof(remoteAddr);
    recvfrom(sockfd, buffer, 1024, 0, (struct sockaddr*)&remoteAddr, &addr_size);
    printf("got data from %s ", buffer);

    return 0;
}
