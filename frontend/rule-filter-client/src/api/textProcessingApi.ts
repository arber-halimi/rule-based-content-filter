import type { ProcessingTextResult } from "../types/RuleTypes";

const API_BASE_URL = "http://localhost:5016/api";

export async function processText(text: string): Promise<ProcessingTextResult> {
    const response = await fetch(`${API_BASE_URL}/text-processing/process`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to process text.");
    }

    return response.json();
}