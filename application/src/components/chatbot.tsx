const handleSend = async () => {
  if (!input.trim()) return;

  setMessages((prev) => [...prev, `🧑: ${input}`, "🤖: Verarbeite Aufgaben..."]);

  const res = await fetch("/api/chatbot-todo", {
    method: "POST",
    body: JSON.stringify({ prompt: input }),
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();

  if (data.created?.length > 0) {
    const taskList = data.created.map((t: any) => `- ${t.text}`).join("\n");
    setMessages((prev) => [
      ...prev.slice(0, -1),
      `🤖: Ich habe folgende Todos hinzugefügt:\n${taskList}`,
    ]);
  } else {
    setMessages((prev) => [
      ...prev.slice(0, -1),
      `🤖: Keine Aufgaben erkannt oder Fehler aufgetreten.`,
    ]);
  }

  setInput("");
};
