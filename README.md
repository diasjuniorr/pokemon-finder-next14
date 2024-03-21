# pokemon-finder

## Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Usage](#usage)

## About <a name = "about"></a>

This is a simple project to find pokemons by name. It uses the [PokeAPI](https://pokeapi.co/) to get the data. It consists of a list of pokemons and a details page where one can see the evolution chain of the selected pokemon plus habitat and a random fun fact about it. The project is built with Next.js 14 and zustand for state management.

## Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 


### Installing

Clone the repo and install the dependencies by running:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```


## Usage <a name = "usage"></a>

The initial page will display a list of pokemons. You can search a pokemon by its name and if found the pokemon and its evolution chain will be displayd. You can also filter by generation or type. Searching a pokemon by its name will go over all the pokemons returned by the API. The type and generation filters only filter the pokemons being displayd. Clicking on a pokemon will take you to the details page where you can see the evolution chain, habitat and a fun fact about the selected pokemon.
