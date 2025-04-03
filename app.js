const BASE_URL = "https://mcp-tester-vbk6.onrender.com"; // Replace with your backend URL

// **Search for MCP Servers**
async function searchServers() {
    const query = document.getElementById("searchQuery").value;
    const response = await fetch(`${BASE_URL}/list-mcp-servers?q=${query}`);
    const data = await response.json();
    
    const listElement = document.getElementById("serverList");
    listElement.innerHTML = "";
    data.servers.forEach(server => {
        const li = document.createElement("li");
        li.textContent = `${server.displayName} (${server.qualifiedName})`;
        listElement.appendChild(li);
    });
}

// **Get Details of a Specific Server**
async function getServerDetails() {
    const serverName = document.getElementById("serverName").value;
    const response = await fetch(`${BASE_URL}/mcp-server/${serverName}`);
    const data = await response.json();
    
    document.getElementById("serverDetails").textContent = JSON.stringify(data, null, 2);
}

// **Test MCP Server Connection**
async function testMCP() {
    const qualifiedName = document.getElementById("testServerName").value;
    const config = document.getElementById("config").value;

    if (!qualifiedName || !config) {
        document.getElementById("testResult").textContent = "Please enter server name and config.";
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/test-mcp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ qualifiedName, config: JSON.parse(config) }),
        });

        const data = await response.json();
        document.getElementById("testResult").textContent = data.success ? `WebSocket URL: ${data.wsUrl}` : "Connection Failed";
    } catch (error) {
        document.getElementById("testResult").textContent = "Error connecting to MCP server.";
    }
}
