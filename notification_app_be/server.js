require("dotenv").config({ path: "./.env" });

const express = require("express");
const cors = require("cors");
const { Log } = require("../logging_middleware/logger");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const NOTIFICATION_API = "http://20.207.122.201/evaluation-service/notifications";

const priorityValue = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

// ---------------- FETCH ----------------
async function fetchNotifications() {
  await Log("backend", "info", "service", "fetching notifications from test server");

  const token = process.env.ACCESS_TOKEN;

  if (!token) {
    await Log("backend", "fatal", "config", "ACCESS_TOKEN missing in backend env");
    throw new Error("ACCESS_TOKEN not found");
  }

  const response = await fetch(NOTIFICATION_API, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    await Log("backend", "error", "service", `notification api failed with status ${response.status}`);
    throw new Error(`Notification API failed: ${response.status}`);
  }

  const data = await response.json();
  return data.notifications || [];
}

// ---------------- SORT ----------------
function sortNotifications(list) {
  return [...list].sort((a, b) => {
    const typeDiff = priorityValue[b.Type] - priorityValue[a.Type];

    if (typeDiff !== 0) {
      return typeDiff;
    }

    return new Date(b.Timestamp) - new Date(a.Timestamp);
  });
}

// ---------------- ROUTES ----------------
app.get("/", (req, res) => {
  res.json({
    message: "Backend running",
  });
});

// ALL notifications
app.get("/notifications", async (req, res) => {
  try {
    await Log("backend", "info", "route", "notifications endpoint hit");

    const notifications = await fetchNotifications();

    res.json({
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    await Log("backend", "error", "handler", error.message);

    res.status(500).json({
      error: "Could not fetch notifications",
      details: error.message, // helps debugging
    });
  }
});

// PRIORITY notifications
app.get("/priority-notifications", async (req, res) => {
  try {
    await Log("backend", "info", "route", "priority endpoint hit");

    const limit = Number(req.query.limit) || 10;

    const notifications = await fetchNotifications();
    const sorted = sortNotifications(notifications);

    const top = sorted.slice(0, limit);

    await Log("backend", "info", "service", `top ${limit} notifications prepared`);

    res.json({
      limit,
      count: top.length,
      notifications: top,
    });
  } catch (error) {
    await Log("backend", "error", "handler", error.message);

    res.status(500).json({
      error: "Could not prepare priority notifications",
      details: error.message,
    });
  }
});

// ---------------- START ----------------
app.listen(PORT);