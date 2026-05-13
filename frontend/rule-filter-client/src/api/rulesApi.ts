import type { Rule, RuleCreateRequest } from "../types/RuleTypes";

const API_BASE_URL = "http://localhost:5016/api";

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Request failed.");
    }

    return response.json();
}

export async function getRules(): Promise<Rule[]> {
    const response = await fetch(`${API_BASE_URL}/rules`);
    return handleResponse<Rule[]>(response);
}

export async function getRuleById(id: number): Promise<Rule> {
    const response = await fetch(`${API_BASE_URL}/rules/${id}`);
    return handleResponse<Rule>(response);
}

export async function createRule(rule: RuleCreateRequest): Promise<Rule> {
    const response = await fetch(`${API_BASE_URL}/rules`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(rule),
    });
    return handleResponse<Rule>(response);
}

export async function updateRule(
    id: number,
    rule: RuleCreateRequest
): Promise<Rule> {
    const response = await fetch(`${API_BASE_URL}/rules/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(rule),
    });
    return handleResponse<Rule>(response);
}

export async function deleteRule(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/rules/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to delete rule.");
    }
}