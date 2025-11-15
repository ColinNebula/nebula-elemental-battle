#include <iostream>
#include <cstring>
#include <thread>
#include <vector>

#ifdef _WIN32
    #include <winsock2.h>
    #include <ws2tcpip.h>
    #pragma comment(lib, "ws2_32.lib")
    typedef int socklen_t;
#else
    #include <sys/socket.h>
    #include <netinet/in.h>
    #include <arpa/inet.h>
    #include <unistd.h>
    #define SOCKET int
    #define INVALID_SOCKET -1
    #define SOCKET_ERROR -1
    #define closesocket close
#endif

#include "card_game.h"

const int PORT = 8080;
GameServer gameServer;

void handleClient(SOCKET clientSocket) {
    char buffer[4096];
    
    while (true) {
        memset(buffer, 0, sizeof(buffer));
        int bytesReceived = recv(clientSocket, buffer, sizeof(buffer) - 1, 0);
        
        if (bytesReceived <= 0) {
            std::cout << "Client disconnected" << std::endl;
            break;
        }
        
        std::string request(buffer);
        std::string response;
        
        // Simple command parsing
        if (request.find("CREATE_ROOM") == 0) {
            std::string roomId = gameServer.createRoom(4);
            response = "{\"type\":\"ROOM_CREATED\",\"roomId\":\"" + roomId + "\"}";
        }
        else if (request.find("JOIN_ROOM") == 0) {
            // Expected format: JOIN_ROOM roomId playerId playerName
            size_t pos1 = request.find(' ');
            size_t pos2 = request.find(' ', pos1 + 1);
            size_t pos3 = request.find(' ', pos2 + 1);
            
            if (pos1 != std::string::npos && pos2 != std::string::npos && pos3 != std::string::npos) {
                std::string roomId = request.substr(pos1 + 1, pos2 - pos1 - 1);
                std::string playerId = request.substr(pos2 + 1, pos3 - pos2 - 1);
                std::string playerName = request.substr(pos3 + 1);
                
                bool success = gameServer.joinRoom(roomId, playerId, playerName);
                response = "{\"type\":\"JOIN_RESULT\",\"success\":" + std::string(success ? "true" : "false") + "}";
            }
        }
        else if (request.find("START_GAME") == 0) {
            size_t pos = request.find(' ');
            if (pos != std::string::npos) {
                std::string roomId = request.substr(pos + 1);
                bool success = gameServer.startGame(roomId);
                response = "{\"type\":\"GAME_STARTED\",\"success\":" + std::string(success ? "true" : "false") + "}";
            }
        }
        else if (request.find("PLAY_CARD") == 0) {
            // Expected format: PLAY_CARD roomId playerId cardIndex
            size_t pos1 = request.find(' ');
            size_t pos2 = request.find(' ', pos1 + 1);
            size_t pos3 = request.find(' ', pos2 + 1);
            
            if (pos1 != std::string::npos && pos2 != std::string::npos && pos3 != std::string::npos) {
                std::string roomId = request.substr(pos1 + 1, pos2 - pos1 - 1);
                std::string playerId = request.substr(pos2 + 1, pos3 - pos2 - 1);
                int cardIndex = std::stoi(request.substr(pos3 + 1));
                
                bool success = gameServer.playCard(roomId, playerId, cardIndex);
                response = "{\"type\":\"CARD_PLAYED\",\"success\":" + std::string(success ? "true" : "false") + "}";
            }
        }
        else if (request.find("GET_STATE") == 0) {
            size_t pos = request.find(' ');
            if (pos != std::string::npos) {
                std::string roomId = request.substr(pos + 1);
                response = gameServer.getRoomState(roomId);
            }
        }
        else {
            response = "{\"type\":\"ERROR\",\"message\":\"Unknown command\"}";
        }
        
        send(clientSocket, response.c_str(), response.length(), 0);
    }
    
    closesocket(clientSocket);
}

int main() {
#ifdef _WIN32
    WSADATA wsaData;
    if (WSAStartup(MAKEWORD(2, 2), &wsaData) != 0) {
        std::cerr << "WSAStartup failed" << std::endl;
        return 1;
    }
#endif

    SOCKET serverSocket = socket(AF_INET, SOCK_STREAM, 0);
    if (serverSocket == INVALID_SOCKET) {
        std::cerr << "Socket creation failed" << std::endl;
#ifdef _WIN32
        WSACleanup();
#endif
        return 1;
    }
    
    sockaddr_in serverAddr;
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_port = htons(PORT);
    serverAddr.sin_addr.s_addr = INADDR_ANY;
    
    if (bind(serverSocket, (sockaddr*)&serverAddr, sizeof(serverAddr)) == SOCKET_ERROR) {
        std::cerr << "Bind failed" << std::endl;
        closesocket(serverSocket);
#ifdef _WIN32
        WSACleanup();
#endif
        return 1;
    }
    
    if (listen(serverSocket, 10) == SOCKET_ERROR) {
        std::cerr << "Listen failed" << std::endl;
        closesocket(serverSocket);
#ifdef _WIN32
        WSACleanup();
#endif
        return 1;
    }
    
    std::cout << "Card Game Server running on port " << PORT << std::endl;
    
    while (true) {
        sockaddr_in clientAddr;
        socklen_t clientAddrLen = sizeof(clientAddr);
        SOCKET clientSocket = accept(serverSocket, (sockaddr*)&clientAddr, &clientAddrLen);
        
        if (clientSocket == INVALID_SOCKET) {
            std::cerr << "Accept failed" << std::endl;
            continue;
        }
        
        std::cout << "New client connected" << std::endl;
        std::thread(handleClient, clientSocket).detach();
    }
    
    closesocket(serverSocket);
#ifdef _WIN32
    WSACleanup();
#endif
    
    return 0;
}
