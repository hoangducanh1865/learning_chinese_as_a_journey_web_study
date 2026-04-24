import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { word } = await req.json();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a professional Chinese-Vietnamese dictionary. Return only JSON." },
        { role: "user", content: `Dịch từ/cụm từ "${word}" sang tiếng Việt theo JSON: {"pinyin": "...", "vietnamese": ["..."], "eg_chinese": "...", "eg_pinyin": "...", "eg_vietnamese": "..."}` }
      ],
      response_format: { type: "json_object" },
    });
    return NextResponse.json(JSON.parse(completion.choices[0].message.content || "{}"));
  } catch (error) {
    return NextResponse.json({ vietnamese: ["Lỗi API"], pinyin: "error" }, { status: 500 });
  }
}