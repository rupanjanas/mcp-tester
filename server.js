// server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const WebSocket = require('ws');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// MCP Utility Functions
async function listMCPServers(query = "", page = 1, pageSize = 10) {
    const response = await axios.get("https://registry.smithery.ai/servers", {
        headers: {
            Authorization: `Bearer ${process.env.SMITHERY_API_KEY}`
        },
        params: { q: query, page, pageSize }
    });
    return response.data;
}

async function getMCPServer(qualifiedName) {
    const response = await axios.get(`https://registry.smithery.ai/servers/${qualifiedName}`, {
        headers: {
            Authorization: `Bearer ${process.env.SMITHERY_API_KEY}`
        }
    });
    return response.data;
}

function connectToMCPViaWebSocket(qualifiedName, config, onMessage, onError, onClose) {
    const base64Config = Buffer.from(JSON.stringify(config)).toString('base64');
    const wsUrl = `wss://server.smithery.ai/${qualifiedName}/ws?config=${base64Config}`;
    const ws = new WebSocket(wsUrl);

    ws.on('open', () => {
        console.log('✅ WebSocket connection opened');
        ws.send(JSON.stringify(config));
    });

    ws.on('message', (data) => {
        console.log('📨 Received from MCP:', data);
        onMessage(data);
        ws.close();
    });

    ws.on('error', (err) => {
        console.error('❌ WebSocket Error:', err);
        onError(err);
    });

    ws.on('close', () => {
        console.log('🔌 WebSocket closed');
        if (onClose) onClose();
    });
}

// Routes
app.get('/api/servers', async (req, res) => {
    try {
        const { q } = req.query;
        const data = await listMCPServers(q);
        res.json(data);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/servers/:name', async (req, res) => {
    try {
        const data = await getMCPServer(req.params.name);
        res.json(data);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/test-mcp', (req, res) => {
    const { qualifiedName, config } = req.body;

    if (!qualifiedName || !config) {
        return res.status(400).json({
            success: false,
            message: 'qualifiedName and config are required'
        });
    }

    try {
        connectToMCPViaWebSocket(
            qualifiedName,
            config,
            (data) => {
                res.status(200).json({ success: true, result: data.toString() });
            },
            (error) => {
                res.status(500).json({ success: false, message: 'WebSocket failed', error: error.message });
            }
        );
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unexpected error', error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
