import { prismaClient } from "../application/database.js";

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        status: "error",
        message: "Access denied, token not found",
      });
    }

    const token = authHeader.split(" ")[1] || authHeader;

    let user = await prismaClient.user.findFirst({
      where: {
        token: token,
      },
    });

    if (!user) {
      const wali = await prismaClient.siswa.findFirst({
        where: {
          token: token,
        },
      });

      if (wali) {
        user = { ...wali, role: "WALI" };
      }
    }

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    if (!req.user || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        status: "error",
        message: "Access denied, role prohibited",
      });
    }
    next();
  };
};

export default { verifyToken, requireRole };
