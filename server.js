const express = require("express");
const app = express();
const fetch = require("node-fetch");
const { cached, cache } = require("./cache/cache");

const D_SERVER_HOST = "localhost";
const D_SERVER_PORT = "3000";

app.use(async (req, res, next) => {
  const isCached = cached(req);

  if (isCached) {
    console.log("Cached request! Returning from cache!");

    res.status(isCached.status);
    res.set(isCached.headers);
    res.send(isCached.body);
  } else {
    console.log("Request not cached!");

    const callRes = await fetch(
      `http://${D_SERVER_HOST}:${D_SERVER_PORT}${req.path}`,
      {
        method: req.method,
        body: req.body,
        headers: req.headers
      }
    );

    const cachedReq = await cache(req, callRes);
    res.set(cachedReq.headers);
    res.status(cachedReq.status);
    res.send(cachedReq.body);
  }
  next();
});

app.listen(8080);
