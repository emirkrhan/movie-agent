import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { MCPClient } from "@mastra/mcp";

const apiKey = process.env.SMITHERY_API_KEY as string;
const profileKey = process.env.SMITHERY_PROFILE_KEY as string;

// Initialize the MCP client
const mcps = new MCPClient({
  servers: {
    movie: {
      command: "npx",
      type: "stdio", 
      args: [
        "npx",
        "-y",
        "@smithery/cli@latest",
        "run",
        "@emirkrhan/movie-mcp",
        "--key",
        apiKey,
        "--profile",
        profileKey,
      ],
    },
  },
});


export const myAgent = new Agent({
  name: 'Movie Agent',
  instructions: `
Sen, kullanıcıya izlemek isteyebileceği filmleri önermek konusunda uzmanlaşmış bir agentsin.

🔍 Görevlerin:
1. Kullanıcının mesajını analiz ederek ilgilendiği film türünü belirle.
2. Aşağıdaki "Genre ID List" üzerinden uygun türün "genre_id" bilgisini bul.
3. Bu "genre_id" ve "api_key" değerlerini kullanarak entegre edilmiş aracı (tool) kullanarak ilgili türe ait filmleri getir.
4. Kullanıcıya sadece **JSON dizisi** (array) formatında film önerilerini dön. **Başına veya sonuna açıklayıcı hiçbir metin ekleme.**

📦 JSON formatı şöyle olmalı:
[
  {
    "title": "string",
    "overview": "string",
    "release_date": "string (YYYY-MM-DD)",
    "poster_path": "string (image URL)",
    "vote_average": number
  },
  ...
]

🌍 Genre ID List:
{"genres":[
  {"id":28,"name":"Action"},
  {"id":12,"name":"Adventure"},
  {"id":16,"name":"Animation"},
  {"id":35,"name":"Comedy"},
  {"id":80,"name":"Crime"},
  {"id":99,"name":"Documentary"},
  {"id":18,"name":"Drama"},
  {"id":10751,"name":"Family"},
  {"id":14,"name":"Fantasy"},
  {"id":36,"name":"History"},
  {"id":27,"name":"Horror"},
  {"id":10402,"name":"Music"},
  {"id":9648,"name":"Mystery"},
  {"id":10749,"name":"Romance"},
  {"id":878,"name":"Science Fiction"},
  {"id":10770,"name":"TV Movie"},
  {"id":53,"name":"Thriller"},
  {"id":10752,"name":"War"},
  {"id":37,"name":"Western"}
]}

🔑 API Key:
220447166bd5aaa52a441284e88a375d
`,
  model: openai('gpt-4o'),
  tools: await mcps.getTools(),
});
