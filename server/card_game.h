#ifndef CARD_GAME_H
#define CARD_GAME_H

#include <string>
#include <vector>
#include <map>
#include <memory>

enum class Element {
    FIRE,
    ICE,
    WATER,
    ELECTRICITY,
    EARTH,
    POWER
};

struct Card {
    Element element;
    int strength;
    
    Card(Element e, int s) : element(e), strength(s) {}
    
    std::string toString() const;
    std::string getElementName() const;
};

class Player {
private:
    std::string id;
class Player {
private:
    std::string id;
    std::string name;
    std::vector<Card> hand;
    std::vector<Card> playedCards;
    int score;
    bool isActive;
    bool isComputer;
    Card* chosenCard;

public:
    Player(const std::string& playerId, const std::string& playerName, bool isAI = false);
    
    void addCard(const Card& card);
    bool removeCard(int cardIndex);
    const std::vector<Card>& getHand() const;
    void clearHand();
    
    void setChosenCard(int cardIndex);
    Card* getChosenCard();
    void clearChosenCard();
    
    void addPlayedCard(const Card& card);
    const std::vector<Card>& getPlayedCards() const;
    void clearPlayedCards();
    
    void addScore(int points);
    int getScore() const;
    
    std::string getId() const;
class Deck {
private:
    std::vector<Card> cards;

public:
    Deck();
    void shuffle();
    Card draw();
    bool isEmpty() const;
    int size() const;
class GameRoom {
private:
    std::string roomId;
    std::vector<std::shared_ptr<Player>> players;
    Deck deck;
    int currentPlayerIndex;
    int maxPlayers;
    bool gameStarted;
    bool gameOver;
    int roundsPlayed;

public:
    GameRoom(const std::string& id, int maxP = 2);
    
    bool addPlayer(std::shared_ptr<Player> player);
    bool removePlayer(const std::string& playerId);
    
    bool startGame();
    void dealCards(int cardsPerPlayer);
    
    bool chooseCard(const std::string& playerId, int cardIndex);
    void resolveRound();
    void nextTurn();
    
    std::shared_ptr<Player> getCurrentPlayer() const;
    std::shared_ptr<Player> getPlayer(const std::string& playerId) const;
    std::shared_ptr<Player> getWinner() const;
    
    std::string getRoomId() const;
    int getPlayerCount() const;
    bool isGameStarted() const;
    bool isGameOver() const;
class GameServer {
private:
    std::map<std::string, std::shared_ptr<GameRoom>> rooms;
    int nextRoomId;

public:
    GameServer();
    
    std::string createRoom(int maxPlayers = 2);
    bool joinRoom(const std::string& roomId, const std::string& playerId, const std::string& playerName);
    bool leaveRoom(const std::string& roomId, const std::string& playerId);
    
    bool startGame(const std::string& roomId);
    bool chooseCard(const std::string& roomId, const std::string& playerId, int cardIndex);
    
    std::string getRoomState(const std::string& roomId);
    std::vector<std::string> getAvailableRooms();
};  int nextRoomId;

public:
    GameServer();
    
    std::string createRoom(int maxPlayers = 4);
    bool joinRoom(const std::string& roomId, const std::string& playerId, const std::string& playerName);
    bool leaveRoom(const std::string& roomId, const std::string& playerId);
    
    bool startGame(const std::string& roomId);
    bool playCard(const std::string& roomId, const std::string& playerId, int cardIndex);
    
    std::string getRoomState(const std::string& roomId);
    std::vector<std::string> getAvailableRooms();
};

#endif // CARD_GAME_H
