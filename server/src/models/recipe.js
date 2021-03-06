export default (sequelize, DataTypes) => {
  const Recipes = sequelize.define('Recipes', {
    recipeName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Recipe name is required'
        }
      }
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Upload an image'
        }
      }

    },
    mealType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Meal type is required'
        },
        isIn: {
          args: [
            ['breakfast', 'brunch', 'elevenses', 'lunch', 'tea', 'supper', 'dinner']
          ],
          msg: 'Any of the meal type is required'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: {
          msg: 'Please enter a description'
        }
      }
    },
    method: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: {
          msg: 'Please enter the method of cooking'
        }
      }
    },
    ingredients: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: {
          msg: 'Enter the required ingredients'
        }
      }
    },
    upvotes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },

    downvotes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    addedBy: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });
  Recipes.associate = (models) => {
    Recipes.hasMany(models.reviews, {
      foreignKey: 'recipeId'
    });

    Recipes.hasMany(models.favorites, {
      foreignKey: 'recipeId'
    });

    Recipes.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
  };
  return Recipes;
};
