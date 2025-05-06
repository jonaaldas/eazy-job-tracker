//https://nitro.unjs.io/config
import '../env'
import nitroCloudflareBindings from 'nitro-cloudflare-dev'
export default defineNitroConfig({
  srcDir: 'server',
  compatibilityDate: '2025-05-06',
  modules: [nitroCloudflareBindings],
  plugins: ['~~/plugins/database'],
})
