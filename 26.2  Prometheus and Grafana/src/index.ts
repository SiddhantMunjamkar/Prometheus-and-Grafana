import express from "express";
import { Request, Response } from "express";
import { requestCount } from "./monitoring/requestCount";
import client from "prom-client";
const app = express();

// @ts-ignore
function middleware(req, res, next) {
  const startTime = Date.now();
  next();
  const endTime = Date.now();
  console.log("it took", endTime - startTime, "ms");
}

app.use(requestCount);

app.get("/user", (req, res) => {
  let user = {
    name: "siddhant",
    age: 20,
  };

  res.send({
    name: "siddhant",
  });
});

app.post("/user", (req, res) => {
  const user = req.body;
  res.send({
    name: "siddhant",
  });
});

app.get("/metrics", async (req: Request, res: Response) => {
  const metrics = await client.register.metrics();
  res.set("Content-Type", client.register.contentType);
  res.end(metrics);
});

app.listen(3000);
