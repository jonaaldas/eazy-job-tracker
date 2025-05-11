import * as z from 'zod'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '../.env') })
console.log(process.env)
export const backendEnv = z.object({
  DATABASE_URL: z.string().optional(),
})

const env = {
  backend: null,
}

try {
  const backendEnvSchema = backendEnv.parse(process.env)
  env.backend = backendEnvSchema
} catch (error) {
  if (error instanceof z.ZodError) {
    let message = 'Missing required values in .env:\n'
    error.issues.forEach(issue => {
      message += `${issue.path[0]}\n`
    })
    const e = new Error(message)
    e.stack = ''
    throw e
  } else {
    console.error(error)
  }
}

export default env
