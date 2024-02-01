import * as z from "zod";

export const formSchema = z.object({
  prompt: z.string().min(1, {
    message: "Prompt is required",
  }),
});

export const roleDescription =
  "You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations";
