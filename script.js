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

function getStats(pokemon) {
    return [
        `Height: ${pokemon.height / 10}m`,
        `Weight: ${pokemon.weight / 10}kg`,
        `HP: ${pokemon.stats[0].base_stat}`,
        `Attack: ${pokemon.stats[1].base_stat}`,
        `Defense: ${pokemon.stats[2].base_stat}`,
        `Special Attack: ${pokemon.stats[3].base_stat}`,
        `Special Defense: ${pokemon.stats[4].base_stat}`,
        `Speed: ${pokemon.stats[5].base_stat}`
    ];
}

function displayPokemon(pokemon) {
    let pokemonHolder = document.getElementById("pokemonHolder");
    let flipCard = document.createElement("div");
    let flipCardInner = document.createElement("div");
    let flipCardFront = document.createElement("div");
    let flipCardBack = document.createElement("div");
    let name = document.createElement("h2");
    let img = document.createElement("img");
    let type = document.createElement("h6");
    pokemonHolder.appendChild(flipCard);
    flipCard.appendChild(flipCardInner);
    flipCardInner.appendChild(flipCardFront);
    flipCardInner.appendChild(flipCardBack);
    flipCardFront.appendChild(name);
    flipCardFront.appendChild(img);
    flipCardFront.appendChild(type);
    flipCard.setAttribute("class", "col-xl-4 col-lg-6 flipCard");
    flipCardInner.setAttribute("class", "flipCardInner");
    flipCardFront.setAttribute("class", "flipCardFront text-center border border-white p-1 rounded");
    flipCardBack.setAttribute("class", "flipCardBack text-center border border-white p-3 rounded")
    name.textContent = `${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}`
    name.setAttribute("class", "text-dark");
    type.setAttribute("class", "text-dark");
    img.src = pokemon.sprites.front_default;
    img.width = 180;
    if (pokemon.types.length == 1) {
        let type1 = pokemon.types[0].type.name;
        type.textContent = `${type1.charAt(0).toUpperCase() + type1.slice(1)}`;
        flipCardFront.style.backgroundColor = `#${getColorFromType(type1)}`;
        flipCardBack.style.backgroundColor = `#${getColorFromType(type1)}`;
    } else {
        let type1 = pokemon.types[0].type.name;
        let type2 = pokemon.types[1].type.name;
        type.textContent = `${type1.charAt(0).toUpperCase() + type1.slice(1)}/${type2.charAt(0).toUpperCase() + type2.slice(1)}`;
        flipCardFront.style.backgroundImage = `linear-gradient(70deg, #${getColorFromType(type1)}, #${getColorFromType(type2)})`;
        flipCardBack.style.backgroundImage = `linear-gradient(70deg, #${getColorFromType(type1)}, #${getColorFromType(type2)})`;
    }
    stats = getStats(pokemon);
    for (stat of stats) {
        let li = document.createElement("h6");
        flipCardBack.appendChild(li);
        li.textContent = stat;
        li.setAttribute("class", "text-dark")
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
    let id = Math.floor(Math.random() * 1010) + 1;
    let sourcePokemon = await fetchPokemon(id);
    while (sourcePokemon == -1) {
        id = Math.floor(Math.random() * 1010) + 1;
        sourcePokemon = fetchPokemon(id);
    }
    let types = sourcePokemon.types;
    let typeHolder = document.getElementById("typeHolder");
    if (types.length == 1) {
        typeHolder.textContent = `Team generated with type ${types[0].type.name}. Hover over a card to view more stats.`;
    } else {
        typeHolder.textContent = `Team generated with types ${types[0].type.name} & ${types[1].type.name}. Hover over a card to view more stats.`;
    }
    getSimilarPokemon(sourcePokemon);
}

const button = document.getElementById("generate");
button.addEventListener("click", generatePokemon);