import fs from 'fs';
import path from 'path';

const logFilePath = path.resolve('logs', 'requests.log');

if (!fs.existsSync(path.dirname(logFilePath))) {
  fs.mkdirSync(path.dirname(logFilePath));
}
export const logger = (req, res, next) => {
  const logData = {
    time: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    ip: req.ip || req.connection.remoteAddress,
  };

  const logEntry = `${logData.time} - ${logData.method} ${logData.url} - ${logData.ip}\n`;

  fs.appendFileSync(logFilePath, logEntry, 'utf8');

  next();
};
