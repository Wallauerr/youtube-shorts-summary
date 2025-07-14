declare module "fluent-ffmpeg" {
	interface FfmpegCommand {
		input(input: string): FfmpegCommand;
		audioFrequency(freq: number): FfmpegCommand;
		audioChannels(channels: number): FfmpegCommand;
		format(format: string): FfmpegCommand;
		on(event: "end", callback: () => void): FfmpegCommand;
		on(event: "error", callback: (error: Error) => void): FfmpegCommand;
		on(
			event: "progress",
			callback: (progress: {
				percent?: number;
				currentKbps?: number;
				targetSize?: number;
				timemark?: string;
			}) => void,
		): FfmpegCommand;
		save(output: string): FfmpegCommand;
		output(output: string): FfmpegCommand;
		run(): void;
	}

	interface Ffmpeg {
		setFfmpegPath(path: string): void;
		(): FfmpegCommand;
	}

	const ffmpeg: Ffmpeg;
	export default ffmpeg;
}
