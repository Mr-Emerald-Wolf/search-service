import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  esuser: string;
  espassword: string;
  eshost: string;
  rabbitmqUrl: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  esuser: process.env.ES_USER || "elastic",
  espassword: process.env.ES_PASSWORD || "changeme",
  eshost: process.env.ES_HOST || "http://localhost:9200",
  rabbitmqUrl: process.env.RABBITMQ_URL || "amqp://localhost:5672"
};

export default config;
