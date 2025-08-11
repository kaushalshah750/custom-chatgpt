const express = require('express');
const { 
    handleNewMessage, 
    getUserData,
    getChatHistory, 
    createNewChat, 
    moveChatToFolder,
    streamNewMessage,
    updateChatSettings
} = require('../controllers/chatController');

const { protect } = require('../middleware/auth');
const router = express.Router();

router.use(protect); // All chat routes are protected

router.post('/message', handleNewMessage);
router.post('/stream', streamNewMessage);
router.get('/user-data', getUserData);
router.get('/history/:chatId', getChatHistory);
router.post('/new', createNewChat);
router.patch('/:chatId/folder', moveChatToFolder);
router.patch('/:chatId/settings', updateChatSettings);


module.exports = router;