import cors from "cors";
import express from "express";
import fs from "fs";
import { convert } from "./api/convert.js";
import { download } from "./api/download.js";
import { summarize } from "./api/summarize.js";
import { transcribe } from "./api/transcribe.js";

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(cors());

// Cria diretório tmp se não existir
const tmpDir = "./tmp";
if (!fs.existsSync(tmpDir)) {
	fs.mkdirSync(tmpDir, { recursive: true });
	console.log("Diretório tmp criado com sucesso!");
}

// Health check
app.get("/api/health", (_, res) => {
	console.log("🔍 Health check requisitado");
	res.json({ status: "Server is running!", port: PORT });
});

// Rota para resumo
app.post("/api/summary", async (request, response) => {
	try {
		console.log("📝 Requisição de resumo recebida");
		console.log(
			"📄 Tamanho do texto:",
			request.body.text ? request.body.text.length : 0,
			"caracteres",
		);

		const result = await summarize(request.body.text);

		console.log("✅ Resumo gerado com sucesso!");
		return response.json({ result });
	} catch (error) {
		console.error("❌ Erro no resumo:", error.message);
		console.error("📋 Stack trace:", error.stack);
		return response.json({ error: error.message });
	}
});

// Rota para download
app.post("/api/download", async (request, response) => {
	try {
		console.log("📥 Requisição de download recebida");
		console.log(
			"📋 Body da requisição:",
			JSON.stringify(request.body, null, 2),
		);

		const { videoId } = request.body;
		if (!videoId) {
			console.error("❌ VideoId não fornecido");
			return response.status(400).json({ error: "videoId é obrigatório" });
		}

		console.log("🎬 Iniciando download do vídeo:", videoId);
		await download(videoId);

		console.log("✅ Download concluído com sucesso!");
		return response.json({ success: true, message: "Download concluído" });
	} catch (error) {
		console.error("❌ Erro no download:", error.message);
		console.error("📋 Stack trace:", error.stack);
		return response.status(500).json({ error: error.message });
	}
});

// Rota para transcrição
app.post("/api/transcribe", async (_, response) => {
	try {
		console.log("🎤 Requisição de transcrição recebida");

		console.log("🔄 Etapa 1: Convertendo áudio...");
		const audioConverted = await convert();

		console.log("🎤 Etapa 2: Transcrevendo áudio...");
		const result = await transcribe(audioConverted);

		console.log("✅ Transcrição concluída com sucesso!");
		return response.json({ result });
	} catch (error) {
		console.error("❌ Erro na transcrição:", error.message);
		console.error("📋 Stack trace:", error.stack);
		return response.status(500).json({ error: error.message });
	}
});

app.listen(PORT, () => {
	console.log("🚀 =================================");
	console.log(`🚀 Servidor YouTube Shorts Summary`);
	console.log(`🚀 Porta: ${PORT}`);
	console.log(`🚀 URL: http://localhost:${PORT}`);
	console.log(`🚀 Health: http://localhost:${PORT}/api/health`);
	console.log("🚀 =================================");
	console.log("🎭 MODO: Simulação/Mock ativo");
	console.log(
		"📁 Diretório tmp:",
		fs.existsSync("./tmp") ? "✅ Existe" : "❌ Não existe",
	);
	console.log("🚀 Servidor pronto para receber requisições!");
});
