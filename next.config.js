module.exports = {
  reactStrictMode: true,
  env:{
    BASE_URL: process.env.BASE_URL,
    MONGODB_URL: process.env.MONGODB_URL,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
    CLOUD_UPLOAD_PRESET: process.env.CLOUD_UPLOAD_PRESET,
    CLOUD_NAME: process.env.CLOUD_NAME,
    CLOUD_API: process.env.CLOUD_API
  }
}