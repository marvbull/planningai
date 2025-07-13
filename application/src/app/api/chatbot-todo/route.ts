import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { createTodoUseCase } from "@/use-cases/todos";
import { getSSRSession } from "@/lib/get-server-session";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const { user } = await getSSRSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { prompt } = await req.json();

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "Extrahiere alle Aufgaben als kurze Bulletpoints. Gib sie als reine JSON-Liste zurück, z. B.: [\"Kaffee kaufen\", \"Meeting vorbereiten\"]",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const tasks = JSON.parse(completion.choices[0].message.content || "[]");

  const created = [];
  for (const text of tasks) {
    const todo = await createTodoUseCase(user.id, text);
    created.push(todo);
  }

  return NextResponse.json({ created });
}
