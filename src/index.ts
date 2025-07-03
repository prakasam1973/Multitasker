import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { WebClient } from "@slack/web-api";

// Replace with your Slack Bot Token
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN || "";
const slack = new WebClient(SLACK_BOT_TOKEN);

const server = new McpServer({
  name: "slack-mcp-server",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

// Tool: Send a message to a Slack channel
server.tool(
  "send-slack-message",
  "Send a message to a Slack channel",
  {
    channel: z.string().describe("Slack channel ID (e.g. C12345678)"),
    text: z.string().describe("Message text to send"),
  },
  async ({ channel, text }) => {
    try {
      const result = await slack.chat.postMessage({ channel, text });
      return {
        content: [
          {
            type: "text",
            text: `Message sent to channel ${channel}. Timestamp: ${result.ts}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to send message: ${error}`,
          },
        ],
      };
    }
  }
);

// Tool: List Slack channels
server.tool(
  "list-slack-channels",
  "List public Slack channels",
  {},
  async () => {
    try {
      const result = await slack.conversations.list({ types: "public_channel" });
      const channels = result.channels || [];
      const channelList = channels.map((c: any) => `${c.name} (${c.id})`).join("\n");
      return {
        content: [
          {
            type: "text",
            text: `Channels:\n${channelList}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to list channels: ${error}`,
          },
        ],
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Slack MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
