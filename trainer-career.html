// api/personalize.js
// Vercel Serverless Function (Node.js)
// トレーナーキャリア道場: ホネさん診断の「あなた専用アドバイス」生成用プロキシ
//
// 【設置方法】
// 1. このファイルを、GitHubリポジトリの /api/personalize.js として追加する
// 2. Vercelのプロジェクト設定 → Environment Variables に
//    ANTHROPIC_API_KEY という名前で、Anthropicの管理画面(console.anthropic.com)から
//    発行したAPIキーを登録する(すでに他機能用に登録済みなら、そのまま使えます)
// 3. git push すれば、Vercelが自動でこの関数をデプロイしてくれます
// 4. デプロイ後は https://あなたのドメイン/api/personalize にPOSTすると動きます

export default async function handler(req, res) {
  // POST以外は受け付けない
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { topLabel, coreLabel, strategyNote, age, gender, income, achievement, qualification, futureVision } = req.body || {};

    // 最低限、未来像だけは必須にする
    if (!futureVision || typeof futureVision !== 'string' || !futureVision.trim()) {
      return res.status(400).json({ error: 'futureVision is required' });
    }

    const prompt =
      'あなたはパーソナルトレーナーのキャリアを本気で考えるコーチです。以下の情報をもとに、日本語で4〜5文の、率直で妥協のないメッセージを書いてください。オブラートに包まず、現在地と理想のギャップをはっきり指摘してください。ただし「無理」「一生」「絶望」など、可能性を完全に否定する断定表現は使わないでください。行動量とスピードの問題として指摘し、最後は具体的な行動を促す形で締めてください。専門用語は避け、話し言葉に近い自然な文章にしてください。前置きや見出しは不要で、メッセージ本文だけを出力してください。\n\n' +
      '【診断でわかった強み】' + (topLabel || '未回答') + '\n' +
      '【診断でわかった弱点】' + (coreLabel || '未回答') + '(' + (strategyNote || '') + ')\n' +
      '【本人が回答した年齢】' + (age || '未回答') + '\n' +
      '【本人が回答した性別】' + (gender || '未回答') + '\n' +
      '【本人が回答した年収】' + (income || '未回答') + '\n' +
      '【本人が回答した実績】' + (achievement || '未回答') + '\n' +
      '【本人が回答した資格】' + (qualification || '未回答') + '\n' +
      '【本人が思い描く理想の未来像】' + futureVision + '\n\n' +
      'この未来像に対して、強みがどう追い風になるか、弱点とどう付き合っていけばいいか、そして年齢・年収・実績・資格が理想像に対して見合っているかに具体的に触れながら書いてください。';

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001', // 既存機能と同じ軽量モデル。必要なら claude-sonnet-5 等に変更可
        max_tokens: 500,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Anthropic API error:', errText);
      return res.status(502).json({ error: 'AI generation failed' });
    }

    const data = await response.json();
    const text = (data.content || [])
      .map((item) => (item.type === 'text' ? item.text : ''))
      .filter(Boolean)
      .join('\n')
      .trim();

    if (!text) {
      return res.status(502).json({ error: 'Empty AI response' });
    }

    return res.status(200).json({ message: text });
  } catch (err) {
    console.error('personalize.js error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
