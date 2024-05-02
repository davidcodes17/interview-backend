import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import conn from "../config/db";

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!(username && password)) {
    return res.status(401).json({ msg: "All Fields are Required" });
  }

  const foundSeller = await (await conn)
    ?.collection("olist_sellers")
    .findOne({ seller_id: username, seller_zip_code_prefix: Number(password) });

  if (foundSeller != null) {
    const token = jwt.sign({ username }, "secret", {
      expiresIn: "2h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 360000,
    });

    return res.status(200).json({ msg: "Login successful", token: token });
    // return res.status(200).json({ data: foundSeller });
  } else {
    return res.status(401).send({ msg: "Invalid Credentials" });
  }
};
const updateSeller = async (req: Request, res: Response) => {
  const { seller_city, seller_state } = req.body;
  const headers = req.headers["authorization"];
  const token = headers?.split(" ")[1];

  try {
    const validateToken: any = jwt.verify(token as string, "secret");
    if (validateToken.username) {
      const seller = await (await conn)
        ?.collection("olist_sellers")
        .findOne({ seller_id: validateToken.username });

      if (seller != null) {
        const foundSeller = await (await conn)
          ?.collection("olist_sellers")
          .updateOne(
            { _id: seller?._id },
            { $set: { seller_city: seller_city, seller_state: seller_state } }
          );
        return res
          .status(200)
          .json({ msg: "Updated Successfully", data: foundSeller });
      } else {
        return res.status(400).json({ msg: "NO SELLER FOUND" });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Invalid Token" });
  }
};
const profile = async (req: Request, res: Response) => {
  const headers = req.headers["authorization"];
  const token = headers?.split(" ")[1];

  try {
    const validateToken: any = jwt.verify(token as string, "secret");
    if (validateToken.username) {
      const seller = await (await conn)
        ?.collection("olist_sellers")
        .findOne({ seller_id: validateToken.username });
      return res.status(200).json({ msg: "Success", data: seller });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: "Invalid Token" });
  }
};

export { login, updateSeller, profile };
