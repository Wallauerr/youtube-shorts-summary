const API_BASE_URL = "http://localhost:3001/api";

export const downloadVideo = async (videoId: string): Promise<void> => {
	const response = await fetch(`${API_BASE_URL}/download`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ videoId }),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || "Erro no download do vídeo");
	}
};

export const transcribeAudio = async (): Promise<string> => {
	const response = await fetch(`${API_BASE_URL}/transcribe`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || "Erro na transcrição");
	}

	const data = await response.json();
	return data.result;
};

export const summarizeText = async (text: string): Promise<string> => {
	const response = await fetch(`${API_BASE_URL}/summary`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ text }),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || "Erro no resumo");
	}

	const data = await response.json();
	return data.result;
};
