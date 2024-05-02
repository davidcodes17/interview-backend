import express from "express";
import { login, profile, updateSeller } from "../controller/seller";

export const router = express.Router();

router.route("/login").post(login);
router.route("/profile").get(profile);
router.route("/account").put(updateSeller);

export default router;
