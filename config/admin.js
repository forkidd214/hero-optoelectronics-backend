module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'c7dd6d49fc5c7236fa426e854cbd6289'),
  },
});
