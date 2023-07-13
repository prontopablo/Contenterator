import { Configuration, OpenAIApi } from "openai";

const API_KEY = "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";
const openai = new OpenAIApi(new Configuration({ apiKey: API_KEY }));

export const getGPTResponse = async (userInput, gameType) => {
  try {
    let prompt;
    if (gameType === "tic-tac-toe") {
      prompt = `You are playing Tic Tac Toe. The following is the current board state:\n${userInput}\nYou are playing as O. Please respond with the best move by just replying with a number 
                0 to 8 (representing coordinates) (The array is 0 indexed).`;
    } else if (gameType === "chess") {
      prompt = `You are playing Chess. The following is the current board state in FEN notation:\n${userInput}\nPlease respond with the best move for black using algebraic notation (e.g., 
                e2-e4).`;
    } else {
      throw new Error("Invalid game type");
    }

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
        // Add a system message with heuristics for tic-tac-toe only
        {
          role: "system",
          content:
            gameType === "tic-tac-toe"
              ? `You can improve your chances of winning by following these heuristics:\n1. If you have two in a row, complete it.\n2. If your opponent has two in a row, block it.\n3.`
              : "Check that your move is legal (the piece you are trying to move is still there etc.). Please respond with algebraic notation and nothing else so as not to mess up the JSON", 
        },
      ],
    });

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error while getting GPT response:", error);
    return "Oops, something went wrong!";
  }
};
