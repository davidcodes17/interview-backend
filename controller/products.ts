import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import conn from "../config/db";
import { ObjectId } from "mongodb";

const getProducts = async (req: Request, res: Response) => {
  const headers = req.headers["authorization"];
  const token = headers?.split(" ")[1];
  const limit = parseInt(req.query.limit as string) || 20;
  const offset = parseInt(req.query.offset as string) || 0;
  try {
    const validateToken: any = jwt.verify(token as string, "secret");
    if (validateToken.username) {
      const agg = [
        {
          $match: {},
        },
        {
          $sort: {
            price: 1,
            shipping_limit_date: 1,
          },
        },
        {
          $skip: offset,
        },
        {
          $limit: limit,
        },
      ];
      const products = await (await conn)
        ?.collection("olist_order_items")
        .aggregate(agg)
        .toArray();

      return res.status(200).json({ msg: "Success", data: products });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Unauthorized User",
    });
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  const headers = req.headers["authorization"];
  const { id } = req.params;
  const token = headers?.split(" ")[1];
  try {
    const validateToken: any = jwt.verify(token as string, "secret");
    if (validateToken.username) {
      const ids = new ObjectId(id);
      const products = await (await conn)
        ?.collection("olist_order_items")
        .deleteOne({ _id: ids });

      return res
        .status(200)
        .json({ msg: "Order Deleted Successfully", data: products });
    } else {
      return res.status(500).json({ msg: "Invalid Token" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Unauthorized User",
    });
  }
};

export { getProducts, deleteProduct };
