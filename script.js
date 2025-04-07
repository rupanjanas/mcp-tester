const API_BASE = 'http://localhost:5000/api';

async function searchServers() {
    const query = document.getElementById('searchQuery').value;
    const res = await fetch(`${API_BASE}/servers?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    const list = document.getElementById('serverList');
    list.innerHTML = '';
    data.servers?.forEach(server => {
        const li = document.createElement('li');
        li.textContent = server.name;
        list.appendChild(li);
    });
}

async function getServerDetails() {
    const name = document.getElementById('serverName').value;
    const res = await fetch(`${API_BASE}/servers/${name}`);
    const data = await res.json();
    document.getElementById('serverDetails').textContent = JSON.stringify(data, null, 2);
}

async function testMCP() {
    const name = document.getElementById('testServerName').value;
    const config = document.getElementById('config').value;

    try {
        const res = await fetch(`${API_BASE}/test-mcp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                qualifiedName: name,
                config: JSON.parse(config)
            })
        });
        const data = await res.json();
        document.getElementById('testResult').textContent = data.success ? `✅ Result: ${data.result}` : `❌ Error: ${data.message}`;
    } catch (err) {
        document.getElementById('testResult').textContent = `❌ Invalid config or request failed`;
    }
}
