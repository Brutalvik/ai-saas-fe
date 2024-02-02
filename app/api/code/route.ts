import { roleDescription } from "@/app/(dashboard)/(routes)/code/constants";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";

const configuration = {
  apiKey: process.env.OPENAI_API_KEY,
};

const openai = new OpenAI({ apiKey: configuration.apiKey });

const instructionMessage = {
  role: "system",
  content: roleDescription,
};

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!configuration.apiKey) {
      return new NextResponse("API Key Error", { status: 500 });
    }
    if (!messages) {
      return new NextResponse("Messages are reqired", { status: 500 });
    }

    const freeTrial = await checkApiLimit();

    if (!freeTrial) {
      return new NextResponse("Free trial expired !", { status: 403 });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [instructionMessage, ...messages],
    });

    await increaseApiLimit();
    return NextResponse.json(response.choices[0].message);
  } catch (error) {
    console.log("[Code Error]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
