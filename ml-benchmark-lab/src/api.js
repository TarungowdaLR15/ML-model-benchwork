const BASE = "http://127.0.0.1:8000/api";

async function request(path, options = {}) {
  const response = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Request failed (${response.status})`);
  }
  return response.json();
}

export const getHealth = () => request("/health");
export const getModels = () => request("/models");
export const runBenchmark = (models) =>
  request("/benchmark", {
    method: "POST",
    body: JSON.stringify({ models }),
  });
export const getExperiments = () => request("/experiments");
export const deleteExperiment = (id) =>
  request(`/experiments/${id}`, { method: "DELETE" });
