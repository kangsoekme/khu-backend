import "dotenv/config";
import { web } from "./application/web.js";

const PORT = 5000;

web.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
