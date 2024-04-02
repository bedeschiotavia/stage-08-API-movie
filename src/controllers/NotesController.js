const knex = require ("../database/knex")

class NotesController {
  async create (request, response){
    const { title, description, rating, movietags } = request.body
    const { user_id } = request.params;

    const [ movienote_id ] = await knex("movienotes").insert({
      title,
      description,
      rating,
      user_id
    })


    const movietagsInsert = movietags.map(name => {
      return {
        movienote_id,
        name,
        user_id
      }
    })

    await knex("movietags").insert(movietagsInsert)

    response.json()

  }

  async show(request, response){
    const { id } = request.params

    const movienotes = await knex("movienotes").where({ id }).first()
    const movietags = await knex("movietags").where({ movienote_id: id }).orderBy("name")

    return response.json({
      ...movienotes,
      movietags,
    })
  }

  async delete(request, response){
    const { id } = request.params

    await knex("movienotes").where({ id }).delete()

    return response.json()
  }

  async index(request,response){
    const { title, user_id, tags } = request.query

    let notes

    if (tags) {
      const filterTags = tags.split(',').map(tag => tag)
      
      notes = await knex ("movietags")
      .select([
        "movienotes.id",
        "movienotes.title",
        "movienotes.user_id"
      ])
      .where("movienotes.user_id", user_id)
      .whereLike("movienotes.title", `%${title}%`)
      .whereIn("name", filterTags)
      .innerJoin("movienotes", "movienotes.id", "movietags.movienote_id")
      .orderBy("movienotes.title")

    } else {
      notes = await knex ("movienotes")
      .where({ user_id })
      .whereLike("title",`%${title}%`)
      .orderBy("title")
    }

    const userTags = await knex("movietags").where({ user_id })
    const notesWithTags = notes.map (note => {
      const noteTags = userTags.filter(tag => tag.note_id === note.id)

      return {
        ...note,
        tags: noteTags
      }
      
    })
    return response.json(notesWithTags)

  }
}

module.exports = NotesController