import express from "express";
import cors from "cors";

import { publicRouter } from "../routes/public-api.js";
import { userRouter } from "../routes/api.js";
import { errorMiddleware } from "../middleware/error-middleware.js";

export const web = express();

web.use(cors());
web.use(express.json());
web.use(publicRouter);
web.use(userRouter);
web.use(errorMiddleware);
