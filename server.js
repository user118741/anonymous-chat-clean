const express = require('express');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let chatMessages = [];
let onlineUsers = new Set();

app.get('/api/messages', (req, res) => res.json(chatMessages));

app.get('/api/online', (req, res) => res.json({ count: onlineUsers.size }));

app.post('/api/heartbeat', (req, res) => {
    const { userId } = req.body;
    if (userId) onlineUsers.add(userId);
    res.json({ success: true });
});

app.post('/api/send', (req, res) => {
    const { nickname, text, userId } = req.body;
    if (nickname && text) {
        onlineUsers.add(userId);
        chatMessages.push({
            nickname: nickname,
            text: text,
            time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
        });
        if (chatMessages.length > 100) chatMessages.shift();
        res.json({ success: true });
    } else {
        res.status(400).json({ error: '内容不能为空' });
    }
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(3000, () => console.log('聊天服务器已启动: http://localhost:3000'));