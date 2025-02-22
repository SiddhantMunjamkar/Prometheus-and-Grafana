import { NextFunction, Request, Response } from "express";
import client from "prom-client";

const requestCounter = new client.Counter({
  name: "request_count",
  help: "Total request count",
  labelNames: ["method", "route", "status_code"],
});

const httpRequestDurationMicroseconds = new client.Histogram({
  name: "http_request_duration_ms",
  help: "Duration of HTTP request in ms",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 5, 15, 100, 300, 500, 1000, 3000, 5000], //Define your own buckets her
});

const activeUserGauge = new client.Gauge({
  name: "active_user",
  help: "Total number of user whose request hasnt been resolved",
});

export function requestCount(req: Request, res: Response, next: NextFunction) {
  activeUserGauge.inc();
  const startTime = Date.now();

  res.on("finish", () => {
    activeUserGauge.dec();
    const endTime = Date.now();
    httpRequestDurationMicroseconds.observe(
      {
        method: req.method,
        route: req.route ? req.route.path : req.path,
        status_code: res.statusCode,
      },
      endTime - startTime
    );
  });

    requestCounter.inc({
      method: req.method, //GET POST
      route: req.route ? req.route.path : req.path, // /route
    });

  next();
}
