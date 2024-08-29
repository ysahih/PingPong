# Pongy
Pongy is a web-based multiplayer Pong game where users can play against each other in real-time, chat, and manage their user profiles. The project leverages modern web technologies to provide a seamless and engaging user experience.

## Tools and Technologies
* __Frontend:__ Next.js with React and TypeScript
* __Backend:__ NestJS
* __Database:__ PostgreSQL
* __Real-time Communication:__ Socket.io
* __ORM:__ Prisma
* __Containerization:__ Docker

## Features
* __Real-time Multiplayer Pong:__ Users can play a live Pong game against other players directly on the website.
* __Matchmaking System:__ Automatically matches users for 1v1 Pong games.
* __User Authentication:__ OAuth login, with support for two-factor authentication.
* __User Profiles:__ Display user stats, match history, and manage friends.
* __Chat System:__ Create channels (public/private/protected), send direct messages, and block users.
* __Game Customization:__ Offers different game modes, including options for power-ups and custom maps.
* __Responsive Design:__ Ensures that the game and website work well across different devices and screen sizes.
## How to Use
### Installation
1.__Clone the Repository:__

```bash
git clone https://git@github.com:ysahih/PingPong.git
```
2.__cd PingPong__

3.__Set Up Environment Variables:__

Create a .env file in the project root and configure the necessary environment variables such as database credentials and API keys.

4.__Build and Run the Project:__

5.__Use Docker to build and run the project:__
```bash
docker-compose up --build
```

### Accessing the Application

1. Once the project is running, open your web browser and navigate to __http://localhost:3001__ to access the application.
2. Users can sign up using OAuth, play Pong games, chat with other users, and view their profiles.

## Contributors

- [@Youssef](https://github.com/ysahih)
- [@Mouad](https://github.com/mouadsrk)
- [@Essadike](https://github.com/essadike-elhafiane)
- [@Adil](https://github.com/ADILRAQ)

### Pongy View

![alt text](https://github.com/ysahih/PingPong/blob/main-dev/Readme-Assets/Pongy-Pictures.png/?raw=true)
