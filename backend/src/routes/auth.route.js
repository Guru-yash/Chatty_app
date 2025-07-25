import express from "express";
import { checkAuth, login, logout, signup, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.protectRoute.js";


const router = express.Router();// define a router

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

// first check if user is authenticated then only allow to update profile
// protectRoute will act as middleware
router.put("/update-profile", protectRoute, updateProfile);

router.get("/check",protectRoute,checkAuth);

export default router;