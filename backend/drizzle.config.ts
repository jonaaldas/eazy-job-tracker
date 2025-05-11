import { defineConfig } from 'drizzle-kit'

const configurationDev = {
  dialect: 'sqlite' as const,
  out: 'drizzle',
  schema: 'src/db/schema',
  dbCredentials: {
    url: '.wrangler/state/v3/d1/miniflare-D1DatabaseObject/job-tracker.sqlite',
  },
}

const configurationProd = {
  dialect: 'sqlite' as const,
  driver: 'd1-http',
  schema: './db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    accountId: '8f93eff559fa01b7cd70c95ad3489142',
    databaseId: 'd5eb111c-9263-40ba-8e14-41b3842d4196',
    token: 'wh7AWNN1D3PswagtJRhRBdObmx3rBFGVhcgqskhS',
  },
}

export default defineConfig(process.env.NODE_ENV === 'production' ? configurationProd : configurationDev)
