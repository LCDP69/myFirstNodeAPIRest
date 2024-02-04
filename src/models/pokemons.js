/* L’API Rest et la Base de données : Créer un modèle Sequelize */

const validTypes = ['plante', 'Poison', 'Feu', 'Eau', 'Insecte', 'Vol', 'Normal', 'Electrik', 'Fée']

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Pokemon', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {msg: 'Le nom ne peut pas être vide.'},
          notNull: {msg: 'Le nom est une propriété requise.'}
        }
      },
      hp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: { msg: 'Utilisez uniquement des nombres entiers pour les points de vie.' },
          min: {
            args: [0],
            msg: 'Les points de vie doivent être supérieurs ou égaux à 0.'
          },
          max: {
            args: [999],
            msg: 'Les points de vie doivent être inférieurs ou égaux à 999. '
          },
          notNull: {msg: 'Les points de vie sont une propriété requise.'}
        }
      },
      cp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: { msg: 'Utilisez uniquement des nombres entiers pour les points de dégâts.' },
          min: {
            args: [0],
            msg: 'Les points de dégâts doivent être supérieurs ou égaux à 0.'
          },
          max: {
            args: [99],
            msg: 'Les points de dégâts doivent être inférieurs ou égaux à 99. '
          },
          notNull: {msg: 'Les points de dégâts sont une propriété requise.'}
        }
      },
      picture: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isUrl: {msg: 'Utilisez uniquement une URL valide pour l\'image.'},
          notNull: {msg: 'L\'image est une propriété requise.'}
        }
      },
      types: {
        type: DataTypes.STRING,
        allowNull: false,
        // Ici nous mettons en place deux choses, un getter et un setter pour pouvoir faire en sorte que le code et la BDD comprennent le même langage et exécutent les demandes correctement lors de l'implémentation POST des nouvelles données 
        get() {
          return this.getDataValue('types').split(',')
        },
        set(types) {
          this.setDataValue('types', types.join())
        },
        // On définit une fonction isTypesValid, un nom arbitraire qu'on a défini sur notre validateur personnalisé. Ensuite, ce validateur va prendre en paramètre une valeur value correspondant à la valeur de la propriété types dans la base de données // On rentre une info de type chaine de caractères, et on définit le condition de l'erreur client, c'est du js natif. Throw new error, combiné à sequalize, permet d'identifier les erreurs et de retourner les messages d'erreur 
        validate: {
          isTypesValid(value) {
            if(!value) {
              throw new Error('Un pokémon doit au moins avoir un type.')
            }
            if(value.split(',').lenght > 3) {
              throw new Error('Un pokémon ne peut pas avoir plus de trois types.')
            }
            try{
            value.split(',').forEach(type => {
              if(!validTypes.includes(type)) {
                throw new Error(`Le type d'un pokémon doit appartenir à la liste suivante : ${validTypes}`)
              }
            });
          } catch (error) {
            console.error(error.message);
          }
          }
        }
      }
    }, {
      timestamps: true,
      createdAt: 'created',
      updatedAt: false
    })
  }