//middlewares/roleMiddleware.js
const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: `Forbidden: Requires one of roles [${roles.join(', ')}]` });
        }

        next();
    };
};

export default checkRole;
