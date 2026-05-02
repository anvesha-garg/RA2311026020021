const LOG_URL = "http://20.207.122.201/evaluation-service/logs";

const stacks = ["backend", "frontend"];
const levels = ["debug", "info", "warn", "error", "fatal"];

const backendPackages = [
  "cache", "controller", "cron_job", "db", "domain",
  "handler", "repository", "route", "service"
];

const frontendPackages = [
  "api", "component", "hook", "page", "state", "style"
];

const commonPackages = ["auth", "config", "middleware", "utils"];

function isAllowedPackage(stack, pkg) {
  if (commonPackages.includes(pkg)) return true;
  if (stack === "backend") return backendPackages.includes(pkg);
  if (stack === "frontend") return frontendPackages.includes(pkg);
  return false;
}

async function Log(stack, level, pkg, message) {
  const authToken = process.env.ACCESS_TOKEN;

  if (!authToken) return;
  if (!stacks.includes(stack)) return;
  if (!levels.includes(level)) return;
  if (!isAllowedPackage(stack, pkg)) return;

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
    // logging should not stop main application flow
  }
}

module.exports = { Log };