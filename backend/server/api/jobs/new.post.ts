import { z, ZodError } from 'zod'
import { tryCatch } from '~~/utils/try-catch'
import { jobApplications } from '~~/db/schema'
import { createInsertSchema } from 'drizzle-zod'
export default defineEventHandler(async event => {
  const userid = 1
  const jobApplicationInsertSchema = createInsertSchema(jobApplications)

  const { data, error } = await readValidatedBody(
    event,
    z.object({
      companyName: z.string(),
      positionTitle: z.string(),
      status: z.enum(['Wishlist', 'Applied', 'Interview', 'Offer', 'Rejected']),
      applicationDate: z.string(),
      location: z.string(),
      salaryRange: z.string(),
      contactPerson: z.string(),
      contactEmail: z.string(),
      notes: z.string(),
    }).safeParse
  )

  if (error instanceof ZodError) {
    let message = 'Missing required values in .env:\n'
    error.issues.forEach(issue => {
      message += `${issue.path[0]}\n`
    })
    const e = new Error(message)
    e.stack = ''
    throw e
  }

  const parsed = jobApplicationInsertSchema.parse({
    ...data,
    userId: userid,
  })

  const db = event.context.db

  const { data: dnInsertData, error: dnInsertError } = await tryCatch(
    db
      .insert(jobApplications)
      .values({
        companyName: data.companyName,
        positionTitle: data.positionTitle,
        status: data.status,
        applicationDate: data.applicationDate,
        location: data.location,
        salaryRange: data.salaryRange,
        contactPerson: data.contactPerson,
        contactEmail: data.contactEmail,
        notes: data.notes,
        userId: userid,
      })
      .returning()
  )

  if (dnInsertError) {
    throw createError({
      statusCode: 500,
      statusMessage: dnInsertError.message,
    })
  }

  return {
    success: true,
    data: dnInsertData,
  }
})
