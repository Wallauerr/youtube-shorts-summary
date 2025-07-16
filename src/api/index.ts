const API_BASE_URL = "http://localhost:3001/api";

export const downloadVideo = async (videoId: string): Promise<void> => {
	try {
		const response = await fetch(`${API_BASE_URL}/download`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ videoId }),
		});

		if (!response.ok) {
			let errorMessage = "Erro no download do vídeo";

			try {
				const errorData = await response.json();
				errorMessage = errorData.error || errorMessage;
			} catch {
				errorMessage = `Erro HTTP ${response.status}: ${response.statusText}`;
			}

			throw new Error(errorMessage);
		}
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
		throw new Error("Erro de conexão com o servidor");
	}
};

export const transcribeAudio = async (): Promise<string> => {
	try {
		const response = await fetch(`${API_BASE_URL}/transcribe`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			let errorMessage = "Erro na transcrição";

			try {
				const errorData = await response.json();
				errorMessage = errorData.error || errorMessage;
			} catch {
				errorMessage = `Erro HTTP ${response.status}: ${response.statusText}`;
			}

			throw new Error(errorMessage);
		}

		const data = await response.json();
		return data.result || "Transcrição não disponível";
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
		throw new Error("Erro de conexão com o servidor");
	}
};

export const summarizeText = async (text: string): Promise<string> => {
	try {
		const response = await fetch(`${API_BASE_URL}/summary`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ text }),
		});

		if (!response.ok) {
			let errorMessage = "Erro no resumo";

			try {
				const errorData = await response.json();
				errorMessage = errorData.error || errorMessage;
			} catch {
				errorMessage = `Erro HTTP ${response.status}: ${response.statusText}`;
			}

			throw new Error(errorMessage);
		}

		const data = await response.json();
		return data.result || "Resumo não disponível";
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
		throw new Error("Erro de conexão com o servidor");
	}
};
