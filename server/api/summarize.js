import { pipeline } from "@xenova/transformers";

export const summarize = async (text) => {
	try {
		console.log("Realizando o resumo com DistilBART AI...");

		// Validar entrada
		if (!text || typeof text !== 'string' || text.trim().length === 0) {
			throw new Error("Texto inválido para resumo");
		}

		const cleanText = text.trim();
		console.log(`Texto para resumir: ${cleanText.length} caracteres`);

		// Verificar se o texto não é muito curto
		if (cleanText.length < 50) {
			throw new Error("Texto muito curto para gerar um resumo significativo");
		}

		console.log("Carregando modelo DistilBART...");

		// Criar pipeline de sumarização
		const generator = await pipeline(
			"summarization",
			"Xenova/distilbart-cnn-12-6",
			{
				revision: "main",
				quantized: true, // Versão quantizada para melhor performance
			}
		);

		console.log("Modelo DistilBART carregado. Processando texto...");

		// Preparar texto para sumarização
		let textToSummarize = prepareTextForSummarization(cleanText);

		// DistilBART tem limite de tokens (~1024), então vamos chunkar se necessário
		const maxInputLength = 900; // Deixar margem de segurança
		let summary = "";

		if (textToSummarize.length <= maxInputLength) {
			// Texto pequeno, processar diretamente
			console.log("Processando texto completo...");
			const result = await generator(textToSummarize, {
				max_length: 150, // Máximo de tokens no resumo
				min_length: 30,  // Mínimo de tokens no resumo
				do_sample: false, // Usar beam search para melhor qualidade
				early_stopping: true,
				num_beams: 4, // Usar beam search com 4 beams
			});

			summary = result[0].summary_text;
		} else {
			// Texto longo, dividir em chunks
			console.log("Texto longo detectado. Dividindo em chunks...");
			const chunks = chunkText(textToSummarize, maxInputLength);
			console.log(`Processando ${chunks.length} chunks...`);

			const chunkSummaries = [];

			for (let i = 0; i < chunks.length; i++) {
				console.log(`Processando chunk ${i + 1}/${chunks.length}...`);

				const result = await generator(chunks[i], {
					max_length: 100, // Menor para cada chunk
					min_length: 20,
					do_sample: false,
					early_stopping: true,
					num_beams: 3,
				});

				chunkSummaries.push(result[0].summary_text);
			}

			// Se temos múltiplos chunks, resumir os resumos
			if (chunkSummaries.length > 1) {
				console.log("Consolidando resumos dos chunks...");
				const combinedSummaries = chunkSummaries.join(" ");

				if (combinedSummaries.length <= maxInputLength) {
					const finalResult = await generator(combinedSummaries, {
						max_length: 200,
						min_length: 50,
						do_sample: false,
						early_stopping: true,
						num_beams: 4,
					});
					summary = finalResult[0].summary_text;
				} else {
					// Se ainda é muito longo, pegar os primeiros resumos
					summary = chunkSummaries.slice(0, 3).join(" ");
				}
			} else {
				summary = chunkSummaries[0];
			}
		}

		// Limpar e melhorar o resumo
		summary = cleanSummary(summary);

		if (!summary || summary.trim().length === 0) {
			throw new Error("Não foi possível gerar um resumo válido do texto");
		}

		console.log("Resumo concluído com sucesso!");
		console.log(`Resumo gerado: ${summary.length} caracteres`);
		console.log(`Preview: "${summary.substring(0, 100)}..."`);

		return summary;

	} catch (error) {
		console.error("Erro no resumo:", error.message);

		// Tratar diferentes tipos de erro
		if (error.message.includes("load")) {
			throw new Error("Erro ao carregar o modelo de resumo. Verifique sua conexão com a internet.");
		} else if (error.message.includes("memory") || error.message.includes("allocation")) {
			throw new Error("Memória insuficiente para processar o texto. Tente com um texto menor.");
		} else if (error.message.includes("token") || error.message.includes("length")) {
			throw new Error("Texto muito longo para processar. Tente com um vídeo menor.");
		} else if (error.message.includes("muito curto")) {
			throw error; // Manter mensagem original
		} else if (error.message.includes("inválido")) {
			throw error; // Manter mensagem original
		} else {
			throw new Error(`Falha na geração do resumo: ${error.message}`);
		}
	}
};

/**
 * Prepara o texto para sumarização removendo elementos desnecessários
 * @param {string} text - Texto bruto
 * @returns {string} - Texto preparado
 */
function prepareTextForSummarization(text) {
	return text
		// Remover quebras de linha excessivas
		.replace(/\n+/g, " ")

		// Remover espaços múltiplos
		.replace(/\s+/g, " ")

		// Remover caracteres especiais desnecessários
		.replace(/[^\w\s\.,!?;:-]/g, "")

		// Garantir pontuação adequada
		.replace(/([.!?])\s*([A-ZÁÀÂÃÉÊÍÓÔÕÚÇ])/g, "$1 $2")

		// Remover espaços no início e fim
		.trim();
}

/**
 * Divide texto longo em chunks menores
 * @param {string} text - Texto para dividir
 * @param {number} maxLength - Tamanho máximo de cada chunk
 * @returns {string[]} - Array de chunks
 */
function chunkText(text, maxLength) {
	const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
	const chunks = [];
	let currentChunk = "";

	for (const sentence of sentences) {
		const trimmedSentence = sentence.trim();

		if ((currentChunk + " " + trimmedSentence).length <= maxLength) {
			currentChunk += (currentChunk ? " " : "") + trimmedSentence + ".";
		} else {
			if (currentChunk) {
				chunks.push(currentChunk);
			}
			currentChunk = trimmedSentence + ".";
		}
	}

	if (currentChunk) {
		chunks.push(currentChunk);
	}

	// Se não conseguiu dividir por sentenças, dividir por palavras
	if (chunks.length === 0 || chunks.some(chunk => chunk.length > maxLength)) {
		return chunkTextByWords(text, maxLength);
	}

	return chunks;
}

/**
 * Divide texto por palavras como fallback
 * @param {string} text - Texto para dividir
 * @param {number} maxLength - Tamanho máximo de cada chunk
 * @returns {string[]} - Array de chunks
 */
function chunkTextByWords(text, maxLength) {
	const words = text.split(/\s+/);
	const chunks = [];
	let currentChunk = "";

	for (const word of words) {
		if ((currentChunk + " " + word).length <= maxLength) {
			currentChunk += (currentChunk ? " " : "") + word;
		} else {
			if (currentChunk) {
				chunks.push(currentChunk);
			}
			currentChunk = word;
		}
	}

	if (currentChunk) {
		chunks.push(currentChunk);
	}

	return chunks;
}

/**
 * Limpa e melhora o resumo gerado
 * @param {string} summary - Resumo bruto
 * @returns {string} - Resumo limpo
 */
function cleanSummary(summary) {
	if (!summary || typeof summary !== 'string') {
		return "";
	}

	return summary
		// Garantir que começa com maiúscula
		.replace(/^./, str => str.toUpperCase())

		// Corrigir pontuação
		.replace(/\s+([.!?])/g, "$1")
		.replace(/([.!?])\s*([A-ZÁÀÂÃÉÊÍÓÔÕÚÇ])/g, "$1 $2")

		// Remover espaços múltiplos
		.replace(/\s+/g, " ")

		// Garantir que termina com pontuação
		.replace(/([^.!?])$/, "$1.")

		// Remover espaços no início e fim
		.trim();
}
