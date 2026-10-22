# Challenge1
Who’s Online?
You have a group chat application, but who is online!?

You want to show your users which of their friends are online and available to chat!

Given an input of an array of objects containing usernames, status and time since last activity (in mins), create a function to work out who is online, offline and away.

If someone is online but their lastActivity was more than 10 minutes ago they are to be considered away.

The input data has the following structure:

[
  {
    username: 'David',
    status: 'online',
    lastActivity: 10
  },
  {
    username: 'Lucy',
    status: 'offline',
    lastActivity: 22
  },
  {
    username: 'Bob',
    status: 'online',
    lastActivity: 104
  }
]
The corresponding output should look as follows:

{
  online: [
    'David'
  ],
  offline: [
    'Lucy'
  ],
  away: [
    'Bob'
  ]
}
If for example, no users are online the output should look as follows:

{
offline: ['Lucy'],
away: ['Bob']
}
username will always be a string, status will always be either ‘online’ or ‘offline’ (UserStatus enum in C#) and lastActivity will always be number >= 0.

Finally, if you have no friends in your chat application, the input will be an empty array []. In this case you should return an empty object {} (empty Dictionary in C#).

# Challenge2
Credit Card Mask
Usually when you buy something, you’re asked whether your credit card number, phone number or answer to your most secret question is still correct. However, since someone could look over your shoulder, you don’t want that shown on your screen. Instead, we mask it.

Your task is to write a function maskify, which changes all but the last four characters into ‘#’. Examples (input –> output):

"4556364607935616" --> "############5616"
     "64607935616" -->      "#######5616"
               "1" -->                "1"
                "" -->                 ""
What was the name of your first pet?

"Skippy" --> "##ippy"
"Nananananananananananananananana Batman!" --> "####################################man!"


# Challenge 3
Your order, please
Your task is to sort a given string. Each word in the string will contain a single number. This number is the position the word should have in the result.

Note: Numbers can be from 1 to 9. So 1 will be the first word (not 0).

If the input string is empty, return an empty string. The words in the input String will only contain valid consecutive numbers.

Examples
"is2 Thi1s T4est 3a"  -->  "Thi1s is2 3a T4est"
"4of Fo1r pe6ople g3ood th5e the2"  -->  "Fo1r the2 g3ood 4of th5e pe6ople"
""  -->  ""


# Challenge 4
Find the missing letter
Write a method that takes an array of consecutive (increasing) letters as input and that returns the missing letter in the array.

You will always get an valid array. And it will be always exactly one letter be missing. The length of the array will always be at least 2. The array will always contain letters in only one case.

Example:
['a','b','c','d','f'] -> 'e'
['O','Q','R','S'] -> 'P'
(Use the English alphabet with 26 letters!)


# Challenge 5 
Who likes it?
You probably know the “like” system from Facebook and other pages. People can “like” blog posts, pictures or other items. We want to create the text that should be displayed next to such an item.

Implement the function which takes an array containing the names of people that like an item. It must return the display text as shown in the examples:

[]                                -->  "no one likes this"
["Peter"]                         -->  "Peter likes this"
["Jacob", "Alex"]                 -->  "Jacob and Alex like this"
["Max", "John", "Mark"]           -->  "Max, John and Mark like this"
["Alex", "Jacob", "Mark", "Max"]  -->  "Alex, Jacob and 2 others like this

# Challenge 6
Coding Challenge: Conway’s Game of Life
Translate this file ↗
The Game of Life is a cellular automaton devised by the British mathematician John Conway in 1970. It is a “zero-player game,” meaning its evolution is determined by its initial state, requiring no further input.

Your task is to build a command-line interface (CLI) version of this simulation using a fixed 50x50 grid.

1. The Rules of the World
The universe of the Game of Life is a two-dimensional grid of cells. Each cell is in one of two possible states: alive or dead. Every generation, the grid transitions based on the following four rules:

Underpopulation: Any live cell with fewer than 2 live neighbors dies.
Survival: Any live cell with 2 or 3 live neighbors lives on to the next generation.
Overpopulation: Any live cell with more than 3 live neighbors dies.
Reproduction: Any dead cell with exactly 3 live neighbors becomes a live cell.
2. Technical Requirements
Fixed Grid: The simulation must run on a strictly defined grid of 50 rows and 50 columns.
CLI Rendering: Choose 2 characters tor represent dead or alive cells (i.e. “#” and “.”).

Frame Rendering: The screen should refresh or clear for each new generation to create an animation effect.
Initial State: Allow the user to start the simulation with a random distribution of live cells or a predefined pattern (like a “Glider” or “Pulsar”).
The Loop: The program should calculate the next generation based on the current state and display it, ideally with a small delay (e.g., 100ms) between frames.