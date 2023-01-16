export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DB_URL,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5555
  },
  baseURL: process.env.BASE_URL,
  userId: process.env.authId
});