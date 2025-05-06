// schema.ts
import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

// Users table
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
})

// Job applications table
export const jobApplications = sqliteTable('job_applications', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  companyName: text('company_name').notNull(),
  positionTitle: text('position_title').notNull(),
  status: text('status').notNull().default('Wishlist'),
  applicationDate: text('application_date'),
  location: text('location'),
  salaryRange: text('salary_range'),
  contactPerson: text('contact_person'),
  contactEmail: text('contact_email'),
  notes: text('notes'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
})

// Reminders table
export const reminders = sqliteTable('reminders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  applicationId: integer('application_id')
    .notNull()
    .references(() => jobApplications.id),
  date: text('date').notNull(),
  description: text('description').notNull(),
  completed: integer('completed', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
})
