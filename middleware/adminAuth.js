const adminAuth = (req, res, next) => {
  const configuredSecret = process.env.ADMIN_SECRET;
  const secretFromRequest = req.headers['x-admin-secret'];

  if (!configuredSecret) {
    return res.status(500).json({ error: 'Admin secret is not configured' });
  }

  if (!secretFromRequest) {
    return res.status(401).json({ error: 'Missing admin secret' });
  }

  if (secretFromRequest !== configuredSecret) {
    return res.status(403).json({ error: 'Invalid admin secret' });
  }

  next();
};

export default adminAuth;
