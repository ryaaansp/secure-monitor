export async function handler(event) {
  const ip =
    event.headers["x-forwarded-for"] ||
    event.headers["client-ip"] ||
    "IP não identificado";

  const userAgent = event.headers["user-agent"];
  const date = new Date().toLocaleString();

  const webhook = process.env.DISCORD_WEBHOOK;

  await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: `🔎 Novo acesso\nIP: ${ip}\nNavegador: ${userAgent}\nData: ${date}`
    })
  });

  return {
    statusCode: 200,
    body: "Acesso registrado."
  };
}
