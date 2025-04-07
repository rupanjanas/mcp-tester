require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const WebSocket = require("ws");

const app = express();
const PORT = process.env.PORT || 5000;
const SMITHERY_API_KEY = process.env.SMITHERY_API_KEY;

app.use(cors());
app.use(express.json());

const SMITHERY_BASE_URL = "https://server.smithery.ai/@smithery-ai/server-sequential-thinking";

const smitheryHeaders = {
  headers: {
    Authorization: `Bearer ${SMITHERY_API_KEY}`,
    "Content-Type": "application/json",
  },
};

// ✅ List all available MCP servers
app.get("/list-mcp-servers", async (req, res) => {
  try {
    const response = await axios.get(`${SMITHERY_BASE_URL}/servers`, smitheryHeaders);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch MCP servers" });
  }
});

// ✅ Get details of a specific MCP server
app.get("/mcp-server/:qualifiedName", async (req, res) => {
  const { qualifiedName } = req.params;
  try {
    const response = await axios.get(`${SMITHERY_BASE_URL}/servers/${qualifiedName}`, smitheryHeaders);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch MCP server details" });
  }
});

// ✅ Test MCP Server using WebSocket
app.post("/test-mcp", async (req, res) => {
  const { qualifiedName, config } = req.body;

  if (!qualifiedName || !config) {
    return res.status(400).json({ error: "Qualified name and config are required" });
  }

  try {
    const configBase64 = Buffer.from(JSON.stringify(config)).toString("base64");
    const wsUrl = `wss://server.smithery.ai/${qualifiedName}/ws?config=${configBase64}`;

    const ws = new WebSocket(wsUrl, {
      headers: {
        Authorization: `Bearer ${SMITHERY_API_KEY}`,
      },
    });

    let result = "";

    ws.on("message", (data) => {
      result += data.toString();
    });

    ws.on("close", () => {
      res.json({ success: true, result });
    });

    ws.on("error", (err) => {
      res.status(500).json({ error: "WebSocket error", details: err.message });
    });

  } catch (error) {
    res.status(500).json({ error: "Failed to connect to MCP server" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ MCP Tester backend running on port ${PORT}`);
});
