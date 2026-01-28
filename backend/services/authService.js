//services/authService.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Officer } from '../models/index.js';

const registerUser = async (data) => {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = await User.create({
        ...data,
        password: hashedPassword
    });
    return newUser;
};

const loginUser = async (email, password) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    return user;
};

const loginOfficer = async (email, password) => {
    const officer = await Officer.findOne({ where: { email } });
    if (!officer) {
        throw new Error('Officer not found');
    }

    const isMatch = await bcrypt.compare(password, officer.password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    return officer;
};

const generateTokens = (user, role) => {
    const payload = {
        id: role === 'user' ? user.id_pengguna : user.id_petugas,
        role: role,
        email: user.email
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

    return { accessToken, refreshToken };
};

export default {
    registerUser,
    loginUser,
    loginOfficer,
    generateTokens
};
