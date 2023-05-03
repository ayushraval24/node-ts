import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import { authentication, generateSalt } from "../helper/index";
import { Error } from "../interfaces/index";
import { get } from "lodash";

// login user
const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // email or password not provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "email and password are required" });
    }

    // find user by email
    const user = await User.findOne({ email: email }).select({
      email: 1,
      password: 1,
      salt: 1,
    });

    // user does not exist
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // get encrypted password
    const hashedPassword = authentication(user.salt || "", password);

    // password does not match
    if (hashedPassword != user.password) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // create session id for user
    const sessionToken = generateSalt();
    user.sessionToken = authentication(sessionToken, user._id.toString());
    await user.save();

    res.cookie("APP-AUTH", user.sessionToken, {
      domain: "localhost",
      path: "/",
    });

    return res.status(200).json({
      message: "Login successful",
    });
  } catch (err) {
    next(err);
  }
};

// user registration
const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, username, password } = req.body;

    console.log("HERE: ", email, typeof username, password);

    // missing  required parameters
    if (!email || !username || !password) {
      return res.status(400).json({
        success: false,
        message: "email, username and password must be provided",
      });
    }

    // user already registered
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.sendStatus(400);
    }

    // generate random salt value
    const salt = generateSalt();

    // encrypt password
    const hashedPassword = authentication(salt, password);

    // create new user
    const user = await User.create({
      email: email,
      username: username,
      password: hashedPassword,
      salt: salt,
    });

    return res
      .status(200)
      .json({ message: "user created successfully", data: user });
  } catch (err) {
    console.log("MY ERROR: ", err);
    next(err);
  }
};

// get user profile
const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get user id from request
    const userId = get(req, "user");
    console.log("Userid: ", userId);

    // get user profile
    const user = await User.findById(userId).select({
      _id: 1,
      email: 1,
      username: 1,
    });
    return res
      .status(200)
      .json({ message: "Profile fetched successfully", data: user });
  } catch (err) {
    next(err);
  }
};

// get all users
const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find().select({
      _id: 1,
      email: 1,
      username: 1,
      createdAt: 1,
      updatedAt: 1,
    });
    return res
      .status(200)
      .json({ message: "Users fetched successfully", data: users });
  } catch (err) {
    next(err);
  }
};

// get single user
const getSingelUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.params.id);

    // if user does not exist for given id
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // user exist for given id
    return res.status(200).json({ message: "User found", data: user });
  } catch (err) {
    next(err);
  }
};

// update user
const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json({ message: "User updated", data: updatedUser });
  } catch (err) {
    next(err);
  }
};

// delete user
const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
};

export default {
  register,
  login,
  getProfile,
  getAllUsers,
  getSingelUser,
  deleteUser,
  updateUser,
};
