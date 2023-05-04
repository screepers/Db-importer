# Db-importer

This package is there to automate input of structures into the db of screeps.

# Requirements

The [Server-Stats-Mod](https://github.com/The-International-Screeps-Bot/screepsmod-server-stats) is required as the `GetUsers` endpoint is used which isnt available normally. 

If you know your userId for each object you could do it without this mod but it will say it errored on the api call, which doesnt stop the execution if the id is correct.

# Installation & Usage

`See /examples`

## Package

`npm install screeps-db-importer`

## Information

To update the current cases please enter your new ones in the `cases/custom` folder as they are gitignored.
For more examples of objects use the api endpoints of the [Server-Stats-Mod](https://github.com/The-International-Screeps-Bot/screepsmod-server-stats) which are documented in there.

Any valid object is accepted