import { Router } from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { generateJWTTOKEN } from "../services/token.js";

const router = Router();
router.get("/login", (req, res) => {
    if(req.cookies.token){
        res.redirect("/")
    }
    res.render("login", {
        title: "Login | Sammi",
        isLogin: true,
        loginError: req.flash("loginError"),
    });
});


router.get("/register", (req, res) => {
    if(req.cookies.token){
        res.redirect("/")
    }
    res.render("register", {
        title: "Register | Sammi",
        isRegister: true,
        registerError: req.flash("registerError")
    })
})

router.get("/logout", (req, res) => {
    res.clearCookie("token"); // Token cookie-ni o‘chirish
    req.session.destroy((err) => {  // Sessionni o‘chirish
        if (err) {
            console.error("Sessionni o‘chirishda xatolik:", err);
        }
        res.redirect("/"); // Bosh sahifaga yo‘naltirish
    });
});


router.post("/login", async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        req.flash("loginError", "All fields is required")
        res.redirect("/login")
        return
    }
    const existUser = await User.findOne({ email });
    if (!existUser) {
        req.flash("loginError", "User not found")
        res.redirect("/login")
        return
    }

    const isPassEqual = await bcrypt.compare(
        password,
        existUser.password
    );
    if (!isPassEqual) {
        req.flash("loginError", "Password wrong")
        res.redirect("/login")
        return false;
    }

    console.log(existUser);
    const token = generateJWTTOKEN(existUser._id)
    res.cookie("token", token, { httpOnly: true, secure: true })
    res.redirect("/");
});


router.post("/register", async (req, res) => {
    const { firstname, lastname, email, password } = req.body
    if (!firstname || !lastname || !email || !password) {
        req.flash("registerError", "All fields is required")
        res.redirect("/register")
        return
    }
    const candidate = await User.findOne({ email })
    if (candidate) {
        req.flash("registerError", "User already exist")
        res.redirect("/register")
        return
    }

    const hashedPassord = await bcrypt.hash(password, 10);
    const useData = {
        firstName: firstname,
        lastName: lastname,
        email: email,
        password: hashedPassord,
    };
    const user = await User.create(useData);

    const token = generateJWTTOKEN(user._id)
    res.cookie("token", token, { httpOnly: true, secure: true })

    res.redirect("/");
});

export default router;
