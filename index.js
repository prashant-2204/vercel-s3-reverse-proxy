const express = require("express");
const httpProxy = require("http-proxy");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const proxy = httpProxy.createProxy();
const PORT = process.env.PORT || 8000;
const BASE_PATH = process.env.BASE_PATH;

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  const hostName = req.hostname;
  const subDomain = hostName.split(".")[0];
  const resolvesTo = `${BASE_PATH}/${subDomain}`;
  console.log(resolvesTo);
  return proxy.web(req, res, { target: resolvesTo, changeOrigin: true });
});

proxy.on('proxyReq', (proxyReq, req, res) => {
  const url = req.url;
  if (url === '/')
    proxyReq.path += 'index.html';
});

app.listen(PORT, () => {
  console.log(`Reverse proxy is running on port ${PORT}`);
});
