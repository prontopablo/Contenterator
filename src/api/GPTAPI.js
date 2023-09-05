import { Configuration, OpenAIApi } from "openai";

export const getGPTResponse = async (userInput, gameType) => {
  try {
    const apiKey = localStorage.getItem('gptApiKey');
    
    if (!apiKey) {
      throw new Error("GPT API Key not found. Please set the API key.");
    }
    
    const openai = new OpenAIApi(new Configuration({ apiKey }));
    
    let prompt, systemPrompt;

    if (gameType === "tic-tac-toe") {
      prompt = `You are playing Tic Tac Toe. The following is the current board state:\n${userInput}\nYou are playing as O. Please respond with the best move by just replying with a number 
                0 (top left) to 8 (bottom right) (representing coordinates).`;
      systemPrompt = `You can improve your chances of winning by following these heuristics:\n1. If you have two in a row, complete it.\n2. If your opponent has two in a row, block it.\n3.
                      Remember, the array is 0 indexed so it's 0-8 NOT 1-9`;
    } 
    
    else if (gameType === "chess") {
      prompt = `You are playing Chess. The following is the current board state in FEN notation:\n${userInput}\nPlease respond with the best move for black using algebraic notation (e.g., 
                e2-e4).`;
      systemPrompt = `Check that your move is legal (the piece you are trying to move is still there etc.). Please respond with algebraic notation and nothing else so as not to mess up the JSON`;
    } 
    
    else if (gameType === "countdown") {
      prompt = `You are playing a game based on the UK quiz show Countdown. ONLY Using the letters provided: \n"${userInput}"\n make the longest possible English word by rearranging the letters`;
      systemPrompt = `Only use the letters provided, ensure the word exists and provide a short definition, before responding, ensure the word you respond with can be made up with the letters
                      provided, if the word does not exist, provide another word that does exist.`;
    }

    else {
      throw new Error("Invalid game type");
    }

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
        {
          role: "system",
          content: systemPrompt,
        },
      ],
    });

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error while getting GPT response:", error);
    return "Oops, something went wrong!";
  }
};
