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