import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";

const configuration = {
  apiKey: process.env.OPENAI_API_KEY,
};

const openai = new OpenAI({ apiKey: configuration.apiKey });

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt, amount = 1, resolution = "512x512" } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!configuration.apiKey) {
      return new NextResponse("API Key Error", { status: 500 });
    }
    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 500 });
    }
    if (!amount) {
      return new NextResponse("Amount is required", { status: 500 });
    }
    if (!resolution) {
      return new NextResponse("Resolution is required", { status: 500 });
    }

    const freeTrial = await checkApiLimit();

    if (!freeTrial) {
      return new NextResponse("Free trial expired !", { status: 403 });
    }

    const response = await openai.images.generate({
      prompt,
      n: parseInt(amount, 10),
      size: resolution,
    });

    await increaseApiLimit();
    return NextResponse.json(response.data);
  } catch (error) {
    console.log("[Image Error]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
