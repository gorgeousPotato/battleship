# Battleship

Battleship is a strategic guessing game designed for two players. In this version, one of the players is represented by the computer. Players position their ships on the boards, keeping the ship locations concealed from their opponent. Players take turns making "shots" in an attempt to target and sink each other's ships. The main goal of the game is to destroy all of the opponent's ships.

The history of Battleship has two debated origins. Some believe it was initially invented during World War I, while others suggest similarities to the Basilinda board game published in 1890. In the past, individuals played Battleship using pen and paper, creating grids to represent the playing field and marking the placement of their ships. Over time, the game has evolved, and today we can enjoy Battleship against the computer, a clever opponent powered by artificial intelligence. Do you have what it takes to defeat this formidable digital adversary?

## Screenshots

![alt text](https://github.com/gorgeousPotato/battleship/blob/main/images/screenshots/1.beginning.png "the beginning of the game")

1. The page is loaded, and the user sees their board along with a board displaying ships that need to be placed. Clicking a ship causes it to rotate, while dragging it moves the ship to a position on the board.

![alt text](https://github.com/gorgeousPotato/battleship/blob/main/images/screenshots/2.process%20of%20user%20ship%20placement.png "process of user ship placement")

2. The user can place ships in any pattern they prefer. The only rule is that ship cells cannot be placed in adjacent cells, although diagonal placement is permitted.

![alt text](https://github.com/gorgeousPotato/battleship/blob/main/images/screenshots/3.all%20user%20ships%20are%20placed.png "all the ships are placed")

3. Once all the ships are placed, the user will encounter a "start game" button. Upon clicking this button, the board for placing ships will be replaced with the computer's board, where the computer's ships have already been positioned randomly. These ships are not visible to the user. A message indicating whose turn it is now is displayed.

![alt text](https://github.com/gorgeousPotato/battleship/blob/main/images/screenshots/4.the%20beginning%20of%20the%20game.png "the beginning of the game process")

4. The user clicks on cells on the computer's board. If it's a miss, the cell is marked with a cross. If a ship is hit, a bomb emoji is displayed. If a ship is sunk, the bomb emoji is replaced with a fire emoji.

![alt text](https://github.com/gorgeousPotato/battleship/blob/main/images/screenshots/5.the%20game%20process.png "the game process")

5. Underneath the boards, the scores are presented. The computer employs its own strategy, making the game quite challenging.

![alt text](https://github.com/gorgeousPotato/battleship/blob/main/images/screenshots/6.the%20end%20of%20the%20game%2C%20start%20again%20button.png "the end of the game")

6. Once all of the opponent's ships are sunk, a message announcing the winner is shown. The "Start Again" button is also displayed.

![alt text](https://github.com/gorgeousPotato/battleship/blob/main/images/screenshots/strategy.png "strategy")

7. Here is the AI strategy that computer uses for his hits to be not random. Initially, it targets one of the cells marked with a cross. This approach is sufficient to locate all of the ships.

![alt text](https://github.com/gorgeousPotato/battleship/blob/main/images/screenshots/targets.png "targets")

8. When a ship is hit, the computer generates a list of the next target cells, consisting of 4 adjacent cells.

![alt text](https://github.com/gorgeousPotato/battleship/blob/main/images/screenshots/targets-1.png "targets")

9. When the next cell of the ship is hit, the computer corrects his list of targets. Once the ship is sunk, the computer reverts back to its initial strategy.

## Technologies Used

- HTML
- CSS
- JavaScript

## Getting Started

[Battleship game](https://gorgeouspotato.github.io/battleship/)

## Next Steps

- Further improving the AI part of the program. For now, only two strategies are implemented. Each time when the computer uses only the pattern for finding a patrol boat - the shortest one - so that it can be used for finding any type of ships. However, for finding a carrier, the longest ship, the pattern has much less target cells. We could add code that triggers a strategy shift to the target pattern of the next ship once all patrol boats have been sunk.

- Implementing the feature for user to be able to rotate and move ships that have already been placed on the board.

- Implementing the "Go Random" button allowing users to choose to have their ships randomly placed
