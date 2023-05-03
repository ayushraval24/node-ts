import express from "express";
import userController from "../controllers/user.controller";
import { isAuthenticted } from "../middlewares/authMiddleware";

export default (router: express.Router) => {
  router.post("/users/register", userController.register);
  router.post("/users/login", userController.login);
  router.get("/users/profile", isAuthenticted, userController.getProfile);
  router.get("/users", isAuthenticted, userController.getAllUsers);
  router.get("/users/:id", isAuthenticted, userController.getSingelUser);
  router.put("/users/:id", isAuthenticted, userController.updateUser);
  router.delete("/users/:id", isAuthenticted, userController.deleteUser);
};
