require("dotenv").config();
const { Log } = require("./logger");

async function run() {
  await Log("backend", "info", "middleware", "logger initialized");

  await Log("backend", "debug", "handler", "processing request started");

  await Log("backend", "error", "db", "failed to connect to db");

  await Log("backend", "fatal", "service", "critical failure occurred");
}

run();