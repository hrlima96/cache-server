let memCache = {};

const cached = req => memCache[makeKey(req)];

const cache = async (req, res) => {
  const key = makeKey(req);
  console.log(`Caching, key: ${key}`);

  memCache[key] = { status: "", headers: "", body: "" };
  memCache[key].status = res.status;
  memCache[key].body = await res.json();

  let newHeaders = {};
  Object.entries(res.headers.raw()).map((key, value) => {
    newHeaders[key[0]] = key[1][0];
  });
  memCache[key].headers = newHeaders;

  return memCache[key];
};

const makeKey = req => {
  return req.body
    ? `${req.path}${req.method}${req.body}`
    : `${req.path}${req.method}`;
};

module.exports = { cached, cache };
