export async function handler(event) {
  const ip =
    event.headers["x-forwarded-for"] ||
    event.headers["client-ip"] ||
    event.headers["x-nf-client-connection-ip"] ||
    "IP não identificado";

  // Consulta GeoIP
  const geoResponse = await fetch(`http://ip-api.com/json/${ip}`);
  const geoData = await geoResponse.json();

  const country = geoData.country || "Desconhecido";
  const region = geoData.regionName || "Desconhecido";
  const city = geoData.city || "Desconhecido";
  const isp = geoData.isp || "Desconhecido";

  const userAgent = event.headers["user-agent"];
  const date = new Date().toLocaleString();

  const webhook = process.env.DISCORD_WEBHOOK;

  await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content:
        `🔎 Novo acesso detectado\n\n` +
        `IP: ${ip}\n` +
        `País: ${country}\n` +
        `Estado: ${region}\n` +
        `Cidade: ${city}\n` +
        `ISP: ${isp}\n\n` +
        `Navegador: ${userAgent}\n` +
        `Data: ${date}`
    })
  });

  return {
    statusCode: 200,
    body: "Monitoramento ativo."
  };
}
