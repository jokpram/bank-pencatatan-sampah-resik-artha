//controllers/authController.js
import authService from '../services/authService.js';
import { registerSchema, loginSchema } from '../validators/authValidator.js';

const register = async (req, res, next) => {
    try {
        const { error } = registerSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const user = await authService.registerUser(req.body);
        // Auto login or just return success?
        res.status(201).json({ message: 'User registered successfully', userId: user.id_pengguna });
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const { error } = loginSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { email, password, role } = req.body;
        // role is optional, defaults to user. Or we can try both tables.
        // Requirement says "User and Officer tables are separate".
        // "Separate login"? No, "Petugas Login saja".
        // I will check a 'role' param or try User first then Officer.

        let user;
        let userRole = 'user';

        // Simplistic approach: Try User, if fail and role=='officer', try Officer?
        // Proper way: "role" field in login body?
        if (role === 'petugas' || role === 'officer') {
            user = await authService.loginOfficer(email, password);
            userRole = 'officer';
        } else {
            user = await authService.loginUser(email, password);
        }

        const { accessToken, refreshToken } = authService.generateTokens(user, userRole);

        // Set Cookies
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 15 * 60 * 1000 // 15 mins
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Set Session
        // req.session.user = { id: userRole === 'user' ? user.id_pengguna : user.id_petugas, role: userRole };
        // Need to save session explicitly sometimes or let it auto-save
        // "Session stored inside Postgres"

        req.session.userId = userRole === 'user' ? user.id_pengguna : user.id_petugas;
        req.session.role = userRole;

        res.json({ message: 'Login successful', role: userRole, token: accessToken });
    } catch (err) {
        next(err);
    }
};

const logout = (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    req.session.destroy();
    res.json({ message: 'Logged out successfully' });
};

const getMe = async (req, res) => {
    // Data comes from req.user (JWT) or req.session
    // Requirement: "auth/me reading data from session & JWT"
    // We can return the combined state
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

    res.json({
        user: req.user,
        session: req.session ? { userId: req.session.userId, role: req.session.role } : null
    });
};

export default {
    register,
    login,
    logout,
    getMe
};
