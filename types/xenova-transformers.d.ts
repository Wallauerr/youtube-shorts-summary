declare module "@xenova/transformers" {
	export interface TranscriptionOptions {
		chunk_length_s?: number;
		stride_lenght_s?: number;
		language?: string;
		task?: "transcribe" | "translate";
		return_timestamps?: boolean;
	}

	export interface TranscriptionResult {
		text: string;
		chunks?: Array<{
			text: string;
			timestamp: [number, number];
		}>;
	}

	export type Pipeline = (
		input: Float32Array | ArrayBuffer | Uint8Array,
		options?: TranscriptionOptions,
	) => Promise<TranscriptionResult>;

	export function pipeline(
		task: "automatic-speech-recognition",
		model: string,
		options?: {
			quantized?: boolean;
			revision?: string;
			cache_dir?: string;
		},
	): Promise<Pipeline>;

	export function pipeline(
		task: string,
		model: string,
		options?: Record<string, any>,
	): Promise<any>;
}
