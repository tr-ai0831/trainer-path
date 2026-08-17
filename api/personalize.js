// api/personalize.js
// Vercel Serverless Function (Node.js)
// トレーナーキャリア道場: ホネさん診断の「AI総合診断コメント」生成用プロキシ
//
// 【設置方法】
// 1. このファイルを、GitHubリポジトリの /api/personalize.js として追加(上書き)する
// 2. Vercelのプロジェクト設定 → Environment Variables に
//    ANTHROPIC_API_KEY という名前で、Anthropicの管理画面(console.anthropic.com)から
//    発行したAPIキーを登録する(すでに登録済みならそのまま使えます)
// 3. git push すれば、Vercelが自動でこの関数をデプロイしてくれます
// 4. デプロイ後は https://あなたのドメイン/api/personalize にPOSTすると動きます

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const b = req.body || {};
    const topLabel = b.topLabel || '未回答';
    const coreLabel = b.coreLabel || '未回答';
    const strategyNote = b.strategyNote || '';
    const typeName = b.typeName || '';
    const topLeaves = b.topLeaves || '未回答';
    const bottomLeaves = b.bottomLeaves || '未回答';
    const clusterSummary = b.clusterSummary || '未回答';
    const concern = b.concern || '未回答';
    const ideal = b.ideal || '未回答';
    const work = b.work || '未回答';
    const life = b.life || '未回答';
    const effortMindset = b.effortMindset || '未回答';
    const effortVolume = b.effortVolume || '未回答';
    const age = b.age || '未回答';
    const gender = b.gender || '未回答';
    const income = b.income || '未回答';
    const achievement = b.achievement || '未回答';
    const qualification = b.qualification || '未回答';
    const hasNationalQualification = b.hasNationalQualification || 'なし';
    const otherDegree = b.otherDegree || '';
    const deadline = b.deadline || '未回答';
    const futureVision = b.futureVision || '未回答';

    // 最低限、何かしらのプロフィール情報が無ければ生成しない
    const hasAnyProfile = [age, income, achievement, qualification, futureVision].some(
      (v) => v && v !== '未回答'
    );
    if (!hasAnyProfile) {
      return res.status(400).json({ error: 'no profile data provided' });
    }

    const prompt =
      'あなたは、パーソナルトレーナーのキャリアを本気で考える、鋭い洞察力を持つコーチです。以下の情報をもとに、日本語で3段落構成の診断コメントを書いてください。\n\n' +
      '【1段落目】回答パターンから読み取れる、この人の性格・行動特性の核心を言い当ててください。この人は診断上「' + typeName + '」というタイプに分類されています。「あなたは〜というところがあります」という形で、読んだ本人が「確かに当たっている」と感じるような、具体的で的確な洞察にしてください。一般論ではなく、下記の「特に高いスコアの項目」「特に低いスコアの項目」を根拠に、なぜそう言えるのか、そしてなぜこのタイプに当てはまるのかが伝わるように書いてください。\n\n' +
      '【2段落目】年齢・年収・実績・資格を、必ず1つずつ具体的に取り上げて評価してください。良い点は良いと明確に認め、物足りない点は物足りないとはっきり指摘してください。実績や資格が充実している場合は、その水準の高さを正当に評価した上で、それでもなお伸ばすべき点を指摘してください。逆に乏しい場合は率直に指摘してください。全体として、この年齢・実績にふさわしいレベルにあるかを、辛口かつ公正に評価してください。「無理」「一生」など、可能性を完全に否定する断定表現は使わないでください。もし「その他の学位」が記入されている場合は、その専門性を今のキャリアにどう活かせるか、具体的なヒントを必ず1つ盛り込んでください。\n\n' +
      '【3段落目】上記を踏まえ、本人が思い描く未来像に対して、強みがどう追い風になるか、弱点や現在地とどう向き合うべきかを、具体的な行動とともに述べてください。必要な努力量を評価する際は、未来像がどれだけ野心的か(大きな目標か、控えめな目標か)と、下記の期限までの残り時間の両方を考慮してください。同じ努力量でも、目標が控えめで期限に余裕があれば十分な場合があり、目標が大きい、または期限が近ければ全く足りない場合があります。この点を機械的にではなく、内容を読んで判断してください。\n\n' +
      '【診断で分かった特に高いスコアの項目(上位3つ)】' + topLeaves + '\n' +
      '【診断で分かった特に低いスコアの項目(下位3つ)】' + bottomLeaves + '\n' +
      '【5領域の平均バランス(5点満点)】' + clusterSummary + '\n' +
      '【最終的な本質的伸びしろ】' + coreLabel + '(' + strategyNote + ')\n' +
      '【最初に選んだキャリアの悩み】' + concern + '\n' +
      '【本当はどうしたいか】' + ideal + '\n' +
      '【今の仕事の状態】' + work + '\n' +
      '【プライベートとのバランス】' + life + '\n' +
      '【目標への意識】' + effortMindset + '\n' +
      '【投下している努力量】' + effortVolume + '\n' +
      '【年齢】' + age + '\n' +
      '【性別】' + gender + '\n' +
      '【年収】' + income + '\n' +
      '【実績】' + achievement + '\n' +
      '【資格】' + qualification + '\n' +
      '【国家資格の保有】' + hasNationalQualification + '(国家資格を持っている場合は、その専門性と信頼性を高く評価してください。民間資格のみ、または資格なしの場合は、その点も踏まえて評価してください)\n' +
      '【その他の学位(選択肢にないもの)】' + (otherDegree || 'なし') + '\n' +
      '【思い描く理想の未来像】' + futureVision + '\n' +
      '【その未来像の実現期限】' + deadline + '\n\n' +
      '前置きや見出しは不要で、本文のみを出力してください。専門用語は避け、自然な話し言葉にしてください。';

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001', // 既存機能と同じ軽量モデル。必要なら claude-sonnet-5 等に変更可
        max_tokens: 900,
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
