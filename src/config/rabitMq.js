
import amqp from "amqplib";

let channel;

export const connectRabbitMQ =
async () => {

   const connection =
      await amqp.connect(
         "amqp://localhost"
      );

   channel =
      await connection.createChannel();

   await channel.assertQueue(
      "emailQueue"
   );

   console.log(
      "RabbitMQ Connected"
   );
};

export const getChannel = () =>
   channel;