declare module "node-wav" {
	interface DecodedAudio {
		channelData: Float32Array[];
		sampleRate: number;
		bitDepth: number;
	}

	interface Wav {
		decode(buffer: Buffer): DecodedAudio;
		encode(
			channelData: Float32Array[],
			options?: {
				sampleRate?: number;
				bitDepth?: number;
			},
		): Buffer;
	}

	const wav: Wav;
	export default wav;
}
