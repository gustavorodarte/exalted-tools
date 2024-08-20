# Random Roller Bot

A discord bot for roll dices with a true randomness using random.og API.

# Commands

**basic roll**: `#1d20`
**exalted success roll**: `#10d10x7`
**exalted damage roll**: `#10d10e7`

## Running the Project

To run the Random Roller Bot project, follow these steps:

1. Clone the repository to your local machine:

    ```bash
    git clone https://github.com/gustavo-rodarte/exalted-tools.git
    ```

2. Navigate to the project directory:

    ```bash
    cd exalted-tools/discord-random-roller
    ```

3. Install the required dependencies:

    ```bash
    npm install
    ```

4. Obtain an API key from random.org by signing up on their website.

5. Create a `.env` file in the project directory and add the following line, replacing `YOUR_API_KEY` with your actual API key:

    ```bash
    RANDOM_ORG_API_KEY=YOUR_API_KEY
    DISCORD_PUBLIC_KEY=YOUR_API_KEY
    ```

6. Running the tests:

    ```bash
    npm test
    ```

## Technology Used

The Random Roller Bot is built using the following technologies:

- Node.js
- Discord.js
- random.org API
- vercel functions

## General Information

The Random Roller Bot is a Discord bot that provides true randomness for dice rolls using the random.org API. It supports basic rolls as well as specific rolls for the Exalted RPG system, such as success rolls and damage rolls. The bot ensures fair and unbiased results by relying on the random.org API for generating random numbers. Feel free to use the bot in your Discord server to enhance your gaming experience!
