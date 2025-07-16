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
	res.json({ status: "Server is running!", port: PORT });
});

// Rota para download e transcrição
app.get("/api/summary/:id", async (request, response) => {
	try {
		console.log("Iniciando processamento do vídeo:", request.params.id);

		await download(request.params.id);
		const audioConverted = await convert();
		const result = await transcribe(audioConverted);

		return response.json({ result });
	} catch (error) {
		console.log("Erro no processamento:", error);
		return response.json({ error: error.message });
	}
});

// Rota para resumo
app.post("/api/summary", async (request, response) => {
	try {
		const result = await summarize(request.body.text);
		return response.json({ result });
	} catch (error) {
		console.log("Erro no resumo:", error);
		return response.json({ error: error.message });
	}
});

// Rota para download (nova)
app.post("/api/download", async (request, response) => {
	try {
		const { videoId } = request.body;
		if (!videoId) {
			return response.status(400).json({ error: "videoId é obrigatório" });
		}

		await download(videoId);
		return response.json({ success: true, message: "Download concluído" });
	} catch (error) {
		console.log("Erro no download:", error);
		return response.status(500).json({ error: error.message });
	}
});

// Rota para transcrição (nova)
app.post("/api/transcribe", async (_, response) => {
	try {
		const audioConverted = await convert();
		const result = await transcribe(audioConverted);
		return response.json({ result });
	} catch (error) {
		console.log("Erro na transcrição:", error);
		return response.status(500).json({ error: error.message });
	}
});

app.listen(PORT, () => {
	console.log(`Servidor rodando na porta ${PORT}`);
	console.log(`Acesse: http://localhost:${PORT}/api/health`);
});
