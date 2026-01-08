import { NextRequest, NextResponse } from 'next/server';
import { extractText } from 'unpdf';

const HF_MODEL =
  'https://api-inference.huggingface.co/models/facebook/bart-large-cnn';

async function summarizeWithHF(text: string): Promise<string | null> {
  try {
    const res = await fetch(HF_MODEL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: text,
        options: { wait_for_model: true },
      }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data?.[0]?.summary_text || null;
  } catch {
    return null;
  }
}

/** Clean local summary (fallback) */
function localSummary(text: string) {
  const sentences = text
    .replace(/\n+/g, ' ')
    .split('. ')
    .map(s => s.trim())
    .filter(Boolean);

  return sentences.slice(0, 6).join('. ') + '.';
}

/** Story builder (fixed, non-repeating) */
function buildStory(text: string) {
  const sentences = text
    .replace(/\n+/g, ' ')
    .split('. ')
    .map(s => s.trim())
    .filter(Boolean);

  return [
    sentences[0] || 'This document introduces an important topic.',
    sentences[1] || 'It explains the core idea clearly and simply.',
    sentences[2] || 'Key supporting points add more clarity.',
    sentences[3] || 'Overall, the document ends with a clear takeaway.',
  ];
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const language = (formData.get('language') as string) || 'English';

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const uint8Array = new Uint8Array(bytes);

    const { text } = await extractText(uint8Array);
    const fullText = Array.isArray(text) ? text.join('\n') : text;

    const inputText = fullText.slice(0, 3000);

    // Try Hugging Face first
    let summaryText = await summarizeWithHF(inputText);

    // Fallback if HF fails
    if (!summaryText) {
      summaryText = localSummary(inputText);
    }

    const story = buildStory(summaryText);

    return NextResponse.json({
      success: true,
      fileName: file.name,
      language, // NOTE: HF model is English-only (free-tier limitation)
      summary: {
        title: 'Document Summary',
        sections: [
          { heading: 'Executive Summary', content: summaryText },
          { heading: 'Key Points', content: summaryText },
          { heading: 'Technical Details', content: summaryText },
          { heading: 'Conclusion', content: summaryText },
        ],
      },
      story,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        error: 'Failed to process PDF',
        details: message,
      },
      { status: 500 }
    );
  }
}
