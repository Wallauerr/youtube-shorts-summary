import { Play } from "lucide-react";
import type React from "react";
import { useState } from "react";

interface SummaryState {
	content: string;
	isPlaceholder: boolean;
	isLoading: boolean;
}

export default function App() {
	const [url, setUrl] = useState<string>("");
	const [summary, setSummary] = useState<SummaryState>({
		content: "Escolha um short para resumir",
		isPlaceholder: true,
		isLoading: false,
	});

	const handleSubmit = async (e?: React.MouseEvent | React.KeyboardEvent) => {
		e?.preventDefault();

		if (!url.trim()) return;

		setSummary({
			content: "Carregando resumo...",
			isPlaceholder: false,
			isLoading: true,
		});

		try {
			await new Promise((resolve) => setTimeout(resolve, 2000));

			setSummary({
				content:
					"Este é um resumo de exemplo do vídeo. Aqui você teria o conteúdo real processado pelo seu backend. O resumo incluiria os principais pontos abordados no vídeo, organizados de forma clara e concisa para facilitar a compreensão do usuário.",
				isPlaceholder: false,
				isLoading: false,
			});
		} catch (error) {
			setSummary({
				content: "Erro ao processar o vídeo. Tente novamente.",
				isPlaceholder: false,
				isLoading: false,
			});
		}
	};

	const isValidUrl = (urlString: string): boolean => {
		try {
			new URL(urlString);
			return true;
		} catch {
			return false;
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col items-center justify-center p-4">
			<div className="w-full max-w-2xl flex flex-col items-center">
				<div className="w-32 h-32 md:w-40 md:h-40 mb-4 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-2xl">
					<Play className="w-16 h-16 md:w-20 md:h-20 text-white fill-white" />
				</div>

				<h1 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-16 text-center">
					Youtube Shorts Summary
				</h1>

				<div className="flex flex-col md:flex-row gap-3 w-full max-w-lg mb-16">
					<input
						type="url"
						value={url}
						onChange={(e) => setUrl(e.target.value)}
						placeholder="URL do vídeo"
						className={`flex-1 h-12 px-4 bg-gradient-to-r from-slate-700/50 to-slate-600/50
              backdrop-blur-sm border-2 border-slate-600/50 rounded-lg text-white
              placeholder-slate-400 focus:outline-none focus:border-cyan-400
              transition-all duration-300 text-base
              ${isValidUrl(url) && url ? "bg-slate-800/80 border-slate-500" : ""}`}
						disabled={summary.isLoading}
						onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
					/>

					<button
						type="button"
						onClick={handleSubmit}
						disabled={!url.trim() || summary.isLoading}
						className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500
              hover:from-cyan-300 hover:to-blue-400 disabled:from-slate-600
              disabled:to-slate-700 disabled:cursor-not-allowed rounded-lg
              flex items-center justify-center transition-all duration-300
              shadow-lg hover:shadow-cyan-500/25 disabled:shadow-none
              transform hover:scale-105 disabled:scale-100"
						title="Resumir"
					>
						<Play
							className={`w-6 h-6 text-white fill-white transition-transform duration-300
              ${summary.isLoading ? "animate-pulse" : ""}`}
						/>
					</button>
				</div>

				<div className="w-full max-w-2xl">
					<h2 className="text-2xl font-bold mb-4 text-left">Resumo</h2>

					<div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
						<p
							className={`text-justify leading-relaxed transition-all duration-300 ${
								summary.isPlaceholder
									? "text-slate-400 select-none italic"
									: summary.isLoading
										? "text-slate-300 animate-pulse"
										: "text-slate-100"
							}`}
						>
							{summary.content}
						</p>

						{summary.isLoading && (
							<div className="mt-4 flex items-center gap-2 text-cyan-400">
								<div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />

								<div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce animation-delay-200" />

								<div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce animation-delay-400" />
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
