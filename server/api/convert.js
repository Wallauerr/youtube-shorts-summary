import ffmpegStatic from "ffmpeg-static";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import wav from "node-wav";

const filePath = "./tmp/audio.mp4";
const outputPath = filePath.replace(".mp4", ".wav");

export const convert = () =>
	new Promise((resolve, reject) => {
		console.log("Convertendo o vídeo para áudio...");

		// Verificar se o arquivo de entrada existe
		if (!fs.existsSync(filePath)) {
			reject(new Error("Arquivo de áudio não encontrado para conversão"));
			return;
		}

		// Configurar o caminho do FFmpeg
		ffmpeg.setFfmpegPath(ffmpegStatic);

		// Converter MP4 para WAV
		ffmpeg()
			.input(filePath)
			.audioFrequency(16000) // 16kHz para compatibilidade com Whisper
			.audioChannels(1) // Mono
			.format("wav")
			.audioCodec('pcm_s16le') // PCM 16-bit little endian
			.on("start", (commandLine) => {
				console.log("Comando FFmpeg:", commandLine);
			})
			.on("progress", (progress) => {
				if (progress.percent) {
					console.log(`Conversão: ${Math.round(progress.percent)}%`);
				}
			})
			.on("end", () => {
				try {
					console.log("Conversão concluída. Processando arquivo WAV...");

					// Ler e decodificar o arquivo WAV
					const file = fs.readFileSync(outputPath);
					const fileDecoded = wav.decode(file);

					// Extrair dados do canal de áudio (mono, então só temos canal 0)
					const audioData = fileDecoded.channelData[0];
					const floatArray = new Float32Array(audioData);

					console.log(`Áudio processado: ${floatArray.length} samples, ${fileDecoded.sampleRate}Hz`);
					console.log("Conversão finalizada com sucesso!");

					// Limpar arquivos temporários
					try {
						if (fs.existsSync(outputPath)) {
							fs.unlinkSync(outputPath);
							console.log("Arquivo WAV temporário removido");
						}
						if (fs.existsSync(filePath)) {
							fs.unlinkSync(filePath);
							console.log("Arquivo MP4 temporário removido");
						}
					} catch (cleanupError) {
						console.warn("Aviso: Erro ao limpar arquivos temporários:", cleanupError.message);
					}

					resolve(floatArray);
				} catch (error) {
					console.error("Erro ao processar arquivo WAV:", error.message);
					reject(new Error(`Erro no processamento do áudio: ${error.message}`));
				}
			})
			.on("error", (error) => {
				console.error("Erro na conversão FFmpeg:", error.message);

				// Limpar arquivos em caso de erro
				try {
					if (fs.existsSync(outputPath)) {
						fs.unlinkSync(outputPath);
					}
				} catch (cleanupError) {
					console.warn("Erro ao limpar arquivo após falha:", cleanupError.message);
				}

				// Tratar diferentes tipos de erro
				if (error.message.includes("Invalid data found")) {
					reject(new Error("Arquivo de áudio corrompido ou formato inválido"));
				} else if (error.message.includes("No such file")) {
					reject(new Error("Arquivo de entrada não encontrado"));
				} else if (error.message.includes("Permission denied")) {
					reject(new Error("Erro de permissão ao acessar arquivos"));
				} else {
					reject(new Error(`Falha na conversão: ${error.message}`));
				}
			})
			.save(outputPath);
	});
