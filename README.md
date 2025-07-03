# Slack MCP Server

This project is a simple Model Context Protocol (MCP) server written in TypeScript that connects to Slack. It exposes tools to send messages and list channels using the Slack API.

## Features
- Send messages to Slack channels
- List public Slack channels
- Built with TypeScript and @modelcontextprotocol/sdk

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Set your Slack Bot Token:**
   - Create a `.env` file or set the `SLACK_BOT_TOKEN` environment variable with your Slack bot token.

3. **Build the project:**
   ```bash
   npx tsc
   ```

4. **Run the MCP server:**
   ```bash
   node build/index.js
   ```

## MCP Integration

- This server can be connected to Claude for Desktop or any MCP-compatible client.
- See https://modelcontextprotocol.io/quickstart/server for more info.

## Adding More Tools
- Add new tools in `src/index.ts` using the `server.tool` method.
- See the MCP SDK documentation for more examples.

## License
MIT
