## Logging Middleware

A reusable logging function was implemented to send logs to the evaluation server.

Function signature:
Log(stack, level, package, message)

- Supports both frontend and backend logging
- Validates stack, level, and package before sending logs
- Prevents invalid logs from being sent
- Logging failures do not interrupt application flow

Example usage:
- Log("backend", "info", "route", "notifications endpoint hit")
- Log("backend", "error", "db", "connection failed")