import "dotenv/config";
import { web } from "./application/web.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  web.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
};

startServer();
