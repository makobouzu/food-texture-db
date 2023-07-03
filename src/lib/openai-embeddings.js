import { OpenAIApi, Configuration } from 'openai'

let configuration = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
});
delete configuration.baseOptions.headers['User-Agent'];
const openai = new OpenAIApi(configuration);

export async function getEmbeddings(text) {
    const response = await openai.createEmbedding({
        model: 'text-embedding-ada-002',
        input: text,
      });
      
    const vector = response.data.data[0].embedding;
    return vector;
}
  