# RPS-Multiplayer

RPS Multiplayer is a rock, paper, scissors app that allows a user to play against the computer or, if available, against another human. It was built for my full-stack web development bootcamp and proved to be challenging for a variety of reasons. 

The front-end aspect was not too troublesome but one of the specifications for this app was the usage of Google Firebase for real-time data storage and retrieval. As I had never used any kind of database system before this assignment, this was a nightmare for me. I ran into problems like not being able to retrieve the information that I pushed to the database because the value would be assigned a random key in the object. I also had issues with updating the scores for the single player game mode because I was getting lost within the Firebase event listeners and creating infinite loops in my console.

The end product works but could definitely be improved. For instance, the two player game mode only works if there are exactly two people online. There are some other tweaks that I couldn't manage to sort out but one of the bootcamp's Teaching Assistant's (thanks Ramon) mentioned that we would soon start working with mongoDB. He mentioned that this system makes accessing, storing and getting information from a database completely seamless. So for now, I'm looking forward to that.

Check the app out here: https://raglaks.github.io/RPS-Multiplayer/
