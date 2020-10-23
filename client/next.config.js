module.exports = {
  env: {
    //
  },
  serverRuntimeConfig: {
    //
  },
  publicRuntimeConfig: {
    CMS_URL: process.env.CMS_URL,
    API_URL: process.env.API_URL,
    DEBUG: process.env.DEBUG,
    API_AUTH_REFRESH_ATTEMPT_COUNT: process.env.API_AUTH_REFRESH_ATTEMPT_COUNT,
    API_AUTH_REFRESH_ATTEMPT_PAUSE_MS: process.env.API_AUTH_REFRESH_ATTEMPT_PAUSE_MS,
    API_AUTH_REFRESH_LEEWAY_MS: process.env.API_AUTH_REFRESH_LEEWAY_MS,
  },
}