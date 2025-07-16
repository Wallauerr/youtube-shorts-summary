import { pipeline } from "@xenova/transformers";

export const transcribe = async (audio) => {
	try {
		console.log("Realizando a transcrição com Whisper AI...");

		// Verificar se os dados de áudio são válidos
		if (!audio || !audio.length || !(audio instanceof Float32Array)) {
			throw new Error("Dados de áudio inválidos para transcrição");
		}

		console.log(`Processando ${audio.length} samples de áudio...`);
		console.log("Carregando modelo Whisper...");

		// Criar pipeline de reconhecimento de fala com Whisper
		const transcriber = await pipeline(
			"automatic-speech-recognition",
			"Xenova/whisper-small", // Usando whisper-small para melhor performance
			{
				revision: "main",
				quantized: true, // Versão quantizada para melhor performance
			}
		);

		console.log("Modelo Whisper carregado. Iniciando transcrição...");

		// Configurações para a transcrição
		const transcriptionOptions = {
			chunk_length_s: 30, // Processar em chunks de 30 segundos
			stride_length_s: 5, // Sobreposição de 5 segundos entre chunks
			language: "portuguese", // Forçar português brasileiro
			task: "transcribe", // Tarefa de transcrição (não tradução)
			return_timestamps: false, // Não retornar timestamps
			force_full_sequences: false, // Permitir sequências parciais para melhor performance
		};

		// Realizar a transcrição
		const transcription = await transcriber(audio, transcriptionOptions);

		// Extrair texto da transcrição
		let transcribedText = "";

		if (transcription && transcription.text) {
			transcribedText = transcription.text;
		} else if (Array.isArray(transcription) && transcription.length > 0) {
			// Se retornar array de chunks, concatenar todos
			transcribedText = transcription.map(chunk => chunk.text || "").join(" ");
		} else {
			throw new Error("Formato de resposta da transcrição não reconhecido");
		}

		// Limpar e processar o texto transcrito
		transcribedText = cleanTranscription(transcribedText);

		if (!transcribedText || transcribedText.trim().length === 0) {
			throw new Error("Não foi possível extrair texto do áudio. O áudio pode estar muito baixo ou sem fala.");
		}

		console.log("Transcrição finalizada com sucesso!");
		console.log(`Texto extraído: ${transcribedText.length} caracteres`);
		console.log(`Preview: "${transcribedText.substring(0, 100)}..."`);

		return transcribedText;

	} catch (error) {
		console.error("Erro na transcrição:", error.message);

		// Tratar diferentes tipos de erro
		if (error.message.includes("load")) {
			throw new Error("Erro ao carregar o modelo Whisper. Verifique sua conexão com a internet.");
		} else if (error.message.includes("memory") || error.message.includes("allocation")) {
			throw new Error("Memória insuficiente para processar o áudio. Tente com um vídeo menor.");
		} else if (error.message.includes("invalid") || error.message.includes("formato")) {
			throw new Error("Formato de áudio inválido para transcrição.");
		} else if (error.message.includes("muito baixo") || error.message.includes("sem fala")) {
			throw error; // Manter mensagem original
		} else {
			throw new Error(`Falha na transcrição: ${error.message}`);
		}
	}
};

/**
 * Limpa e processa o texto transcrito
 * @param {string} text - Texto bruto da transcrição
 * @returns {string} - Texto limpo e processado
 */
function cleanTranscription(text) {
	if (!text || typeof text !== 'string') {
		return "";
	}

	return text
		// Remover marcadores de música e sons
		.replace(/\[Música\]/gi, "")
		.replace(/\[Music\]/gi, "")
		.replace(/\[Aplausos\]/gi, "")
		.replace(/\[Risos\]/gi, "")
		.replace(/\[.*?\]/g, "") // Remover qualquer coisa entre colchetes

		// Remover marcadores de tempo se houver
		.replace(/\d{1,2}:\d{2}/g, "")

		// Normalizar espaços
		.replace(/\s+/g, " ")

		// Remover espaços no início e fim
		.trim()

		// Capitalizar primeira letra se necessário
		.replace(/^./, str => str.toUpperCase());
}
