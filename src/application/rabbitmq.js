import amqp from "amqplib";

let channel = null;

export const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    channel = await connection.createChannel();
    console.log("Connected to RabbitMQ");
  } catch (error) {
    console.error("Failed connect to RabbitMQ : ", error);
  }
};

export const sendToQueue = async (queueName, message) => {
  if (!channel) {
    throw new Error("Channel is not ready yet");
  }

  await channel.assertQueue(queueName, { durable: true });

  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });
};
