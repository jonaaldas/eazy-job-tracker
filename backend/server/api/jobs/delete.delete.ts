import { eq } from 'drizzle-orm'
import { z, ZodError } from 'zod'
import { jobApplications } from '~~/db/schema'
import { tryCatch } from '~~/utils/try-catch'

export default defineEventHandler(async event => {
  const { data: queryData, error: queryError } = await getValidatedQuery(
    event,
    z.object({
      jobId: z.string(),
    }).safeParse
  )

  if (queryError instanceof ZodError) {
    let message = 'Missing jobId\n'
    queryError.issues.forEach(issue => {
      message += `${issue.path[0]}\n`
    })
    const e = new Error(message)
    e.stack = ''
    throw e
  }

  const db = event.context.db

  const { error: jobError } = await tryCatch(db.delete(jobApplications).where(eq(jobApplications.id, Number(queryData.jobId))))

  if (jobError) {
    throw jobError
  }

  return { success: true }
})
