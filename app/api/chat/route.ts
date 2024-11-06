import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
console.log('GROQ_API_KEY:', process.env.GROQ_API_KEY);

export async function POST(request : Request) {
    try {
        const { message } = await request.json();

        if (!message) {
            return NextResponse.json(
                { error: "Message Content is required." },
                { status: 400 }
            );
        }
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: message,
                },
            ],
            model: "llama-3.2-90b-vision-preview",
        });
        const responseMessage = 
        chatCompletion.choices[0]?.message?.content || "No response from Llama.";

        return NextResponse.json({ response: responseMessage });
    } catch (error) {
        console.error("Error in chat API:" , error);
        return NextResponse.json( 
            { error: "An error occurred while processing your request." },
            { status: 500 }
        );
    }
}


