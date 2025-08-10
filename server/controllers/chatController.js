const OpenAI = require('openai');
const Chat = require('../models/Chat');
const Message = require('../models/Message');
const Log = require('../models/Log');
const Folder = require('../models/Folder');

// Initialize OpenAI client
const getOpenAIClient = (user) => {
  // Use user's key if available, otherwise use the server's key
  const apiKey = user.apiKey || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OpenAI API key is not configured.");
  }
  return new OpenAI({ apiKey });
};

// A helper function to generate a title using OpenAI
const generateChatTitle = async (userMessage, openai) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Use a fast model for this
      messages: [
        {
          role: 'system',
          content: 'You are an expert at creating short, concise, and relevant titles for chat conversations. Summarize the following user query into a title of 5 words or less. Do not use quotation marks in the title.',
        },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 15,
      temperature: 0.2,
    });
    return response.choices[0].message.content.trim().replace(/"/g, ''); // Clean up title
  } catch (error) {
    console.error("Error generating title:", error);
    return "New Chat"; // Fallback title
  }
};

// POST /api/chat/message
exports.handleNewMessage = async (req, res) => {
  const { chatId, messageContent, model, temperature, systemPrompt } = req.body;
  const userId = req.user._id;

  try {
    const openai = getOpenAIClient(req.user);
    const startTime = Date.now();
    let updatedChat = null;

    // 1. Check if we need to generate a title
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    if (chat.title === 'New Chat') {
      const newTitle = await generateChatTitle(messageContent, openai);
      chat.title = newTitle;
      // Also update settings sent with the first message
      chat.model = model;
      chat.temperature = temperature;
      chat.systemPrompt = systemPrompt;
      updatedChat = await chat.save();
    }

    // 2. Save user's message
    const userMessage = new Message({ chatId, role: 'user', content: messageContent });
    await userMessage.save();

    // 3. Fetch recent chat history to provide context
    const recentMessages = await Message.find({ chatId }).sort({ timestamp: 1 }).limit(20);
    const formattedMessages = [
      { role: "system", content: chat.systemPrompt }, // Use the chat's saved system prompt
      ...recentMessages.map(m => ({ role: m.role, content: m.content }))
    ];
    
    // 4. Call OpenAI API for the main response
    const completion = await openai.chat.completions.create({
      model: chat.model, // Use the chat's saved model
      messages: formattedMessages,
      temperature: chat.temperature, // Use the chat's saved temperature
    });
    const responseTime = Date.now() - startTime;

    // 5. Extract response and save assistant's message
    const assistantResponse = completion.choices[0].message.content;
    const tokenUsage = completion.usage;
    const assistantMessage = new Message({
      chatId,
      role: 'assistant',
      content: assistantResponse,
      tokenUsage: tokenUsage.total_tokens,
    });
    await assistantMessage.save();
    
    // 6. Log the API call
    await new Log({
      userId,
      chatId,
      model,
      inputTokens: tokenUsage.prompt_tokens,
      outputTokens: tokenUsage.completion_tokens,
      responseTime,
      success: true,
    }).save();
    
    // 7. Send response back to client, including the updated chat object if title was changed
    res.status(200).json({ assistantMessage, updatedChat });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ message: 'Error processing your message', error: error.message });
  }
};

// GET /api/chat/user-data
exports.getUserData = async (req, res) => {
    try {
        const userId = req.user._id;
        const chats = await Chat.find({ userId }).sort({ createdAt: -1 });
        const folders = await Folder.find({ userId }).sort({ name: 1 });
        res.json({ chats, folders });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// POST /api/chat/:chatId/settings
exports.updateChatSettings = async (req, res) => {
  try {
    const { model, temperature, systemPrompt } = req.body;
    const chat = await Chat.findOne({ _id: req.params.chatId, userId: req.user._id });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found or user not authorized' });
    }

    chat.model = model ?? chat.model;
    chat.temperature = temperature ?? chat.temperature;
    chat.systemPrompt = systemPrompt ?? chat.systemPrompt;
    
    const updatedChat = await chat.save();
    res.json(updatedChat);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// GET /api/chat/history/:chatId
exports.getChatHistory = async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId }).sort({ timestamp: 'asc' });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/chat/new
exports.createNewChat = async (req, res) => {
  try {
    const newChat = new Chat({ userId: req.user._id });
    await newChat.save();
    res.status(201).json(newChat);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PATCH /api/chat/:chatId/folder
exports.moveChatToFolder = async (req, res) => {
    try {
        const { folderId } = req.body;
        const chat = await Chat.findByIdAndUpdate(
            req.params.chatId,
            { folderId },
            { new: true }
        );
        if (!chat) return res.status(404).json({ message: 'Chat not found' });
        res.json(chat);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};