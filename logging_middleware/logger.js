const LOG_URL = "http://20.207.122.201/evaluation-service/logs";

/**
 * simple reusable logger for sending logs to evaluation server
 * keeps logging isolated so it doesn't break main app flow
 */
async function Log(stack, level, pkg, message) {
  const authToken = process.env.ACCESS_TOKEN;

  if (!authToken) {
    // silently skip if token not available
    return;
  }

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
  } catch (err) {
    // intentionally not throwing — logging failure shouldn't affect app
  }
}

module.exports = { Log };