/* L’API Rest et la Base de données : Créer un modèle Sequelize */
require('dotenv').config()

const { Sequelize, DataTypes } = require('sequelize')
const PokemonModel = require('../models/pokemons')
const UserModel = require('../models/user')
const pokemons = require('./mock-pokemon')
const bcrypt = require('bcrypt')
  
let sequelize

if(process.env.NODE_ENV === "production") {
   sequelize = new Sequelize('uytb8dnt38cx9k6l', 'nz8eqfmkx74drfl3', 'px962ktlgcclhm06', {
    host: 'lmc8ixkebgaq22lo.chr7pe7iynqr.eu-west-1.rds.amazonaws.com',
    dialect: 'mysql',
    logging: true
  });
} else {
   sequelize = new Sequelize('pokedex', process.env.DB_USER, process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
  });
}

const Pokemon = PokemonModel(sequelize, DataTypes)
const User = UserModel(sequelize, DataTypes)
  
// const initSQL = () => {
//   return sequelize.sync().then(async () => {
//     const pokemonCount = await Pokemon.count();
//     if (pokemonCount === 0) {
//       pokemons.forEach(pokemon => {
//         Pokemon.create({
//           name: pokemon.name,
//           hp: pokemon.hp,
//           cp: pokemon.cp,
//           picture: pokemon.picture,
//           types: pokemon.types
//         }).then(createdPokemon => console.log(createdPokemon.toJSON()));
//       });
//     }

//     bcrypt.hash('pikachu', 10)
//     .then(hash => User.create({ username: 'toto', password: hash}))
//     .then(user => console.log(user.toJSON()))

//     console.log('La base de donnée a bien été initialisée !')
//   })
// }
const initSQL = () => {
  return sequelize.sync().then(async () => {
    console.log('Synchronisation de la base de données réussie');

    const pokemonCount = await Pokemon.count();
    console.log(`Nombre de Pokémon dans la base de données: ${pokemonCount}`);

    const user = await User.findOne({ where: { username: 'toto' } });
    console.log(`Utilisateur 'toto' trouvé dans la base de données: ${user !== null}`);

    if (pokemonCount === 0) {
      pokemons.forEach(pokemon => {
        Pokemon.create({
          name: pokemon.name,
          hp: pokemon.hp,
          cp: pokemon.cp,
          picture: pokemon.picture,
          types: pokemon.types
        }).then(createdPokemon => console.log(createdPokemon.toJSON()));
      });
      console.log('Pokémons ajoutés à la base de données');
    }

    if (!user) {
      bcrypt.hash('pikachu', 10)
        .then(hash => User.create({ username: 'toto', password: hash }))
        .then(createdUser => console.log(createdUser.toJSON()));
      console.log('Utilisateur "toto" ajouté à la base de données');
    }

    console.log('La base de données a bien été initialisée !');
  });
};

  
module.exports = { 
  initSQL, Pokemon, User
}