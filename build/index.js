"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const zod_1 = require("zod");
const web_api_1 = require("@slack/web-api");
// Replace with your Slack Bot Token
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN || "";
const slack = new web_api_1.WebClient(SLACK_BOT_TOKEN);
const server = new mcp_js_1.McpServer({
    name: "slack-mcp-server",
    version: "1.0.0",
    capabilities: {
        resources: {},
        tools: {},
    },
});
// Tool: Send a message to a Slack channel
server.tool("send-slack-message", "Send a message to a Slack channel", {
    channel: zod_1.z.string().describe("Slack channel ID (e.g. C12345678)"),
    text: zod_1.z.string().describe("Message text to send"),
}, (_a) => __awaiter(void 0, [_a], void 0, function* ({ channel, text }) {
    try {
        const result = yield slack.chat.postMessage({ channel, text });
        return {
            content: [
                {
                    type: "text",
                    text: `Message sent to channel ${channel}. Timestamp: ${result.ts}`,
                },
            ],
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Failed to send message: ${error}`,
                },
            ],
        };
    }
}));
// Tool: List Slack channels
server.tool("list-slack-channels", "List public Slack channels", {}, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield slack.conversations.list({ types: "public_channel" });
        const channels = result.channels || [];
        const channelList = channels.map((c) => `${c.name} (${c.id})`).join("\n");
        return {
            content: [
                {
                    type: "text",
                    text: `Channels:\n${channelList}`,
                },
            ],
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Failed to list channels: ${error}`,
                },
            ],
        };
    }
}));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const transport = new stdio_js_1.StdioServerTransport();
        yield server.connect(transport);
        console.error("Slack MCP Server running on stdio");
    });
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
