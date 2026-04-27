/**
 * Admin middleware — must be used AFTER authMiddleware.
 * Checks the isAdmin flag baked into the JWT by the login controller.
 * New registrations always get isAdmin: false, so this effectively
 * restricts admin routes to pre-existing accounts that were manually
 * granted admin status via make_admin.js.
 */
const adminMiddleware = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
  next();
};

module.exports = adminMiddleware;
