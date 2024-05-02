import express from "express";
import { getProducts, deleteProduct } from "../controller/products";

export const router = express.Router();

router.route("/order_items").get(getProducts);
router.route("/order_items/:id").delete(deleteProduct);

export default router;
