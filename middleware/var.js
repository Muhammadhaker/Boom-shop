import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export default function (req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        res.locals.isAuth = false;
        return next();
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.locals.isAuth = true;  // Token to'g'ri bo'lsa autentifikatsiya mavjud
        res.locals.user = decoded;  // Foydalanuvchi ma'lumotlarini uzatish
    } catch (error) {
        console.error("Token tekshirishda xatolik:", error);
        res.locals.isAuth = false;  // Token xato bo'lsa autentifikatsiya yo'q
    }

    next();
}
