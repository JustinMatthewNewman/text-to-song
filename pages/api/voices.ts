// pages/api/voices.ts
import { NextApiRequest, NextApiResponse } from 'next';

const sdk = require('api')('@uberduck/v1.3#539819r5lhgink3x');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await sdk.get_voices_voices_get({mode: 'tts-basic', slim: 'false'});
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred.' });
  }
}
