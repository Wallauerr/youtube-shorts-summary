import fs from "node:fs";
import ffmpegStatic from "ffmpeg-static";
import ffmpeg from "fluent-ffmpeg";
import wav from "node-wav";

const filePath = "./tmp/audio.mp4";
const outputPath = filePath.replace(".mp4", ".wav");

export const convertToAudio = (): Promise<Float32Array> =>
	new Promise<Float32Array>((resolve, reject) => {
		console.log("Convertendo o vídeo...");

		ffmpeg.setFfmpegPath(ffmpegStatic);
		ffmpeg()
			.input(filePath)
			.audioFrequency(16000)
			.audioChannels(1)
			.format("wav")
			.on("end", () => {
				const file = fs.readFileSync(outputPath);
				const fileDecoded = wav.decode(file);

				const audioData = fileDecoded.channelData[0];
				const floatArrey = new Float32Array(audioData);

				console.log("Vídeo convertido com sucesso!");
				resolve(floatArrey);
				fs.unlinkSync(outputPath);
			})
			.on("error", (error: Error) => {
				console.log("Erro ao converter o vídeo", error);
				reject(error);
			})
			.save(outputPath);
	});
