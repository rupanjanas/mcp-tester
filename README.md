# MCP Server Tester

## Overview
The MCP Server Tester is a web application that allows users to verify the connectivity and functionality of any MCP server by providing an installation code. It interacts with the Smithery MCP APIs and displays real-time connection results.

## Features
- Accepts MCP server installation code
- Connects to the provided MCP server
- Displays connection results dynamically
- Clean UI with html,css and javascript
- Deployed on Netlify(frontend)
- Deployed on Render(backend)

## Technologies Used
- **Frontend:** HTML, CSS , JavaScript
- **Backend:** Node.js, Express.js
- **API:** Smithery MCP API
- **Hosting:** Netlify

## Installation & Setup
### Prerequisites
Ensure you have the following installed:
- Node.js (v14 or later)
- Git

### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/mcp-server-tester.git
   cd mcp-server-tester
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm start
   ```
   The app should now be running at `http://localhost:3000`

## Usage
1. Enter the **installation code** from a marketplace like Smithery.
2. Click the **"Test MCP Server"** button.
3. The app will verify connectivity and display the results dynamically.

## Deployment
To deploy the application:
1. Push your code to GitHub:
   ```sh
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```
2. Deploy on Netlify:
   - **Netlify**: Connect your GitHub repo and deploy.
   

## API Reference
### Verify MCP Server
```sh
POST https://mcp-tester-vbk6.onrender.com
Headers: { "Content-Type": "application/json" }
Body: { "installationCode": "your-code" }
```

## License
This project is open-source under the MIT License.

---
For any issues, please open an [issue](https://github.com/yourusername/mcp-server-tester/issues).

