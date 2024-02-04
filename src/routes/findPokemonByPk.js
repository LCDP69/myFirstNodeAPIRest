const { Pokemon } = require('../db/sequelize')
const pokemons = require('../models/pokemons')
const auth = require('../auth/auth')
  
module.exports = (app) => {
  app.get('/api/pokemons/:id', auth, (req, res) => {
    Pokemon.findByPk(req.params.id)
    .then(pokemon => {
      if(pokemon === null) {
        const message = 'Le pokémon demandé n\'existe pas. Réessayez avec un autre identifiant.';
        return res.status(404).json({message})
      }
      const message = 'Un pokémon a bien été trouvé.'
      res.json({ message, date: pokemon})
    })
    .catch(error => {
      const message = 'Le pokémon n\'a pas pu être récupéré. Réessayez dans quelques instants.'
      res.status(500).json({message, data: error})
    })
  })
}