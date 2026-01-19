// middleware/authorizeRoles.js
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Ensure user exists (should already be from protect middleware)
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    // Check if user's role matches any of the allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied: insufficient permissions" });
    }

    // User has valid role → continue
    next();
  };
};
