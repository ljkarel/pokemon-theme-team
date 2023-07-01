function getColorFromType(type) {
    const colors = {
        normal: "A8A878",
        fire: "F08030",
        water: "6890F0",
        grass: "78C850",
        electric: "F8D030",
        ice: "98D8D8",
        fighting: "C03028",
        poison: "A040A0",
        ground: "E0C068",
        flying: "A890F0",
        psychic: "F85888",
        bug: "A8B820",
        rock: "B8A038",
        ghost: "705898",
        dark: "705848",
        dragon: "7038F8",
        steel: "B8B8D0",
        fairy: "F0B6BC"
    }
    return colors[type];
}

function displayPokemon(pokemon) {
    let pokemonHolder = document.getElementById("pokemonHolder");
    let col = document.createElement("div");
    let div = document.createElement("div");
    let name = document.createElement("h2");
    let img = document.createElement("img");
    let stats = document.createElement("h6");
    pokemonHolder.appendChild(col);
    col.appendChild(div);
    div.appendChild(name);
    div.appendChild(img);
    div.appendChild(stats);
    col.setAttribute("class", "col-xl-4 col-lg-6");
    div.setAttribute("class", "text-center border border-white p-1 rounded");
    name.textContent = `${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}`
    name.setAttribute("class", "text-dark");
    stats.setAttribute("class", "text-dark");
    img.src = pokemon.sprites.front_default;
    img.width = 180;
    if (pokemon.types.length == 1) {
        stats.textContent = `${pokemon.types[0].type.name}`;
        div.style.backgroundColor = `#${getColorFromType(pokemon.types[0].type.name)}`;
    } else {
        stats.textContent = `${pokemon.types[0].type.name}, ${pokemon.types[1].type.name}`
        div.style.backgroundImage = `linear-gradient(70deg, #${getColorFromType(pokemon.types[0].type.name)}, #${getColorFromType(pokemon.types[1].type.name)})`;
    }
}

async function fetchPokemon(id) {
    const response = await(axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`));
    if (response.data.sprites.front_default == null || Number(response.data.id) > 10000) {
        return -1;
    }
    displayPokemon(response.data);
    return response.data;
}

async function getSimilarPokemon(sourcePokemon) {
    let types = sourcePokemon.types;
    let matchingPokemon = [];
    for (let i = 0; i < types.length; i++) {
        let typeName = types[i].type.name;
        const response = await(axios.get(`https://pokeapi.co/api/v2/type/${typeName}`));
        let pokemonOfType = response.data.pokemon;
        for (let j = 0; j < pokemonOfType.length; j++) {
            matchingPokemon.push(pokemonOfType[j].pokemon.name);
        }
    }
    let selectedPokemon = [sourcePokemon.name];
    for (let i = 0; i < 5; i++) {
        let pokemon = matchingPokemon[Math.floor(Math.random() * matchingPokemon.length)]
        while (selectedPokemon.includes(pokemon)) {
            pokemon = matchingPokemon[Math.floor(Math.random() * matchingPokemon.length)]
        }
        selectedPokemon.push(pokemon);
        while (await fetchPokemon(pokemon) == -1) {
            pokemon = matchingPokemon[Math.floor(Math.random() * matchingPokemon.length)]
            while (selectedPokemon.includes(pokemon)) {
                pokemon = matchingPokemon[Math.floor(Math.random() * matchingPokemon.length)]
            }
        }

    }
}

async function generatePokemon() {
    let pokemonHolder = document.getElementById("pokemonHolder");
    pokemonHolder.textContent = '';
    const id = Math.floor(Math.random() * 1010) + 1;
    let sourcePokemon = await fetchPokemon(id);
    while (sourcePokemon == -1) {
        const id = Math.floor(Math.random() * 1010) + 1;
        sourcePokemon = fetchPokemon(id);
    }
    let types = sourcePokemon.types;
    let typeHolder = document.getElementById("typeHolder");
    if (types.length == 1) {
        typeHolder.textContent = `Team generated with type ${types[0].type.name}.`;
    } else {
        typeHolder.textContent = `Team generated with types ${types[0].type.name} & ${types[1].type.name}.`;
    }
    getSimilarPokemon(sourcePokemon);
}

const button = document.getElementById("generate");
button.addEventListener("click", generatePokemon);