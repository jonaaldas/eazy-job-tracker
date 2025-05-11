import { eq } from 'drizzle-orm'
import { z, ZodError } from 'zod'
import { jobApplications } from '~~/db/schema'
import { createUpdateSchema } from 'drizzle-zod'

export default defineEventHandler(async event => {
  const db = event.context.db

  const { data, error } = await getValidatedRouterParams(
    event,
    z.object({
      id: z.string(),
    }).safeParse
  )

  if (error instanceof ZodError) {
    let message = 'Missing \n'
    error.issues.forEach(issue => {
      message += `${issue.path[0]}\n`
    })
    const e = new Error(message)
    e.stack = ''
    throw e
  }

  const { data: body, error: bodyError } = await readValidatedBody(
    event,
    z.object({
      companyName: z.string(),
      positionTitle: z.string(),
      status: z.string(),
      applicationDate: z.string(),
      location: z.string(),
      salaryRange: z.string(),
      contactPerson: z.string(),
      contactEmail: z.string(),
      notes: z.string(),
    }).safeParse
  )

  if (bodyError instanceof ZodError) {
    let message = 'Missing 1 \n'
    bodyError.issues.forEach(issue => {
      message += `123${issue.path[0]}\n`
    })
  }

  const jobUpdateSchema = createUpdateSchema(jobApplications)

  const parsed = jobUpdateSchema.parse(body)

  const job = await db
    .update(jobApplications)
    .set({
      ...parsed,
    })
    .where(eq(jobApplications.id, Number(data.id)))

  if (!job) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Job not found',
    })
  }

  return true
})
