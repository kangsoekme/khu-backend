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
    const { page, limit, search, role } = req.query;
    const result = await userService.getUsers(page, limit, search, role);
    res.status(200).json({
      status: "success",
      data: result.data,
      meta: {
        totalData: result.totalData,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
      },
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
    // Logout seragam: hapus 1 session (device ini saja) berdasarkan token.
    // Tidak lagi membedakan user vs wali — service.logout(token) hapus baris
    // session spesifik, session device lain tetap aktif (multi-device).
    await userService.logout(req.token);
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

const deleteBulkUsers = async (req, res, next) => {
  try {
    const { ids } = req.body;
    await userService.deleteBulkUsers(ids);
    res
      .status(200)
      .json({ status: "success", data: "Berhasil menghapus user terpilih" });
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
  deleteBulkUsers,
};
