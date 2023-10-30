const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { createChat } = require("completions");
require("dotenv").config();
const app = express();
const apiKey = process.env.OPENAI_API_KEY;
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.get("/", async (req, res) => res.send("welcome"));
const chat = createChat({
  apiKey: apiKey,
  model: "gpt-3.5-turbo-0613",
  // maxTokens: 100,
  functions: [
    {
      name: "get_current_weather",
      description: "Get the current weather in a given location",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "The city and state, e.g. San Francisco, CA",
          },
          unit: { type: "string", enum: ["celsius", "fahrenheit"] },
        },
        required: ["location"],
      },
      function: async ({ location }) => {
        let res_single = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${"3a2e0218f70357fb0958d65dd9ea9d7c"}&units=metric&sys=unix`
        );
        let data = await res_single.json();
        return {
          location: data.name, //weather api
          temperature: data.main.temp, //weather api
          unit: "celsius",
        };
      },
    },
  ],
  functionCall: "auto",
});
app.post("/bot", async (req, res) => {
  const { userMessage } = req.body;
  console.log(userMessage);
  try {
    const response = await chat.sendMessage(userMessage);
    const result = response.content;
    console.log(result);
    res.json({ result });
  } catch (error) {
    console.log(error);
    const message = "it seems answer to this qestion not availbale";
    res.send({ message });
  }
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
