import backupService from "../services/backup-service.js";

const jakartaToday = () =>
  new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString().split("T")[0];

const backupDatabase = async (req, res, next) => {
  try {
    const backupFile = await backupService.getDatabaseBackup();

    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="backup_khu_${jakartaToday()}.json"`,
    );
    res.status(200).send(JSON.stringify(backupFile, null, 2));
  } catch (error) {
    next(error);
  }
};

const restoreDatabase = async (req, res, next) => {
  try {
    // Body = langsung objek file backup (plain JSON).
    const backupFile = req.body;

    const result = await backupService.restoreDatabaseBackup(backupFile, {
      // Pertahankan session admin yang sedang merestore (tidak auto-logout).
      currentToken: req.token,
    });

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default { backupDatabase, restoreDatabase };
