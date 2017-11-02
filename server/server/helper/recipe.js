/**
 * @class recipe
 */
export default class recipe {
  /**
   * Create a new Recipe
   * @param {object} req
   * @param {object} res
   * @param {object} model
   * @returns  {JSON} Returns success or failure message
   */
  static createRecipe(req, res, model) {
    model
      .create({
        userId: req.decoded.id,
        recipeName: req.body.recipeName,
        mealType: req.body.mealType,
        description: req.body.description,
        method: req.body.method,
        ingredients: req.body.ingredients,

      })
      .then(recipes => res.status(201).send({
        success: true,
        data: recipes,
        message: 'Recipe successfully added'
      }))
      .catch(err => res.status(400).send(err));
  }
  /**
   * Update a  Recipe
   * @param {object} req
   * @param {object} res
   * @param {object} model
   * @returns  {JSON} Returns success or failure message
   */
  static editRecipe(req, res, model) {
    model
      .find({
        where: {
          userId: req.decoded.id,
          id: req.params.recipeId
        }
      })
      .then((recipes) => {
        if (!recipes) {
          return res.status(404).send({
            message: 'Recipe not found'
          });
        }
        return recipes
          .update({
            recipeName: req.body.recipeName || recipes.recipeName,
            mealType: req.body.mealType || recipes.mealType,
            description: req.body.description || recipes.description,
            method: req.body.method || recipes.method,
            ingredients: req.body.ingredients || recipes.ingredients,
          })
          .then(updatedRecipes => res.status(200).send({
            data: updatedRecipes,
            message: 'Recipe successfully updated'
          }));
      })
      .catch(err => res.status(400).send(err));
  }
  /**
   * Delete a  Recipe
   * @param {object} req
   * @param {object} res
   * @param {object} model
   * @returns  {JSON} Returns success or failure message
   */
  static deleteRecipe(req, res, model) {
    model
      .find({
        where: {
          userId: req.decoded.id,
          id: req.params.recipeId
        }
      })
      .then((recipes) => {
        if (!recipes) {
          return res.status(404).send({
            message: 'Recipe not found'
          });
        }
        return recipes
          .destroy()
          .then(() => res.status(200).send({
            message: 'recipe successfully deleted'
          }));
      })
      .catch(error => res.status(400).send(error));
  }
  /**
   * Get  Recipes
   * @param {object} req
   * @param {object} res
   * @param {object} model
   * @param {object} reviews
   * @returns  {JSON} Returns success or failure message
   */
  static getRecipe(req, res, model, reviews) {
    if (req.query.order || req.query.sort) {
      return model
        .findAll({
          order: [
            [req.query.sort, 'DESC']
          ],
          include: [
            {
              model: reviews,
              attributes: ['userId', 'recipeId', 'review'],
            }
          ]
        })
        .then(sortedRecipes => res.status(200).send(sortedRecipes));
    }
    return model
      .all()
      .then((recipes) => {
        if (recipes.length === 0) {
          return res.status(200).send({
            message: 'No recipes have been added'
          });
        }
        return res.status(200).send(recipes);
      })
      .catch(error => res.status(400).send(error));
  }
  /**
   * upvotes  a  Recipe
   * @param {object} req
   * @param {object} res
   * @param {object} model
   * @returns  {JSON} Returns success or failure message
   */
  static upvoteRecipes(req, res, model) {
    model
      .find({
        where: {
          id: req.params.recipeId
        }
      })
      .then((recipes) => {
        if (!recipes) {
          return res.status(404).send({
            message: 'Recipe not found'
          });
        }
        recipes.increment('upvotes')
          .then(() => {
            recipes.reload();
            res.status(200).send({
              message: `You have upvoted ${recipes.recipeName} recipe`
            });
          });
      })
      .catch(err => res.status(400).send(err));
  }
  /**
   * upvotes  a  Recipe
   * @param {object} req
   * @param {object} res
   * @param {object} model
   * @returns  {JSON} Returns success or failure message
   */
  static downvoteRecipes(req, res, model) {
    model
      .find({
        where: {
          id: req.params.recipeId
        }
      })
      .then((recipes) => {
        if (!recipes) {
          return res.status(404).send({
            message: 'Recipe not found'
          });
        }
        recipes.decrement('upvotes')
          .then(() => {
            recipes.reload();
            res.status(200).send({
              message: `You have downvoted ${recipes.recipeName} recipe`
            });
          });
      })
      .catch(err => res.status(400).send(err));
  }
}
