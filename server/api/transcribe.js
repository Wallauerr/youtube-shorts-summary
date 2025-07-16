import { pipeline } from "@xenova/transformers";

export const transcribe = async (audio) => {
	try {
		console.log("Realizando a transcrição...");

		const transcriber = await pipeline(
			"automatic-speech-recognition",
			"Xenova/whisper-medium",
		);

		const transcription = await transcriber(audio, {
			chunk_length_s: 30,
			stride_lenght_s: 5,
			language: "portuguese",
			task: "transcribe",
		});

		console.log("Transcrição finalizada com sucesso.");

		return transcription?.text.replace("[Música]", "");
	} catch (error) {
		throw new Error(error);
	}
};
