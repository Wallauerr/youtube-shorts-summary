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

	export interface SummarizationOptions {
		max_length?: number;
		min_length?: number;
		do_sample?: boolean;
		early_stopping?: boolean;
		num_beams?: number;
		temperature?: number;
		penalty_alpha?: number;
		top_k?: number;
		top_p?: number;
		typical_p?: number;
		epsilon_cutoff?: number;
		eta_cutoff?: number;
		diversity_penalty?: number;
		repetition_penalty?: number;
		encoder_repetition_penalty?: number;
		length_penalty?: number;
		no_repeat_ngram_size?: number;
		bad_words_ids?: number[][];
		force_word_ids?: number[][];
		renormalize_logits?: boolean;
		constraints?: any;
		forced_bos_token_id?: number;
		forced_eos_token_id?: number;
		remove_invalid_values?: number;
		exponential_decay_length_penalty?: any;
		suppress_tokens?: number[];
		begin_suppress_tokens?: number[];
		forced_decoder_ids?: number[][];
		sequence_bias?: Record<string, number>;
		guidance_scale?: number;
		low_memory?: boolean;
	}

	export interface SummarizationResult {
		summary_text: string;
	}

	export type TranscriptionPipeline = (
		input: Float32Array | ArrayBuffer | Uint8Array,
		options?: TranscriptionOptions,
	) => Promise<TranscriptionResult>;

	export type SummarizationPipeline = (
		input: string,
		options?: SummarizationOptions,
	) => Promise<SummarizationResult[]>;

	export function pipeline(
		task: "automatic-speech-recognition",
		model: string,
		options?: {
			quantized?: boolean;
			revision?: string;
			cache_dir?: string;
		},
	): Promise<TranscriptionPipeline>;

	export function pipeline(
		task: "summarization",
		model: string,
		options?: {
			quantized?: boolean;
			revision?: string;
			cache_dir?: string;
		},
	): Promise<SummarizationPipeline>;

	export function pipeline(
		task: string,
		model: string,
		options?: Record<string, any>,
	): Promise<any>;
}
