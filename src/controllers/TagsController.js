const knex = require("../database/knex")

class TagsController {

  async index(request, response) {
    const { user_id } = request.params

    const movietags = await knex("movietags")
    .where ({ user_id })

    return response.json(movietags)
  }

}

module.exports = TagsController