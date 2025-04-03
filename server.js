require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
const SMITHERY_API_KEY = process.env.SMITHERY_API_KEY;

app.use(cors());
app.use(express.json());

const SMITHERY_BASE_URL = "https://registry.smithery.ai";

// Middleware to attach authorization headers
const smitheryHeaders = {
    headers: {
        Authorization: `Bearer ${SMITHERY_API_KEY}`,
        "Content-Type": "application/json",
    },
};

// **Endpoint to List Available MCP Servers**
app.get("/list-mcp-servers", async (req, res) => {
    try {
        const response = await axios.get(`${SMITHERY_BASE_URL}/servers`, smitheryHeaders);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch MCP servers" });
    }
});

// **Endpoint to Get Details of a Specific MCP Server**
app.get("/mcp-server/:qualifiedName", async (req, res) => {
    const { qualifiedName } = req.params;
    try {
        const response = await axios.get(`${SMITHERY_BASE_URL}/servers/${qualifiedName}`, smitheryHeaders);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch MCP server details" });
    }
});

// **Endpoint to Test MCP Server Connection**
app.post("/test-mcp", async (req, res) => {
    const { qualifiedName, config } = req.body;
    
    if (!qualifiedName || !config) {
        return res.status(400).json({ error: "Qualified name and config are required" });
    }

    try {
        // Convert config to Base64
        const configBase64 = Buffer.from(JSON.stringify(config)).toString("base64");
        const wsUrl = `https://server.smithery.ai/${qualifiedName}/ws?config=${configBase64}`;

        // Simulate WebSocket connection (You can implement an actual WebSocket client)
        res.json({ success: true, wsUrl });
    } catch (error) {
        res.status(500).json({ error: "Failed to connect to MCP server" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
