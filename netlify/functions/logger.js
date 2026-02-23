export async function handler(event) {
  try {
    // ===== PEGAR IP CORRETO =====
    let ip =
      event.headers["x-forwarded-for"] ||
      event.headers["x-nf-client-connection-ip"] ||
      event.headers["client-ip"] ||
      "";

    if (ip.includes(",")) {
      ip = ip.split(",")[0].trim();
    }

    if (!ip) {
      ip = "IP não identificado";
    }

    // ===== CONSULTAR GEOLOCALIZAÇÃO =====
    const geoResponse = await fetch(`http://ip-api.com/json/${ip}`);
    const geoData = await geoResponse.json();

    const country = geoData.country || "Desconhecido";
    const region = geoData.regionName || "Desconhecido";
    const city = geoData.city || "Desconhecido";
    const isp = geoData.isp || "Desconhecido";

    const userAgent = event.headers["user-agent"] || "Desconhecido";
    const date = new Date().toLocaleString();

    const webhook = process.env.DISCORD_WEBHOOK;

    // ===== ENVIAR PARA DISCORD =====
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content:
          `🔎 **Novo Acesso Detectado**\n\n` +
          `🌐 IP: ${ip}\n` +
          `🏳️ País: ${country}\n` +
          `📍 Estado: ${region}\n` +
          `🏙️ Cidade: ${city}\n` +
          `📡 ISP: ${isp}\n\n` +
          `💻 Navegador: ${userAgent}\n` +
          `🕒 Data: ${date}`
      })
    });

    return {
      statusCode: 200,
      body: "Monitoramento ativo."
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: "Erro interno."
    };
  }
}
