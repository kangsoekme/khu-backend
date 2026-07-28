import express from "express";

import userController from "../controller/user-controller.js";

const publicRouter = new express.Router();
publicRouter.post("/api/auth/login", userController.login);
publicRouter.post("/api/auth/wali/login", userController.loginWali);

export { publicRouter };
