// Create a new service file to handle Langflow interactions
export class LangflowClient {
    constructor() {
        this.baseURL = 'http://localhost:5000/api';
    }

    async testConnection() {
        try {
            const response = await fetch(`${this.baseURL}/test`);
            const data = await response.json();
            console.log('Server test response:', data);
            return data;
        } catch (error) {
            console.error('Server connection test failed:', error);
            throw new Error('Cannot connect to server. Is it running?');
        }
    }

    async runFlow(flowIdOrName, langflowId, inputValue, inputType = 'chat', outputType = 'chat', tweaks = {}, stream = false, onUpdate, onClose, onError) {
        try {
            await this.testConnection();

            const response = await fetch(`${this.baseURL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    flowId: flowIdOrName,
                    langflowId,
                    inputValue,
                    inputType,
                    outputType,
                    tweaks,
                    stream
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }

            // Extract the message text from the response
            let messageText = '';
            if (data.outputs?.[0]?.outputs?.[0]?.outputs?.message?.message?.text) {
                messageText = data.outputs[0].outputs[0].outputs.message.message.text;
            } else if (data.outputs?.[0]?.outputs?.[0]?.results?.message?.text) {
                messageText = data.outputs[0].outputs[0].results.message.text;
            }

            if (messageText && onUpdate) {
                onUpdate({ chunk: messageText });
            } else {
                console.warn('No message text found in response:', data);
                onUpdate({ chunk: "I apologize, but I couldn't generate a response at this time." });
            }

            return data;
        } catch (error) {
            console.error('Error in runFlow:', error);
            if (onError) onError(error.message);
            throw error;
        }
    }
}

const langflowClient = new LangflowClient();
export default langflowClient; 