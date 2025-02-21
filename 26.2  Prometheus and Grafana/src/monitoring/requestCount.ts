import { NextFunction, Request, Response } from "express";
import client from "prom-client";

// const requestCounter = new client.Counter({
//   name: "request_count",
//   help: "Total request count",
//   labelNames: ["method", "route", "status_code"],
// });

const activeUserGauge = new client.Gauge({
  name: "active_user",
  help: "Total number of user whose request hasnt been resolved",
  labelNames: ["method", "route"],
});

export function requestCount(req: Request, res: Response, next: NextFunction) {
  activeUserGauge.inc({
    method: req.method,
    route: req.route ? req.route.path : req.path,
  });

  res.on("finish", () => {
    setTimeout(() => {
      activeUserGauge.dec({
        method: req.method,
        route: req.route ? req.route.route : req.path,
      });
    }, 1000);
  });

  //   requestCounter.inc({
  //     method: req.method, //GET POST
  //     route: req.route ? req.route.path : req.path, // /route
  //   });

  next();
}
