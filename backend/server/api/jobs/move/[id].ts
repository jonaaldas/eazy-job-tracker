import { eq } from 'drizzle-orm'
import { z, ZodError } from 'zod'
import { jobApplications, jobApplicationSchema } from '~~/db/schema'
import { tryCatch } from '~~/utils/try-catch'

const schema = z.object({
  jobId: z.coerce.number(),
  destination: z.string(),
})

export default defineEventHandler(async event => {
  const { data: routerData, error: routerError } = await getValidatedRouterParams(event, z.object({ id: z.string() }).safeParse)

  if (routerError instanceof ZodError) {
    let message = 'Missing job id\n'
    routerError.issues.forEach(issue => {
      message += `${issue.path[0]}\n`
    })
    const e = new Error(message)
    e.stack = ''
    throw e
  }

  const { data: bodyData, error: bodyError } = await readValidatedBody(event, schema.safeParse)

  if (bodyError instanceof ZodError) {
    let message = 'Missing destination\n'
    bodyError.issues.forEach(issue => {
      message += `${issue.path[0]}\n`
    })
    const e = new Error(message)
    e.stack = ''
    throw e
  }

  const db = event.context.db

  const { error: jobError } = await tryCatch(
    db
      .update(jobApplications)
      .set({ status: bodyData.destination as string })
      .where(eq(jobApplications.id, Number(routerData.id)))
  )

  if (jobError) {
    throw jobError
  }

  return { success: true }
})
