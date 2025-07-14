import { pipeline } from "@xenova/transformers";

export async function transcribeAudio(audio: Float32Array) {
	try {
		console.log("Realizando a transcrição...");

		const transcribe = await pipeline(
			"automatic-speech-recognition",
			"Xenova/whisper-medium",
		);

		const transcription = await transcribe(audio, {
			chunk_length_s: 30,
			stride_lenght_s: 5,
			language: "portuguese",
			task: "transcribe",
		});

		console.log("Transcrição finalizada com sucesso.");

		return transcription?.text.replace("[Música]", "");
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : String(error));
	}
}
