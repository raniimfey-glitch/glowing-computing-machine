export default async function handler(req, res) {
  export default async function handler(req, res) {
  // تشخيص مؤقت
  if (req.method === 'GET') {
    return res.status(200).json({ 
      hasKey: !!process.env.ELEVENLABS_API_KEY,
      keyStart: process.env.ELEVENLABS_API_KEY?.slice(0,8) || 'غير موجود'
    });
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'النص مطلوب' });

  const VOICE_ID = 'XdoLPWNt7ytn6BtU4FBf';

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: err });
    }

    const audioBuffer = await response.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(Buffer.from(audioBuffer));

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
