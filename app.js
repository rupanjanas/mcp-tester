require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const WebSocket = require('ws');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

function connectToMCPViaWebSocket(qualifiedName, config, onMessage, onError, onClose) {
    const base64Config = Buffer.from(JSON.stringify(config)).toString('base64');
    const wsUrl = `wss://server.smithery.ai/${qualifiedName}/ws?config=${base64Config}`;
    const ws = new WebSocket(wsUrl);

    ws.on('open', () => {
        console.log('✅ WebSocket connection opened');
        
        // Send the config as the message after connection opens
        const message = JSON.stringify(config);
        console.log('📤 Sending to MCP:', message);
        ws.send(message);
    });

    ws.on('message', (data) => {
        console.log('📨 Received from MCP:', data);
        onMessage(data);
        ws.close(); // Optional: close after response
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

app.post('/test-mcp', (req, res) => {
    const { qualifiedName, config } = req.body;

    if (!qualifiedName || !config) {
        return res.status(400).json({
            success: false,
            message: 'qualifiedName and config are required',
        });
    }

    try {
        connectToMCPViaWebSocket(
            qualifiedName,
            config,
            (data) => {
                // Success callback
                res.status(200).json({
                    success: true,
                    result: data.toString(),
                });
            },
            (error) => {
                // Error callback
                res.status(500).json({
                    success: false,
                    message: 'MCP WebSocket call failed',
                    error: error.message,
                });
            }
        );
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'MCP connection error',
            error: error.message,
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
