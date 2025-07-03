# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is an MCP server project in TypeScript that connects to Slack. It exposes tools to send messages and list channels using the Slack API.

## Key Features
- MCP server using @modelcontextprotocol/sdk
- Slack integration via @slack/web-api
- Tools for sending messages and listing channels
- TypeScript for type safety

## Development Guidelines
- Use TypeScript for all files
- Follow MCP SDK documentation: https://github.com/modelcontextprotocol/create-python-server
- Store secrets (like Slack tokens) in environment variables
- Use async/await for all async operations
- Add new tools as needed for Slack integration
