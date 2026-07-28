import userService from "../services/user-service.js";

const addUser = async (req, res, next) => {
  try {
    const result = await userService.addUser(req.body);
    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    next(error);
  }
};

const editUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const result = await userService.editUser(userId, req.body);
    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const result = await userService.getUsers();
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const result = await userService.getUser(userId);
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await userService.login(req.body);
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const loginWali = async (req, res, next) => {
  try {
    const result = await userService.loginWali(req.body);
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    if (req.user.role === "WALI") {
      await userService.logoutWali(req.user.nis);
    } else {
      await userService.logout(req.user.email);
    }
    res.status(200).json({
      status: "success",
      data: "OK",
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    await userService.deleteUser(userId);

    res.status(200).json({
      status: "success",
      data: "OK",
    });
  } catch (error) {
    next(error);
  }
};

export default {
  addUser,
  editUser,
  login,
  loginWali,
  logout,
  getUsers,
  getUser,
  deleteUser,
};
