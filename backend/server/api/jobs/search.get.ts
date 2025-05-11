import { z, ZodError } from 'zod'
import { tryCatch } from '~~/utils/try-catch'
import { jobApplications } from '~~/db/schema'
import { like, or } from 'drizzle-orm'

export default defineEventHandler(async event => {
  const db = event.context.db

  const { data: queryData, error: queryError } = await getValidatedQuery(
    event,
    z.object({
      searchTerm: z.string(),
    }).safeParse
  )

  if (queryError instanceof ZodError) {
    throw new Error('Invalid search term')
  }

  const { data: jobs, error: jobsError } = await tryCatch(
    db
      .select()
      .from(jobApplications)
      .where(
        or(
          like(jobApplications.positionTitle, `%${queryData.searchTerm}%`),
          like(jobApplications.companyName, `%${queryData.searchTerm}%`),
          like(jobApplications.location, `%${queryData.searchTerm}%`)
        )
      )
  )

  if (jobsError) {
    throw jobsError
  }

  const columns: Columns = {
    wishlist: {
      id: 'wishlist',
      title: 'Wishlist',
      description: "Jobs you're interested in but haven't applied to yet",
      color: '#6366F1', // Indigo
      jobs: [],
    },
    applied: {
      id: 'applied',
      title: 'Applied',
      description: 'Applications that have been submitted',
      color: '#8B5CF6', // Violet
      jobs: [],
    },
    interview: {
      id: 'interview',
      title: 'Interview',
      description: 'Received interview invitation',
      color: '#EC4899', // Pink
      jobs: [],
    },
    offer: {
      id: 'offer',
      title: 'Offer',
      description: 'Received job offer',
      color: '#10B981', // Emerald
      jobs: [],
    },
    rejected: {
      id: 'rejected',
      title: 'Rejected',
      description: 'Applications that were declined',
      color: '#6B7280', // Gray
      jobs: [],
    },
  }
  for (const job of jobs) {
    columns[job.status.toLowerCase()].jobs.push({
      id: job.id.toString(),
      companyName: job.companyName,
      url: '',
      description: job.notes,
      positionTitle: job.positionTitle,
      status: job.status,
      applicationDate: job.applicationDate,
      location: job.location,
      salaryRange: job.salaryRange,
      contactPerson: job.contactPerson,
      contactEmail: job.contactEmail,
      notes: job.notes,
      createdAt: new Date(job.createdAt),
      updatedAt: new Date(job.updatedAt),
    })
  }

  return {
    columns,
  }
})
