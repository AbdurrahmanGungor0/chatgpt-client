import {OpenAI} from 'openai';

let openAIClient = null;

export async function initializeOpenAIClient(key, force) {
  if (!force && openAIClient) {
    return;
  }

  openAIClient = new OpenAI({
    apiKey: key,
    dangerouslyAllowBrowser: true
  });
}

export function useOpenAi() {
  return openAIClient;
}
