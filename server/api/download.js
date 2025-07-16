import fs from "fs";
import ytdl from "ytdl-core";

export const download = (videoId) =>
	new Promise(async (resolve, reject) => {
		const videoURL = `https://www.youtube.com/watch?v=${videoId}`;
		console.log("Realizando o download do vídeo:", videoId);

		try {
			// Primeiro verificar se o vídeo existe e obter informações
			console.log("Verificando informações do vídeo...");
			const info = await ytdl.getInfo(videoURL);

			// Verificar duração do vídeo
			const duration = parseInt(info.videoDetails.lengthSeconds);
			console.log(`Duração do vídeo: ${duration} segundos`);

			if (duration > 60) {
				throw new Error("A duração desse vídeo é maior do que 60 segundos.");
			}

			// Verificar se o vídeo está disponível
			if (!info.videoDetails.isLiveContent && info.videoDetails.isPrivate) {
				throw new Error("Este vídeo é privado.");
			}

			console.log(`Vídeo válido encontrado: "${info.videoDetails.title}"`);
			console.log("Iniciando download do áudio...");

			// Configurações para download apenas do áudio com melhor qualidade
			const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');

			if (!audioFormats || audioFormats.length === 0) {
				throw new Error("Nenhum formato de áudio disponível para este vídeo.");
			}

			// Selecionar o melhor formato de áudio
			const bestAudioFormat = audioFormats.reduce((best, format) => {
				const currentBitrate = parseInt(format.audioBitrate) || 0;
				const bestBitrate = parseInt(best.audioBitrate) || 0;
				return currentBitrate > bestBitrate ? format : best;
			});

			console.log(`Usando formato: ${bestAudioFormat.mimeType}, bitrate: ${bestAudioFormat.audioBitrate}kbps`);

			// Criar stream de download
			const stream = ytdl(videoURL, {
				quality: bestAudioFormat.itag,
				filter: 'audioonly'
			});

			// Criar arquivo de saída
			const outputPath = "./tmp/audio.mp4";
			const writeStream = fs.createWriteStream(outputPath);

			// Configurar eventos do stream
			stream.pipe(writeStream);

			let downloadedBytes = 0;
			const totalBytes = parseInt(bestAudioFormat.contentLength) || 0;

			stream.on('progress', (chunkLength, downloaded, total) => {
				downloadedBytes = downloaded;
				const percent = totalBytes > 0 ? ((downloaded / totalBytes) * 100).toFixed(1) : 0;
				console.log(`Download: ${percent}% (${Math.round(downloaded / 1024)}KB/${Math.round(total / 1024)}KB)`);
			});

			stream.on('error', (error) => {
				console.error("Erro durante o download:", error.message);

				// Limpar arquivo parcial se existir
				if (fs.existsSync(outputPath)) {
					fs.unlinkSync(outputPath);
				}

				if (error.message.includes('403')) {
					reject(new Error("Acesso negado pelo YouTube. Tente novamente em alguns minutos."));
				} else if (error.message.includes('404')) {
					reject(new Error("Vídeo não encontrado. Verifique se a URL está correta."));
				} else {
					reject(new Error(`Falha no download: ${error.message}`));
				}
			});

			writeStream.on('error', (error) => {
				console.error("Erro ao salvar arquivo:", error.message);
				reject(new Error("Erro ao salvar o arquivo de áudio"));
			});

			writeStream.on('finish', () => {
				console.log("Download do vídeo finalizado com sucesso!");
				console.log(`Arquivo salvo: ${outputPath} (${Math.round(downloadedBytes / 1024)}KB)`);
				resolve();
			});

		} catch (error) {
			console.error("Erro no processo de download:", error.message);

			// Tratar diferentes tipos de erro
			if (error.message.includes("Video unavailable")) {
				reject(new Error("Vídeo não disponível ou foi removido."));
			} else if (error.message.includes("Private video")) {
				reject(new Error("Este é um vídeo privado."));
			} else if (error.message.includes("This live event has ended")) {
				reject(new Error("Esta transmissão ao vivo já terminou."));
			} else if (error.message.includes("Sign in to confirm your age")) {
				reject(new Error("Este vídeo tem restrição de idade."));
			} else if (error.message.includes("duração") && error.message.includes("60 segundos")) {
				reject(error); // Manter mensagem original de duração
			} else if (error.message.includes("ENOTFOUND") || error.message.includes("ECONNREFUSED")) {
				reject(new Error("Erro de conexão. Verifique sua internet e tente novamente."));
			} else if (error.message.includes("429")) {
				reject(new Error("Muitas requisições. Aguarde alguns minutos e tente novamente."));
			} else {
				reject(new Error(`Não foi possível baixar o vídeo: ${error.message}`));
			}
		}
	});
