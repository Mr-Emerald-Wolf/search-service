// src/utils/rabbitmq.client.ts
import amqp from 'amqplib';
import config from '../config';

let connection: amqp.Connection | null = null;
let channel: amqp.Channel | null = null;

export async function initRabbitMQClient(): Promise<void> {
  try {
    connection = await amqp.connect(config.rabbitmqUrl || 'amqp://localhost:5672');
    channel = await connection.createChannel();
    console.log('Connected to RabbitMQ');
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
    throw error;
  }
}

export function getRabbitMQChannel(): amqp.Channel {
  if (!channel) {
    throw new Error('RabbitMQ client not initialized');
  }
  return channel;
}

export async function publishMessage(queue: string, message: any): Promise<void> {
  const ch = getRabbitMQChannel();
  await ch.assertQueue(queue, { durable: true });
  ch.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
}

export async function closeRabbitMQConnection(): Promise<void> {
  if (channel) await channel.close();
  if (connection) await connection.close();
}
