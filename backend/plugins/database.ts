import { H3Event } from 'h3'
import type { D1Database } from '@cloudflare/workers-types'
import { drizzle } from 'drizzle-orm/d1'
declare module 'h3' {
  interface H3EventContext {
    db: import('drizzle-orm/d1').DrizzleD1Database
  }
}
export interface Env {
  DB: D1Database
}

export default defineNitroPlugin(nitroApp => {
  nitroApp.hooks.hook('request', (event: H3Event) => {
    event.context.db = drizzle((event.context.cloudflare.env as unknown as Env).DB)
  })
})
