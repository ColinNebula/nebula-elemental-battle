cmake_minimum_required(VERSION 3.10)
project(CardGameServer)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(card_game_server 
    server.cpp
    card_game.cpp
    card_game.h
)

if(WIN32)
    target_link_libraries(card_game_server ws2_32)
endif()
