import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { router as authRoutes } from "./routes/authRoute";
import { router as productRouts } from "./routes/productRouts";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({ msg: "END ROUTE" });
});

app.use("/", authRoutes);
app.use("/", productRouts);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT} 🚀`);
});
