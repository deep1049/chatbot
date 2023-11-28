import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Input,
  Button,
  VStack,
  Text,
  Center,
  Spinner,
  Heading,
} from "@chakra-ui/react";

const ChatBot = () => {
  const [userMessage, setUserMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, isLoading] = useState(false);

  const handleUserMessageChange = (e) => {
    setUserMessage(e.target.value);
  };

  const handleSubmit = async () => {
    if (!userMessage) return;

    // Send the user's message to the server
    try {
      isLoading(true);
      const response = await axios.post(
        "https://helpful-eel-sari.cyclic.app/bot",
        {
          userMessage,
        }
      );
      const botResponse = response.data.result;
      isLoading(false);
      // Store both the question and the answer in chat history
      setChatHistory([
        ...chatHistory,
        { role: "user", text: userMessage },
        { role: "bot", text: botResponse },
      ]);

      setUserMessage("");
    } catch (error) {
      console.error(error);
      isLoading(false);
    }
  };

  return (
    <VStack spacing={4} width="800px" margin={"auto"} marginTop={"100px"}>
      <Heading>Welcome to Chat-Bot </Heading>
      <Text>You Can Ask Anything to me.</Text>
      <Box
        border="1px solid #ccc"
        p={4}
        borderRadius="md"
        boxShadow="10px 10px lightblue"
        bgGradient="linear(to-r, white.200, white.500)"
        textAlign="center"
        // backgroundColor={"blue.300"}
      >
        <Text fontSize="lg" fontWeight="bold" marginBottom={"20px"}>
          ChatBot
        </Text>

        {chatHistory.map((message, index) => (
          <Box key={index}>
            <Text
              fontWeight={message.role === "bot" ? "bold" : "normal"}
              marginBottom={"10px"}
            >
              {message.role === "user" ? "You: " : "Response: "}
              {message.text}
            </Text>
          </Box>
        ))}
        <Input
          placeholder="Enter your message..."
          value={userMessage}
          onChange={handleUserMessageChange}
        />
        {loading ? (
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        ) : (
          <Button colorScheme="teal" onClick={handleSubmit} marginTop={"20px"}>
            Send
          </Button>
        )}
      </Box>
    </VStack>
  );
};

export default ChatBot;
