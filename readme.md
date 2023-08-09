# Battleship

## Screenshots

![the beginning of the game] (https://github.com/gorgeousPotato/battleship/blob/main/images/screenshots/1.beginning.png)

1. The page is loaded, and the user sees their board along with a board displaying ships that need to be placed. Clicking a ship causes it to rotate, while dragging it moves the ship to a position on the board.

![process of user ship placement] (https://github.com/gorgeousPotato/battleship/blob/main/images/screenshots/2.process%20of%20user%20ship%20placement.png)

2. The user can place ships in any pattern they prefer. The only rule is that ship cells cannot be placed in adjacent cells, although diagonal placement is permitted.

![all the ships are placed] (https://github.com/gorgeousPotato/battleship/blob/main/images/screenshots/3.all%20user%20ships%20are%20placed.png)

3. Once all the ships are placed, the user will encounter a "start game" button. Upon clicking this button, the board for placing ships will be replaced with the computer's board, where the computer's ships have already been positioned randomly. These ships are not visible to the user. A message indicating whose turn it is now is displayed.

![the beginning of the game process] (https://github.com/gorgeousPotato/battleship/blob/main/images/screenshots/4.the%20beginning%20of%20the%20game.png)

4. The user clicks on cells on the computer's board. If it's a miss, the cell is marked with a cross. If a ship is hit, a bomb emoji is displayed. If a ship is sunk, the bomb emoji is replaced with a fire emoji.

![the game process] (https://github.com/gorgeousPotato/battleship/blob/main/images/screenshots/5.the%20game%20process.png)

5. Underneath the boards, the scores are presented. The computer employs its own strategy, making the game quite challenging.

![the end of the game] (https://github.com/gorgeousPotato/battleship/blob/main/images/screenshots/6.the%20end%20of%20the%20game%2C%20start%20again%20button.png)

6. Once all of the opponent's ships are sunk, a message announcing the winner is shown. The "Start Again" button is also displayed.

![strategy] (https://github.com/gorgeousPotato/battleship/blob/main/images/screenshots/strategy.png)

7. Here is the AI strategy that computer uses for his hits to be not random. Initially, it targets one of the cells marked with a cross. This approach is sufficient to locate all of the ships.

![targets] (https://github.com/gorgeousPotato/battleship/blob/main/images/screenshots/targets.png)

8. When a ship is hit, the computer generates a list of the next target cells, consisting of 4 adjacent cells.

![targets] (https://github.com/gorgeousPotato/battleship/blob/main/images/screenshots/targets-1.png)

9. When the next cell of the ship is hit, the computer corrects his list of targets. Once the ship is sunk, the computer reverts back to its initial strategy.
