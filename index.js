import express from "express";
import { create } from "express-handlebars";
import AuthRoutes from "./routes/auth.js";
import ProductsRoutes from "./routes/products.js";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import flash from "connect-flash";
import session from "express-session";
import cookieParser from "cookie-parser";

import varMiddleware from "./middleware/var.js"
import userMiddleware from "./middleware/user.js";
import hbsHelper from "./utils/index.js"
dotenv.config();

const app = express();
const hbs = create({
  defaultLayout: "main",
  extname: "hbs",
  helpers:hbsHelper
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "./views");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser())
app.use(flash());
app.use(session({secret: "Sammi",resave: false,saveUninitialized: false,}));
app.use(varMiddleware)
app.use(userMiddleware)

app.use(AuthRoutes);
app.use(ProductsRoutes);

// 🔴 MONGO_URI mavjudligini tekshiramiz
if (!process.env.MONGO_URI) {
  console.error("Error: MONGO_URI is not defined in .env file");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

const PORT = process.env.PORT || 4100;
app.listen(PORT, () => console.log(`Server is running on port:${PORT}`));

