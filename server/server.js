import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { db } from './config/database.js';
import { InsertManyError } from '@datastax/astra-db-ts';
dotenv.config();


const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS']
}));
app.use(express.json());

const LANGFLOW_BASE_URL = process.env.LANGFLOW_BASE_URL;
const LANGFLOW_TOKEN = process.env.LANGFLOW_TOKEN;

// Profile routes
app.post('/api/profile', async (req, res) => {
    
    try {
        const { 
            name, 
            dob, 
            dobTime, 
            uid,
            city, 
            state,
            country,
            gender, 
            latitude,
            longitude,
            planetData  // New field containing planet positions
        } = req.body;
        
        const profile = {
            name,
            dob,
            dobTime,
            city,
            state,
            country,
            gender,
            latitude,
            longitude,
            planetData,
            uid,  
            createdAt: new Date().toISOString()
        };

        console.log('Attempting to save profile:', profile);

        const result = await db.collection('soul').insertOne(profile);
        console.log('Profile saved to database:', result);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error creating profile:', error);
        console.error('Error details:', error.stack);
        res.status(500).json({ 
            error: 'Failed to create profile', 
            details: error.message 
        });
    }
});

// Verify environment variables
if (!LANGFLOW_BASE_URL || !LANGFLOW_TOKEN) {
    console.error('Missing required environment variables:');
    console.error('LANGFLOW_BASE_URL:', LANGFLOW_BASE_URL ? '✓' : '✗');
    console.error('LANGFLOW_TOKEN:', LANGFLOW_TOKEN ? '✓' : '✗');
    process.exit(1);
}

// Add a test endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is running' });
});

app.post('/api/chat', async (req, res) => {
    const { flowId, langflowId, inputValue, inputType = 'chat', outputType = 'chat', tweaks = {}, stream = false } = req.body;

    console.log('Received request:', { flowId, langflowId, inputValue });

    try {
        // Set stream to false since we'll handle streaming differently
        const endpoint = `${LANGFLOW_BASE_URL}`;
        console.log('Calling endpoint:', endpoint);

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${LANGFLOW_TOKEN}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                input_value: inputValue,
                input_type: inputType,
                output_type: outputType,
                tweaks: tweaks
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Langflow API Error:', {
                status: response.status,
                statusText: response.statusText,
                error: errorText
            });
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        // If we have a stream URL, fetch the actual content
        if (data.outputs?.[0]?.outputs?.[0]?.artifacts?.stream_url) {
            const streamUrl = `${LANGFLOW_BASE_URL}${data.outputs[0].outputs[0].artifacts.stream_url}`;
            const streamResponse = await fetch(streamUrl, {
                headers: {
                    'Authorization': `Bearer ${LANGFLOW_TOKEN}`
                }
            });
            
            if (!streamResponse.ok) {
                throw new Error(`Stream error: ${streamResponse.status}`);
            }

            const streamData = await streamResponse.text();
            // Update the response data with the actual content
            if (data.outputs?.[0]?.outputs?.[0]?.outputs?.message?.message) {
                data.outputs[0].outputs[0].outputs.message.message.text = streamData;
            }
        }

        res.json(data);
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ 
            error: error.message,
            details: error.stack
        });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Test the server: http://localhost:${PORT}/api/test`);
});

// Error handling
process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
}); 