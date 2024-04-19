import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
const app = express();

app.use(express.json());
app.use(cors());

// nearbyy setup
import { NearbyyClient } from "@nearbyy/core";
const nearbyy = new NearbyyClient({
  API_KEY: process.env.NEARBYY_API_KEY,
});

// openai setup
import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/chat", async (req, res) => {
  const { message } = req.query;

  const context = await nearbyy.semanticSearch({
    limit: 3,
    query: message,
  });

  if (context.success) {
    const ctxMsg = context.data.items.map((item) => item.text).join("\n\n");
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        {
          role: "system",
          content: "RELEVANT CONTEXT TO THE USER'S QUERY: " + ctxMsg,
        },
        {
          role: "user",
          content: message,
        },
      ],
      model: "gpt-3.5-turbo",
    });

    res.send(response.choices[0].message.content);
  }
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
