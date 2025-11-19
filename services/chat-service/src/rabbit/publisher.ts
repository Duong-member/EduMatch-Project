import amqp from "amqplib";


export async function publishMessage(queue: string, msg: any) {
const conn = await amqp.connect(process.env.RABBITMQ_URL || "amqp://localhost");
const ch = await conn.createChannel();
await ch.assertQueue(queue, { durable: true });
ch.sendToQueue(queue, Buffer.from(JSON.stringify(msg)), { persistent: true });
setTimeout(() => { ch.close(); conn.close(); }, 500);
}