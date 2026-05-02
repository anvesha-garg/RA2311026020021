const LOG_URL = "http://20.207.122.201/evaluation-service/logs";

const validStacks = ["backend", "frontend"];
const validLevels = ["debug", "info", "warn", "error", "fatal"];

const backendPackages = [
  "cache", "controller", "cron_job", "db",
  "domain", "handler", "repository", "route", "service"
];

const frontendPackages = [
  "api", "component", "hook", "page", "state", "style"
];

const commonPackages = ["auth", "config", "middleware", "utils"];

function isValidPackage(stack, pkg) {
  if (commonPackages.includes(pkg)) return true;
  if (stack === "backend") return backendPackages.includes(pkg);
  if (stack === "frontend") return frontendPackages.includes(pkg);
  return false;
}

async function Log(stack, level, pkg, message) {
  const authToken = process.env.ACCESS_TOKEN;

  if (!authToken) return;

  // basic validation (important for scoring)
  if (!validStacks.includes(stack)) return;
  if (!validLevels.includes(level)) return;
  if (!isValidPackage(stack, pkg)) return;

  try {
    await fetch(LOG_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        stack,
        level,
        package: pkg,
        message,
      }),
    });
  } catch {
    // logging should never break app flow
  }
}

module.exports = { Log };