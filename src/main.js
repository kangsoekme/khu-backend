import "dotenv/config";
import { web } from "./application/web.js";
import { connectRabbitMQ } from "./application/rabbitmq.js";

const PORT = 5000;

const startServer = async () => {
  await connectRabbitMQ();
  web.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
};

startServer();
