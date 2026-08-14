import { Prisma } from "@prisma/client";
import { ResponseError } from "../error/response-error.js";

const errorMiddleware = async (err, req, res, next) => {
  if (!err) {
    next();
    return;
  }

  // BE-8: standardisasi format respons error agar konsisten.
  // Selalu sertakan { status: "error", message }.
  if (err instanceof ResponseError) {
    res
      .status(err.status)
      .json({
        status: "error",
        message: err.message,
      })
      .end();
  } else {
    console.error("[UNHANDLED]", err);
    res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan pada server",
    });
  }
};

export { errorMiddleware };
