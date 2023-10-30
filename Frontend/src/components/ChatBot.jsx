import React, { useState } from "react";
import axios from "axios";
import { Box, Input, Button, VStack, Text, Center } from "@chakra-ui/react";

const ChatBot = () => {
  const [userMessage, setUserMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const handleUserMessageChange = (e) => {
    setUserMessage(e.target.value);
  };

  const handleSubmit = async () => {
    if (!userMessage) return;

    // Send the user's message to the server
    try {
      const response = await axios.post("http://localhost:8080/bot", {
        userMessage,
      });
      const botResponse = response.data.result;

      // Store both the question and the answer in chat history
      setChatHistory([
        ...chatHistory,
        { role: "user", text: userMessage },
        { role: "bot", text: botResponse },
      ]);

      setUserMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <VStack spacing={4} width="800px" margin={"auto"} marginTop={"100px"}>
      <Box
        border="1px solid #ccc"
        p={4}
        borderRadius="md"
        backgroundColor={"blue.300"}
      >
        <Text fontSize="lg" fontWeight="bold">
          ChatBot
        </Text>
        {chatHistory.map((message, index) => (
          <div key={index}>
            <Text
              fontWeight={message.role === "bot" ? "bold" : "normal"}
              marginBottom={"10px"}
            >
              {message.role === "user" ? "You: " : "Response: "}
              {message.text}
            </Text>
          </div>
        ))}
        <Input
          placeholder="Enter your message..."
          value={userMessage}
          onChange={handleUserMessageChange}
        />
        <Button colorScheme="teal" onClick={handleSubmit}>
          Send
        </Button>
      </Box>
    </VStack>
  );
};

export default ChatBot;
