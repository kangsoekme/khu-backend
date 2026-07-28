import backupService from "../services/backup-service.js";

const backupDatabase = async (req, res, next) => {
  try {
    const backupData = await backupService.getDatabaseBackup();

    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=backup-database.json",
    );
    res.status(200).send(JSON.stringify(backupData, null, 2));
  } catch (error) {
    next(error);
  }
};

const restoreDatabase = async (req, res, next) => {
  try {
    const backupData = req.body;
    const result = await backupService.restoreDatabaseBackup(backupData);

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
//
export default { backupDatabase, restoreDatabase };
