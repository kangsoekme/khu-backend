import dashboardService from "../services/dashboard-service.js";

const getSuperAdminDashboard = async (req, res, next) => {
  try {
    const result = await dashboardService.getSuperAdminDashboard();
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getDirekturDashboard = async (req, res, next) => {
  try {
    const result = await dashboardService.getDirekturDashboard();
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getGuruDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await dashboardService.getGuruDashboard(userId);
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getSuperAdminDashboard,
  getGuruDashboard,
  getDirekturDashboard,
};
