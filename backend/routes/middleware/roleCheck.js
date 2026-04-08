// middleware/roleCheck.js
const requireRole = (roles) => {
  return (req, res, next) => {
    console.log("MEOW", req.userData);
    console.log(roles);

    if (!roles.includes(req.userData.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

export default requireRole;
