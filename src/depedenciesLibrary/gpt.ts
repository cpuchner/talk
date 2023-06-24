import { Configuration, OpenAIApi } from 'openai';
import { Dialogue } from '../talk';

// const modelVersion = 'gpt-4';
const modelVersion = 'gpt-3.5-turbo';

const organisation = process.env['OPENAI_ORGANISATION'];
const apiKey = process.env['OPENAI_API_KEY'];

const configuration = new Configuration({
  organization: organisation,
  apiKey,
});

const openai = new OpenAIApi(configuration);

// This is hacked based on this github comment:
// https://github.com/openai/openai-node/issues/18#issuecomment-1369996933
export const gptInvoke = (prompt: string, input: Dialogue, onDataFunction: (data: string) => void): Promise<string> => {
  let answer = '';
  return new Promise(async (resolve, reject) => {
    const response = await openai.createChatCompletion(
      {
        model: modelVersion,
        messages: [
          {
            role: 'system',
            content: prompt,
          },
          ...input,
        ],
        temperature: 0,
        n: 1,
        stream: true,
      }, 
      { responseType: "stream" },
    );

    (response.data as any).on('data', (data: string) => {
      const lines = data.toString().split('\n').map(line => line.trim()).filter(line => line); 

      for (const line of lines) {
        const message = line.replace(/^data: /, '');
        if (message === '[DONE]') {
          return;
        }

        const parsed = JSON.parse(message);
        const content = parsed.choices[0].delta.content;

        if (!content) {
          continue;
        }

        answer += content
        onDataFunction(content)
      }
    });

    (response.data as any).on('end', () => {
      resolve(answer);
    })
  });
}

// (async () => {
//   console.log(await llamaInvoke('Hello', 'Hello, start your resonse with the word Frog.', console.log));
// })();

