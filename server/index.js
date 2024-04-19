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
  // If you want to make the chatbot remember the full conversation,
  // you would need to pass in all of the previous messages in the
  // query. Because query params do not support arrays, you would need
  // transform this request into a POST request and pass in the messages
  // as a JSON object in the body of the request.
  const { message } = req.query;

  const context = await nearbyy.semanticSearch({
    limit: 3,
    query: message,
  });

  // we return an error message if the context retrieval is not successful
  if (!context.success) return res.send("I'm sorry, I don't understand.");

  // This could be another way to only use the context if it is successful
  // if (context.success) {
  const ctxMsg = context.data.items.map((item) => item.text).join("\n\n");
  const response = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant.",
      },
      {
        role: "system",
        content: "RELEVANT CONTEXT TO THE USER'S QUERY:\n " + ctxMsg,
      },
      // If you want to make the chatbot remember the full conversation,
      // here, you would add all of the previous messages (both user and AI messages)
      {
        role: "user",
        content: message,
      },
    ],
    model: "gpt-3.5-turbo",
  });

  res.send(response.choices[0].message.content);
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
