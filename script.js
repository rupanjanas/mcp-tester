const axios = require("axios");

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
const WebSocket = require("ws");

function connectToMCP(qualifiedName, config) {
    const base64Config = Buffer.from(JSON.stringify(config)).toString("base64");
    const wsUrl = `wss://server.smithery.ai/${qualifiedName}/ws?config=${base64Config}`;
    
    const ws = new WebSocket(wsUrl);
    
    ws.on("open", () => console.log("Connected to MCP Server"));
    ws.on("message", (data) => console.log("Received:", data));
    ws.on("error", (err) => console.error("WebSocket Error:", err));
    ws.on("close", () => console.log("Connection closed"));
}
async function testMCPServer(installationCode) {
    try {
        const response = await axios.post("https://smithery.ai/api/test-mcp", {
            code: installationCode
        });
        return response.data;
    } catch (error) {
        throw new Error("Failed to connect to MCP server");
    }
} 