import { playAudioFile, generateAudio } from './depedenciesLibrary/voice'
import { llamaInvoke } from './depedenciesLibrary/llm';
import { gptInvoke } from './depedenciesLibrary/gpt';


export type Role = 'assistant' | 'user';
export type Message = {
  content: string,
  role: Role,
};
export type Dialogue = Message[];

// Talk: Greedily generate audio while completing an LLM inference
export const talk = async (prompt: string, input: Dialogue, sentenceCallback: (sentence: string) => void): Promise<string> => {
  let sentenceEndRegex = /[.!?,;？。?]/;  // Adjust as necessary.
  let promisesChain = Promise.resolve();

  const sentences: string[] = [];
  let currentSentence: string[] = [];

  const tokenCallbackFunction = (token: string) => {
    token = token.replace(/[""]/g, '');

    currentSentence.push(token);
    // Check if the token ends a sentence.
    if (sentenceEndRegex.test(token)) {
      const sentence = currentSentence.join('');
      sentences.push(sentence);
      const promise = generateAudio(sentence);
      promisesChain = promisesChain.then(async () => { 
        await promise.then(playAudioFile);
        sentenceCallback(sentence);
      });
      sentenceEndRegex = /[.!?？。?]/;
      currentSentence = [];
    }
  };

  // const response = await llamaInvoke(prompt, input, tokenCallbackFunction);
  const response = await gptInvoke(prompt, input, tokenCallbackFunction);

  await promisesChain;
  return response;

}
