module.exports = ({ env }) => ({
  host: env("RAILWAY_STATIC_URL", "127.0.0.1"),
  port: env.int("PORT", 1337),
});
