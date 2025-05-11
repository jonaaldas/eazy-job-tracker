import { z } from 'zod'
import { hash, compare } from 'bcryptjs'
import { users } from '~~/db/schema'
import { eq } from 'drizzle-orm'

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export default defineEventHandler(async event => {
  try {
    const { data, success, error } = await readValidatedBody(event, loginSchema.safeParse)

    if (!success) {
      throw createError({
        statusCode: 400,
        message: 'Validation error',
        data: error.errors,
      })
    }

    const user = await event.context.db.select().from(users).where(eq(users.email, data.email)).limit(1)

    const foundUser = user[0]

    if (!foundUser) {
      throw createError({
        statusCode: 401,
        message: 'Invalid credentials',
      })
    }

    const isPasswordValid = await compare(data.password, foundUser.password)

    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        message: 'Invalid credentials',
      })
    }

    const { password, ...userWithoutPassword } = foundUser

    return {
      user: userWithoutPassword,
      message: 'Login successful',
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        message: 'Validation error',
        data: error.errors,
      })
    }

    throw error
  }
})
