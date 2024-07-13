import React, { useState, useEffect } from "react";
import axios from "axios";
import PokemonList from "./components/PokemonList";
import SearchBar from "./components/SearchBar";
import "./App.css"; // For styling

const App = () => {
    const [pokemons, setPokemons] = useState([]);
    const [filteredPokemons, setFilteredPokemons] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchPokemons = async () => {
            try {
                const response = await axios.get(
                    "https://pokeapi.co/api/v2/pokemon?limit=20"
                );
                const pokemonData = response.data.results;

                // Fetch detailed data for each Pokémon
                const detailedPokemons = await Promise.all(
                    pokemonData.map(async (pokemon) => {
                        const details = await axios.get(pokemon.url);
                        return details.data;
                    })
                );

                setPokemons(detailedPokemons);
                setFilteredPokemons(detailedPokemons);
            } catch (error) {
                console.error("Error fetching Pokémon data:", error);
            }
        };

        fetchPokemons();
    }, []);

    useEffect(() => {
        setFilteredPokemons(
            pokemons.filter((pokemon) =>
                pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [searchQuery, pokemons]);

    return (
        <div className="app">
            <h1>Pokemon Cards</h1>
            <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />
            <PokemonList pokemons={filteredPokemons} />
        </div>
    );
};

export default App;
