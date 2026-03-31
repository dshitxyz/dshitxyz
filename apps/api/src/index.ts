import Fastify from "fastify";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env.local" });

const PORT = parseInt(process.env.API_PORT || "3001", 10);
const HOST = process.env.API_HOST || "0.0.0.0";

const fastify = Fastify({
  logger: true,
});

fastify.get("/health", async (request, reply) => {
  return { status: "ok" };
});

fastify.get("/api/v1/status", async (request, reply) => {
  return {
    status: "operational",
    timestamp: new Date().toISOString(),
  };
});

const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: HOST });
    console.log(`✅ API listening on http://${HOST}:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
