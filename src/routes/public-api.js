import express from "express";

import userController from "../controller/user-controller.js";

const publicRouter = new express.Router();
publicRouter.post("/api/auth/login", userController.login);

export { publicRouter };
