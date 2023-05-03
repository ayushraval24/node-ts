import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import { merge } from "lodash";

export const isAuthenticted = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get token from cookie
    const sessionToken = req.cookies["APP-AUTH"];

    // if token does not exist
    if (!sessionToken) {
      return res.status(401).json({
        message: "Unauthorized access",
      });
    }

    // verify session token with user
    const existingUser = await User.findOne({ sessionToken: sessionToken });

    // no user found
    if (!existingUser) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    // add user with request object
    merge(req, { user: existingUser._id });
    next();
  } catch (err) {
    next(err);
  }
};
