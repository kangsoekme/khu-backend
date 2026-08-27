import backupService from "../services/backup-service.js";

const jakartaToday = () =>
  new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString().split("T")[0];

const backupDatabase = async (req, res, next) => {
  try {
    // Passphrase dikirim via query param (?passphrase=...) dan dipakai untuk
    // mengenkripsi file backup (AES-256-GCM). Minimal 8 karakter, divalidasi
    // lagi di service.
    const passphrase = (req.query.passphrase || "").trim();
    const backupFile = await backupService.getDatabaseBackup(passphrase);

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
    // Dua bentuk body yang didukung:
    // 1. Baru : { passphrase: "...", backup: { format: "KHU-BACKUP-V2", ... } }
    // 2. Lama : langsung objek backup plain JSON (frontend versi lama)
    const body = req.body || {};
    const isNewEnvelope = body && typeof body === "object" && "backup" in body;
    const backupFile = isNewEnvelope ? body.backup : body;
    const passphrase = (isNewEnvelope ? body.passphrase : req.query.passphrase) || "";

    const result = await backupService.restoreDatabaseBackup(
      backupFile,
      passphrase,
      // Pertahankan session admin yang sedang merestore (tidak auto-logout).
      { currentToken: req.token },
    );

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default { backupDatabase, restoreDatabase };
