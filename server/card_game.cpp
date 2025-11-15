#include "card_game.h"
#include <algorithm>
#include <random>
#include <sstream>
#include <ctime>

// Card Implementation
std::string Card::getElementName() const {
    switch (element) {
        case Element::FIRE: return "FIRE";
        case Element::ICE: return "ICE";
        case Element::WATER: return "WATER";
        case Element::ELECTRICITY: return "ELECTRICITY";
        case Element::EARTH: return "EARTH";
        case Element::POWER: return "POWER";
    }
    return "UNKNOWN";
}

std::string Card::toString() const {
    return getElementName() + "_" + std::to_string(strength);
}

// Player Implementation
Player::Player(const std::string& playerId, const std::string& playerName)
    : id(playerId), name(playerName), score(0), isActive(false) {}

void Player::addCard(const Card& card) {
    hand.push_back(card);
}

bool Player::removeCard(int cardIndex) {
    if (cardIndex >= 0 && cardIndex < hand.size()) {
        hand.erase(hand.begin() + cardIndex);
        return true;
    }
    return false;
}

const std::vector<Card>& Player::getHand() const {
// Player Implementation
Player::Player(const std::string& playerId, const std::string& playerName, bool isAI)
    : id(playerId), name(playerName), score(0), isActive(false), isComputer(isAI), chosenCard(nullptr) {}

void Player::addCard(const Card& card) {
    hand.push_back(card);
}

bool Player::removeCard(int cardIndex) {
    if (cardIndex >= 0 && cardIndex < hand.size()) {
        hand.erase(hand.begin() + cardIndex);
        return true;
    }
    return false;
}

const std::vector<Card>& Player::getHand() const {
    return hand;
}

void Player::clearHand() {
    hand.clear();
}

void Player::setChosenCard(int cardIndex) {
    if (cardIndex >= 0 && cardIndex < hand.size()) {
        chosenCard = new Card(hand[cardIndex].element, hand[cardIndex].strength);
    }
}

Card* Player::getChosenCard() {
// Deck Implementation
Deck::Deck() {
    createElementalDeck();
}

void Deck::reset() {
    cards.clear();
    createElementalDeck();
}

void Deck::createElementalDeck() {
    // Create elemental cards with strength 1-10 for each element
    Element elements[] = {Element::FIRE, Element::ICE, Element::WATER, 
                         Element::ELECTRICITY, Element::EARTH, Element::POWER};
    
    for (const auto& elem : elements) {
        for (int strength = 1; strength <= 10; strength++) {
            cards.emplace_back(elem, strength);
        }
    }
}

int Player::getScore() const {
    return score;
}

std::string Player::getId() const {
    return id;
}

std::string Player::getName() const {
    return name;
}

void Player::setActive(bool active) {
    isActive = active;
}

bool Player::getActive() const {
    return isActive;
}

bool Player::isAI() const {
    return isComputer;
}

int Player::makeAIChoice() {
    // Simple AI: choose random card
    if (hand.empty()) return -1;
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(0, hand.size() - 1);
    return dis(gen);
}

void Player::addPlayedCard(const Card& card) {
    playedCards.push_back(card);
}

const std::vector<Card>& Player::getPlayedCards() const {
    return playedCards;
}

void Player::clearPlayedCards() {
    playedCards.clear();
}

void Player::addScore(int points) {
    score += points;
}

// Deck Implementation
void Deck::shuffle() {
    std::random_device rd;
    std::mt19937 gen(rd());
    std::shuffle(cards.begin(), cards.end(), gen);
}

Card Deck::draw() {
    if (cards.empty()) {
        throw std::runtime_error("Deck is empty");
    }
    Card card = cards.back();
    cards.pop_back();
    return card;
}

bool Deck::isEmpty() const {
    return cards.empty();
}

int Deck::size() const {
    return cards.size();
}

// GameRoom Implementation
GameRoom::GameRoom(const std::string& id, int maxP)
    : roomId(id), maxPlayers(maxP), currentPlayerIndex(0), gameStarted(false), gameOver(false), roundsPlayed(0) {}

bool GameRoom::addPlayer(std::shared_ptr<Player> player) {
    if (players.size() >= maxPlayers || gameStarted) {
        return false;
    }
    players.push_back(player);
    
    // Auto-add AI player when human joins
    if (players.size() == 1 && maxPlayers == 2) {
        auto aiPlayer = std::make_shared<Player>("ai_player", "Computer", true);
        players.push_back(aiPlayer);
    }
    
    return true;
}

bool GameRoom::removePlayer(const std::string& playerId) {
    for (auto it = players.begin(); it != players.end(); ++it) {
        if ((*it)->getId() == playerId) {
            players.erase(it);
            return true;
        }
    }
    return false;
}

bool GameRoom::startGame() {
    if (players.size() < 2 || gameStarted) {
        return false;
    }
    
    gameStarted = true;
    deck.reset();
    deck.shuffle();
    currentPlayerIndex = 0;
    roundsPlayed = 0;
    
    if (!players.empty()) {
        players[0]->setActive(true);
    }
    
    return true;
}

void GameRoom::dealCards(int cardsPerPlayer) {
    for (auto& player : players) {
        player->clearHand();
        for (int i = 0; i < cardsPerPlayer && !deck.isEmpty(); i++) {
            player->addCard(deck.draw());
        }
    }
}

bool GameRoom::chooseCard(const std::string& playerId, int cardIndex) {
    if (!gameStarted || gameOver) return false;
    
    auto player = getPlayer(playerId);
    if (!player || !player->getActive()) {
        return false;
    }
    
    const auto& hand = player->getHand();
    if (cardIndex < 0 || cardIndex >= hand.size()) {
        return false;
    }
    
    // Get the card that's about to be played
    Card playedCard = hand[cardIndex];
    
    // Add the main card to played cards
    player->addPlayedCard(playedCard);
    player->setChosenCard(cardIndex);
    player->removeCard(cardIndex);
    
    // Check if a POWER (star) card was played
    if (playedCard.element == Element::POWER) {
        // Find all POWER cards remaining in hand
        const auto& updatedHand = player->getHand();
        std::vector<int> powerCardIndices;
        for (int i = 0; i < updatedHand.size(); i++) {
            if (updatedHand[i].element == Element::POWER) {
                powerCardIndices.push_back(i);
            }
        }
        
        // If there are POWER cards left, play a random one
        if (!powerCardIndices.empty()) {
            std::random_device rd;
            std::mt19937 gen(rd());
            std::uniform_int_distribution<> dis(0, powerCardIndices.size() - 1);
            int randomPowerIndex = powerCardIndices[dis(gen)];
            
            // Add the additional POWER card to played cards
            player->addPlayedCard(updatedHand[randomPowerIndex]);
            player->removeCard(randomPowerIndex);
        }
    }
    
    // If AI turn next, make AI choose
    nextTurn();
    if (getCurrentPlayer() && getCurrentPlayer()->isAI()) {
        int aiChoice = getCurrentPlayer()->makeAIChoice();
        if (aiChoice >= 0) {
            const auto& aiHand = getCurrentPlayer()->getHand();
            Card aiPlayedCard = aiHand[aiChoice];
            
            // Add AI's main card to played cards
            getCurrentPlayer()->addPlayedCard(aiPlayedCard);
            getCurrentPlayer()->setChosenCard(aiChoice);
            getCurrentPlayer()->removeCard(aiChoice);
            
            // Check if AI played a POWER card
            if (aiPlayedCard.element == Element::POWER) {
                const auto& aiUpdatedHand = getCurrentPlayer()->getHand();
                std::vector<int> aiPowerCardIndices;
                for (int i = 0; i < aiUpdatedHand.size(); i++) {
                    if (aiUpdatedHand[i].element == Element::POWER) {
                        aiPowerCardIndices.push_back(i);
                    }
                }
                
                if (!aiPowerCardIndices.empty()) {
                    std::random_device rd;
                    std::mt19937 gen(rd());
                    std::uniform_int_distribution<> dis(0, aiPowerCardIndices.size() - 1);
                    int randomPowerIndex = aiPowerCardIndices[dis(gen)];
                    
                    getCurrentPlayer()->addPlayedCard(aiUpdatedHand[randomPowerIndex]);
                    getCurrentPlayer()->removeCard(randomPowerIndex);
                }
            }
            
            resolveRound();
        }
    }
    
    return true;
}

void GameRoom::resolveRound() {
    if (players.size() != 2) return;
    
    Card* card1 = players[0]->getChosenCard();
    Card* card2 = players[1]->getChosenCard();
    
    if (!card1 || !card2) return;
    
    // Calculate total strength from all played cards
    int player1TotalStrength = 0;
    const auto& player1Cards = players[0]->getPlayedCards();
    for (const auto& card : player1Cards) {
        player1TotalStrength += card.strength;
    }
    
    int player2TotalStrength = 0;
    const auto& player2Cards = players[1]->getPlayedCards();
    for (const auto& card : player2Cards) {
        player2TotalStrength += card.strength;
    }
    
    // Compare total strength
    if (player1TotalStrength > player2TotalStrength) {
        players[0]->addScore(1);
    } else if (player2TotalStrength > player1TotalStrength) {
        players[1]->addScore(1);
    }
    
    // Clear chosen cards and played cards
    players[0]->clearChosenCard();
    players[1]->clearChosenCard();
    players[0]->clearPlayedCards();
    players[1]->clearPlayedCards();
    
    roundsPlayed++;
    
    // Check if game is over (all 5 rounds played)
    if (roundsPlayed >= 5) {
        gameOver = true;
    } else {
        // Next round
        currentPlayerIndex = 0;
        players[0]->setActive(true);
        players[1]->setActive(false);
    }
}

void GameRoom::nextTurn() {
    if (players.empty()) return;
    
    players[currentPlayerIndex]->setActive(false);
    currentPlayerIndex = (currentPlayerIndex + 1) % players.size();
    players[currentPlayerIndex]->setActive(true);
    
    // If both players have chosen, resolve
    if (players[0]->getChosenCard() && players[1]->getChosenCard()) {
        resolveRound();
    }
}

std::shared_ptr<Player> GameRoom::getCurrentPlayer() const {
    if (players.empty() || currentPlayerIndex >= players.size()) {
        return nullptr;
    }
    return players[currentPlayerIndex];
}

std::shared_ptr<Player> GameRoom::getPlayer(const std::string& playerId) const {
    for (const auto& player : players) {
        if (player->getId() == playerId) {
            return player;
        }
    }
    return nullptr;
}

std::shared_ptr<Player> GameRoom::getWinner() const {
    if (!gameOver || players.size() != 2) return nullptr;
    
    if (players[0]->getScore() > players[1]->getScore()) {
        return players[0];
    } else if (players[1]->getScore() > players[0]->getScore()) {
        return players[1];
    }
    return nullptr; // Tie
}

std::string GameRoom::getRoomId() const {
    return roomId;
}

int GameRoom::getPlayerCount() const {
    return players.size();
}

bool GameRoom::isGameStarted() const {
    return gameStarted;
}

bool GameRoom::isGameOver() const {
    return gameOver;
}

std::string GameRoom::getGameState() const {
    std::ostringstream oss;
    oss << "{\"roomId\":\"" << roomId << "\",";
    oss << "\"gameStarted\":" << (gameStarted ? "true" : "false") << ",";
    oss << "\"gameOver\":" << (gameOver ? "true" : "false") << ",";
// GameServer Implementation
GameServer::GameServer() : nextRoomId(1) {}

std::string GameServer::createRoom(int maxPlayers) {
    std::string roomId = "room_" + std::to_string(nextRoomId++);
    rooms[roomId] = std::make_shared<GameRoom>(roomId, maxPlayers);
    return roomId;
}

bool GameServer::joinRoom(const std::string& roomId, const std::string& playerId, const std::string& playerName) {
    auto it = rooms.find(roomId);
    if (it == rooms.end()) {
        return false;
    }
    
    auto player = std::make_shared<Player>(playerId, playerName, false);
    return it->second->addPlayer(player);
}

bool GameServer::leaveRoom(const std::string& roomId, const std::string& playerId) {
    auto it = rooms.find(roomId);
    if (it == rooms.end()) {
        return false;
    }
    
    return it->second->removePlayer(playerId);
}

bool GameServer::startGame(const std::string& roomId) {
    auto it = rooms.find(roomId);
    if (it == rooms.end()) {
        return false;
    }
    
    if (it->second->startGame()) {
        it->second->dealCards(5); // Deal 5 cards per player
        return true;
    }
    return false;
}

bool GameServer::chooseCard(const std::string& roomId, const std::string& playerId, int cardIndex) {
    auto it = rooms.find(roomId);
    if (it == rooms.end()) {
        return false;
    }
    
    return it->second->chooseCard(playerId, cardIndex);
}ameServer::GameServer() : nextRoomId(1) {}

std::string GameServer::createRoom(int maxPlayers) {
    std::string roomId = "room_" + std::to_string(nextRoomId++);
    rooms[roomId] = std::make_shared<GameRoom>(roomId, maxPlayers);
    return roomId;
}

bool GameServer::joinRoom(const std::string& roomId, const std::string& playerId, const std::string& playerName) {
    auto it = rooms.find(roomId);
    if (it == rooms.end()) {
        return false;
    }
    
    auto player = std::make_shared<Player>(playerId, playerName);
    return it->second->addPlayer(player);
}

bool GameServer::leaveRoom(const std::string& roomId, const std::string& playerId) {
    auto it = rooms.find(roomId);
    if (it == rooms.end()) {
        return false;
    }
    
    return it->second->removePlayer(playerId);
}

bool GameServer::startGame(const std::string& roomId) {
    auto it = rooms.find(roomId);
    if (it == rooms.end()) {
        return false;
    }
    
    if (it->second->startGame()) {
        it->second->dealCards(5); // Deal 5 cards per player
        return true;
    }
    return false;
}

bool GameServer::playCard(const std::string& roomId, const std::string& playerId, int cardIndex) {
    auto it = rooms.find(roomId);
    if (it == rooms.end()) {
        return false;
    }
    
    if (it->second->playCard(playerId, cardIndex)) {
        it->second->nextTurn();
        return true;
    }
    return false;
}

std::string GameServer::getRoomState(const std::string& roomId) {
    auto it = rooms.find(roomId);
    if (it == rooms.end()) {
        return "{\"error\":\"Room not found\"}";
    }
    
    return it->second->getGameState();
}

std::vector<std::string> GameServer::getAvailableRooms() {
    std::vector<std::string> available;
    for (const auto& pair : rooms) {
        if (!pair.second->isGameStarted()) {
            available.push_back(pair.first);
        }
    }
    return available;
}
