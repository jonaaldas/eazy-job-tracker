import { users } from '~~/db/schema'

export default defineEventHandler(async event => {
  const results = await event.context.db.select().from(users)

  return {
    message: `Hello`,
    users: results,
  }
})
