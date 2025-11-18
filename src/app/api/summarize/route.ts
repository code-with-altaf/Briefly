import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { extractText } from 'unpdf';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const language = formData.get('language') as string || 'English'; // ✅ New language param

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const uint8Array = new Uint8Array(bytes);
    
    const { text: extractedText } = await extractText(uint8Array);
    const fullText = Array.isArray(extractedText) ? extractedText.join('\n') : extractedText;
    
    console.log('Extracted text length:', fullText.length);
    console.log('Target language:', language);

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // ✅ Updated prompt with language specification
    const summaryPrompt = `You are an AI assistant that creates concise, professional summaries IN ${language.toUpperCase()} LANGUAGE.
    
Analyze the following PDF content and create:
1. A comprehensive summary with 4 sections: Executive Summary, Key Points, Technical Details, and Conclusion
2. A story-format version optimized for Instagram/social media (4 slides with engaging titles and concise content)

**IMPORTANT**: Generate ALL content in ${language} language. Translate and adapt the content appropriately for ${language} speakers.

PDF Content:
${fullText.substring(0, 10000)}

Return the response in this JSON format:
{
  "summary": {
    "title": "Document Title (in ${language})",
    "sections": [
      {"heading": "Executive Summary", "content": "..."},
      {"heading": "Key Points", "content": "..."},
      {"heading": "Technical Details", "content": "..."},
      {"heading": "Conclusion", "content": "..."}
    ]
  },
  "story": [
    "content with engaging hook",
    "content with main insight",
    "content with supporting details",
    "content with conclusion/CTA"
  ]
}`;

    const result = await model.generateContent(summaryPrompt);
    const responseText = result.response.text();
    
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const summaryData = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    if (!summaryData) {
      throw new Error('Failed to parse AI response');
    }

    return NextResponse.json({
      success: true,
      fileName: file.name,
      summary: summaryData.summary,
      story: summaryData.story,
      language: language, // ✅ Return selected language
    });

  } catch (error) {
    console.error('Error processing PDF:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process PDF',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
