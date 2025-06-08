require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { OpenAI } = require('openai')

const app = express()
app.use(cors())
app.use(express.json())

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

app.post('/generate', async (req, res) => {
    try {
        const { prompt } = req.body
        const chat = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 60
        })
        res.json({ response: chat.choices[0].message.content.trim() })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err.message })
    }
})

app.listen(3000, () => console.log('🔐 Proxy server listening on http://localhost:3000'))
