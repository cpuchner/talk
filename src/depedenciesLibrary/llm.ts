import axios from 'axios';
import { Dialogue, Role } from '../talk';

const API_URL = 'http://127.0.0.1:8080'

const speakerMap: { [k in Role]: string } = {
  assistant: 'bob',
  user: 'alice',
}

export const llamaInvoke = (prompt: string, input: Dialogue, onDataFunction: (data: string) => void): Promise<string> => {
  const inputString = input.map(message => `${speakerMap[message.role]}: ${message.content}`).join('\n');
  const formattedPrompt = `### Instruction:\n ${prompt} \n ### Input:\n ${inputString} \n ### Response:\nbob:\n`;
  let answer = '';

  return new Promise(async (resolve, reject) => {
    const response = await axios({
      method: 'post',
      url: `${API_URL}/completion`,
      data: {
        prompt: formattedPrompt,
        temperature: 0.7,
        top_k: 40,
        top_p: 0.9,
        repeat_penalty: 1.3,
        // n_predict: 256,
        stream: true
      },
      responseType: 'stream',
    });
    response.data.on('data', (data: string) => {
      const t = Buffer.from(data).toString('utf8');
      if (t.startsWith('data: ')) {
        const message = JSON.parse(t.substring(6))
        const content = message.content.replace(/[^a-zA-Z0-9 .,!?'\n-]/g, '');
        answer += content;
        onDataFunction(content)
      }
    });
    response.data.on('end', () => {
      resolve(answer);
    });
  });
}
