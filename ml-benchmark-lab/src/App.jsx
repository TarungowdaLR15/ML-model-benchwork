import { useState, useEffect, useCallback, useRef } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'
const VIDEO_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260723_145606_ab143199-b593-4941-bb1b-9afca215416b.mp4'

const MODELS = [
  // ═══════════ OpenAI (10) ═══════════
  { id: 'gpt-6-astra', name: 'GPT-6 Astra', provider: 'OpenAI', color: '#10b981', accuracy: 96.5, latency: 300, throughput: 2300, cost: 10.00, ctx: '1.05M' },
  { id: 'gpt-6.1-sol', name: 'GPT-6.1 Sol', provider: 'OpenAI', color: '#34d399', accuracy: 93.2, latency: 240, throughput: 2800, cost: 2.00, ctx: '1M' },
  { id: 'gpt-6-luna', name: 'GPT-6 Luna', provider: 'OpenAI', color: '#6ee7b7', accuracy: 85.0, latency: 110, throughput: 3800, cost: 0.10, ctx: '1M' },
  { id: 'gpt-5.5', name: 'GPT-5.5', provider: 'OpenAI', color: '#a7f3d0', accuracy: 91.5, latency: 250, throughput: 2600, cost: 1.25, ctx: '400K' },
  { id: 'gpt-5.1', name: 'GPT-5.1', provider: 'OpenAI', color: '#d1fae5', accuracy: 88.0, latency: 220, throughput: 2900, cost: 0.60, ctx: '400K' },
  { id: 'gpt-5.1-codex-mini', name: 'GPT-5.1 Codex Mini', provider: 'OpenAI', color: '#ecfdf5', accuracy: 84.0, latency: 140, throughput: 3400, cost: 0.25, ctx: '400K' },
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', color: '#34d399', accuracy: 85.7, latency: 220, throughput: 2800, cost: 2.50, ctx: '128K' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI', color: '#6ee7b7', accuracy: 82.0, latency: 120, throughput: 3600, cost: 0.15, ctx: '128K' },
  { id: 'o3', name: 'o3', provider: 'OpenAI', color: '#10b981', accuracy: 90.0, latency: 800, throughput: 900, cost: 3.00, ctx: '200K' },
  { id: 'o4-mini', name: 'o4-mini', provider: 'OpenAI', color: '#34d399', accuracy: 85.0, latency: 500, throughput: 1400, cost: 0.60, ctx: '200K' },

  // ═══════════ Anthropic (8) ═══════════
  { id: 'claude-fable-5.1', name: 'Claude Fable 5.1', provider: 'Anthropic', color: '#fbbf24', accuracy: 97.2, latency: 420, throughput: 1600, cost: 10.00, ctx: '1M' },
  { id: 'claude-opus-5.5', name: 'Claude Opus 5.5', provider: 'Anthropic', color: '#f59e0b', accuracy: 96.8, latency: 380, throughput: 1800, cost: 4.00, ctx: '1M' },
  { id: 'claude-sonnet-5.5', name: 'Claude Sonnet 5.5', provider: 'Anthropic', color: '#fcd34d', accuracy: 93.5, latency: 260, throughput: 2400, cost: 2.00, ctx: '1M' },
  { id: 'claude-haiku-5.5', name: 'Claude Haiku 5.5', provider: 'Anthropic', color: '#f97316', accuracy: 86.0, latency: 90, throughput: 4200, cost: 0.10, ctx: '1M' },
  { id: 'claude-opus-4.8', name: 'Claude Opus 4.8', provider: 'Anthropic', color: '#fb923c', accuracy: 91.0, latency: 400, throughput: 1600, cost: 5.00, ctx: '1M' },
  { id: 'claude-sonnet-4.6', name: 'Claude Sonnet 4.6', provider: 'Anthropic', color: '#fdba74', accuracy: 88.0, latency: 280, throughput: 2200, cost: 3.00, ctx: '1M' },
  { id: 'claude-haiku-4.5', name: 'Claude Haiku 4.5', provider: 'Anthropic', color: '#fed7aa', accuracy: 80.0, latency: 100, throughput: 3800, cost: 1.00, ctx: '200K' },
  { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', color: '#fef3c7', accuracy: 78.0, latency: 300, throughput: 2000, cost: 3.00, ctx: '200K' },

  // ═══════════ Google (10) ═══════════
  { id: 'gemini-4-argon', name: 'Gemini 4 Argon', provider: 'Google', color: '#06b6d4', accuracy: 94.0, latency: 340, throughput: 2000, cost: 2.00, ctx: '1M' },
  { id: 'gemini-3.8-flash', name: 'Gemini 3.8 Flash', provider: 'Google', color: '#22d3ee', accuracy: 88.0, latency: 100, throughput: 4000, cost: 0.25, ctx: '1M' },
  { id: 'gemini-3.1-pro', name: 'Gemini 3.1 Pro', provider: 'Google', color: '#67e8f9', accuracy: 91.0, latency: 300, throughput: 2200, cost: 1.25, ctx: '1M' },
  { id: 'gemini-3.2-flash', name: 'Gemini 3.2 Flash', provider: 'Google', color: '#a5f3fc', accuracy: 86.0, latency: 110, throughput: 3800, cost: 0.30, ctx: '1M' },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', provider: 'Google', color: '#cffafe', accuracy: 87.2, latency: 350, throughput: 1800, cost: 1.25, ctx: '1M' },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: 'Google', color: '#ecfeff', accuracy: 82.0, latency: 120, throughput: 4000, cost: 0.30, ctx: '1M' },
  { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash Lite', provider: 'Google', color: '#06b6d4', accuracy: 76.0, latency: 80, throughput: 4500, cost: 0.075, ctx: '1M' },
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', provider: 'Google', color: '#22d3ee', accuracy: 78.0, latency: 100, throughput: 4200, cost: 0.10, ctx: '1M' },
  { id: 'gemma-3-27b', name: 'Gemma 3 27B', provider: 'Google', color: '#67e8f9', accuracy: 72.0, latency: 150, throughput: 3200, cost: 0.00, ctx: '128K' },
  { id: 'gemma-3-12b', name: 'Gemma 3 12B', provider: 'Google', color: '#a5f3fc', accuracy: 68.0, latency: 100, throughput: 4000, cost: 0.00, ctx: '128K' },

  // ═══════════ Meta (8) ═══════════
  { id: 'muse-wonder-full', name: 'Muse Wonder Full', provider: 'Meta', color: '#6366f1', accuracy: 91.5, latency: 320, throughput: 2100, cost: 4.00, ctx: '1M' },
  { id: 'muse-wonder', name: 'Muse Wonder', provider: 'Meta', color: '#818cf8', accuracy: 88.0, latency: 280, throughput: 2400, cost: 2.50, ctx: '1M' },
  { id: 'muse-spark-open', name: 'Muse Spark Open', provider: 'Meta', color: '#a5b4fc', accuracy: 82.0, latency: 180, throughput: 2800, cost: 0.00, ctx: '1M' },
  { id: 'llama-4-scout', name: 'Llama 4 Scout', provider: 'Meta', color: '#c7d2fe', accuracy: 79.6, latency: 110, throughput: 3600, cost: 0.08, ctx: '10M' },
  { id: 'llama-4-maverick', name: 'Llama 4 Maverick', provider: 'Meta', color: '#e0e7ff', accuracy: 85.5, latency: 140, throughput: 3200, cost: 0.17, ctx: '1M' },
  { id: 'llama-3.3-70b', name: 'Llama 3.3 70B', provider: 'Meta', color: '#6366f1', accuracy: 78.0, latency: 200, throughput: 2600, cost: 0.00, ctx: '128K' },
  { id: 'llama-3.1-405b', name: 'Llama 3.1 405B', provider: 'Meta', color: '#818cf8', accuracy: 82.0, latency: 400, throughput: 1400, cost: 0.00, ctx: '128K' },
  { id: 'llama-3.1-8b', name: 'Llama 3.1 8B', provider: 'Meta', color: '#a5b4fc', accuracy: 68.0, latency: 80, throughput: 4500, cost: 0.00, ctx: '128K' },

  // ═══════════ Mistral (8) ═══════════
  { id: 'mistral-large-4', name: 'Mistral Large 4', provider: 'Mistral', color: '#ec4899', accuracy: 90.0, latency: 280, throughput: 2500, cost: 0.68, ctx: '1M' },
  { id: 'mistral-medium-3.5', name: 'Mistral Medium 3.5', provider: 'Mistral', color: '#f472b6', accuracy: 85.0, latency: 180, throughput: 3200, cost: 1.50, ctx: '256K' },
  { id: 'mistral-large-3', name: 'Mistral Large 3', provider: 'Mistral', color: '#f9a8d4', accuracy: 82.0, latency: 300, throughput: 2200, cost: 0.50, ctx: '256K' },
  { id: 'mistral-small-3.2', name: 'Mistral Small 3.2', provider: 'Mistral', color: '#fbcfe8', accuracy: 76.0, latency: 100, throughput: 4000, cost: 0.10, ctx: '128K' },
  { id: 'mixtral-8x22b', name: 'Mixtral 8x22B', provider: 'Mistral', color: '#fce7f3', accuracy: 78.0, latency: 220, throughput: 2400, cost: 0.00, ctx: '64K' },
  { id: 'mixtral-8x7b', name: 'Mixtral 8x7B', provider: 'Mistral', color: '#ec4899', accuracy: 72.0, latency: 140, throughput: 3200, cost: 0.00, ctx: '32K' },
  { id: 'codestral-25.08', name: 'Codestral 25.08', provider: 'Mistral', color: '#f472b6', accuracy: 84.0, latency: 150, throughput: 3200, cost: 0.30, ctx: '256K' },
  { id: 'pixtral-large', name: 'Pixtral Large', provider: 'Mistral', color: '#f9a8d4', accuracy: 80.0, latency: 300, throughput: 2000, cost: 2.00, ctx: '128K' },

  // ═══════════ xAI (4) ═══════════
  { id: 'grok-4.7', name: 'Grok 4.7', provider: 'xAI', color: '#8b5cf6', accuracy: 92.0, latency: 220, throughput: 2800, cost: 2.00, ctx: '500K' },
  { id: 'grok-4.6', name: 'Grok 4.6', provider: 'xAI', color: '#a78bfa', accuracy: 90.0, latency: 240, throughput: 2600, cost: 2.00, ctx: '256K' },
  { id: 'grok-4', name: 'Grok 4', provider: 'xAI', color: '#c4b5fd', accuracy: 88.0, latency: 260, throughput: 2400, cost: 3.00, ctx: '256K' },
  { id: 'grok-3', name: 'Grok 3', provider: 'xAI', color: '#ddd6fe', accuracy: 82.0, latency: 300, throughput: 2000, cost: 3.00, ctx: '131K' },

  // ═══════════ DeepSeek (6) ═══════════
  { id: 'deepseek-v4.1-pro', name: 'DeepSeek V4.1 Pro', provider: 'DeepSeek', color: '#0ea5e9', accuracy: 91.0, latency: 250, throughput: 2600, cost: 0.43, ctx: '1M' },
  { id: 'deepseek-v4.1-flash', name: 'DeepSeek V4.1 Flash', provider: 'DeepSeek', color: '#38bdf8', accuracy: 88.0, latency: 100, throughput: 4200, cost: 0.10, ctx: '1M' },
  { id: 'deepseek-v4-pro', name: 'DeepSeek V4 Pro', provider: 'DeepSeek', color: '#7dd3fc', accuracy: 90.0, latency: 250, throughput: 2600, cost: 0.43, ctx: '1M' },
  { id: 'deepseek-r1', name: 'DeepSeek R1', provider: 'DeepSeek', color: '#bae6fd', accuracy: 90.8, latency: 500, throughput: 1200, cost: 0.55, ctx: '128K' },
  { id: 'deepseek-v3.2', name: 'DeepSeek V3.2', provider: 'DeepSeek', color: '#e0f2fe', accuracy: 84.0, latency: 180, throughput: 3200, cost: 0.28, ctx: '128K' },
  { id: 'deepseek-coder-v2', name: 'DeepSeek Coder V2', provider: 'DeepSeek', color: '#0ea5e9', accuracy: 80.0, latency: 160, throughput: 3400, cost: 0.14, ctx: '128K' },

  // ═══════════ Alibaba (6) ═══════════
  { id: 'qwen-3.6-plus', name: 'Qwen 3.6 Plus', provider: 'Alibaba', color: '#14b8a6', accuracy: 91.0, latency: 200, throughput: 3000, cost: 0.25, ctx: '256K' },
  { id: 'qwen-3.6-35b', name: 'Qwen 3.6 35B A3B', provider: 'Alibaba', color: '#2dd4bf', accuracy: 84.0, latency: 100, throughput: 4000, cost: 0.05, ctx: '262K' },
  { id: 'qwen-3-max', name: 'Qwen 3 Max', provider: 'Alibaba', color: '#5eead4', accuracy: 89.0, latency: 250, throughput: 2400, cost: 1.20, ctx: '262K' },
  { id: 'qwen-3-235b', name: 'Qwen 3 235B', provider: 'Alibaba', color: '#99f6e4', accuracy: 86.0, latency: 180, throughput: 3000, cost: 0.20, ctx: '128K' },
  { id: 'qwen-2.5-72b', name: 'Qwen 2.5 72B', provider: 'Alibaba', color: '#ccfbf1', accuracy: 78.0, latency: 200, throughput: 2600, cost: 0.40, ctx: '128K' },
  { id: 'qwen-coder-3', name: 'Qwen Coder 3', provider: 'Alibaba', color: '#14b8a6', accuracy: 82.0, latency: 150, throughput: 3400, cost: 0.10, ctx: '256K' },

  // ═══════════ Moonshot (3) ═══════════
  { id: 'kimi-k3.1-pro', name: 'Kimi K3.1 Pro', provider: 'Moonshot', color: '#d946ef', accuracy: 93.5, latency: 280, throughput: 2200, cost: 2.00, ctx: '1.05M' },
  { id: 'kimi-k3', name: 'Kimi K3', provider: 'Moonshot', color: '#e879f9', accuracy: 90.0, latency: 350, throughput: 1800, cost: 3.00, ctx: '1M' },
  { id: 'kimi-k2', name: 'Kimi K2', provider: 'Moonshot', color: '#f0abfc', accuracy: 82.0, latency: 400, throughput: 1600, cost: 2.00, ctx: '256K' },

  // ═══════════ Cohere (3) ═══════════
  { id: 'command-a', name: 'Command A', provider: 'Cohere', color: '#f43f5e', accuracy: 82.0, latency: 250, throughput: 2400, cost: 2.50, ctx: '256K' },
  { id: 'command-r-plus', name: 'Command R+', provider: 'Cohere', color: '#fb7185', accuracy: 78.0, latency: 280, throughput: 2200, cost: 2.50, ctx: '128K' },
  { id: 'command-r', name: 'Command R', provider: 'Cohere', color: '#fda4af', accuracy: 72.0, latency: 200, throughput: 2800, cost: 0.15, ctx: '128K' },

  // ═══════════ Amazon (2) ═══════════
  { id: 'nova-pro', name: 'Nova Pro', provider: 'Amazon', color: '#fbbf24', accuracy: 80.0, latency: 220, throughput: 2600, cost: 0.80, ctx: '300K' },
  { id: 'nova-lite', name: 'Nova Lite', provider: 'Amazon', color: '#fcd34d', accuracy: 74.0, latency: 120, throughput: 3600, cost: 0.06, ctx: '300K' },

  // ═══════════ Microsoft (2) ═══════════
  { id: 'phi-4', name: 'Phi-4', provider: 'Microsoft', color: '#0ea5e9', accuracy: 76.0, latency: 100, throughput: 3600, cost: 0.00, ctx: '16K' },
  { id: 'phi-3.5-moe', name: 'Phi-3.5 MoE', provider: 'Microsoft', color: '#38bdf8', accuracy: 70.0, latency: 80, throughput: 4000, cost: 0.00, ctx: '128K' },

  // ═══════════ AI21 (2) ═══════════
  { id: 'jamba-1.5-large', name: 'Jamba 1.5 Large', provider: 'AI21', color: '#84cc16', accuracy: 78.0, latency: 280, throughput: 2200, cost: 2.00, ctx: '256K' },
  { id: 'jamba-1.5-mini', name: 'Jamba 1.5 Mini', provider: 'AI21', color: '#a3e635', accuracy: 72.0, latency: 150, throughput: 3200, cost: 0.20, ctx: '256K' },

  // ═══════════ Databricks (1) ═══════════
  { id: 'dbrx-instruct', name: 'DBRX Instruct', provider: 'Databricks', color: '#f97316', accuracy: 74.0, latency: 280, throughput: 2000, cost: 0.75, ctx: '32K' },

  // ═══════════ Nvidia (2) ═══════════
  { id: 'nemotron-4-340b', name: 'Nemotron-4 340B', provider: 'Nvidia', color: '#22c55e', accuracy: 80.0, latency: 380, throughput: 1400, cost: 0.00, ctx: '4K' },
  { id: 'nemotron-nano-9b', name: 'Nemotron Nano 9B', provider: 'Nvidia', color: '#4ade80', accuracy: 70.0, latency: 80, throughput: 4200, cost: 0.00, ctx: '128K' },

  // ═══════════ Zhipu (3) ═══════════
  { id: 'glm-4.6', name: 'GLM-4.6', provider: 'Zhipu', color: '#a855f7', accuracy: 86.0, latency: 200, throughput: 3000, cost: 0.60, ctx: '200K' },
  { id: 'glm-4-plus', name: 'GLM-4-Plus', provider: 'Zhipu', color: '#c084fc', accuracy: 80.0, latency: 220, throughput: 2800, cost: 0.80, ctx: '128K' },
  { id: 'glm-4-flash', name: 'GLM-4-Flash', provider: 'Zhipu', color: '#d8b4fe', accuracy: 72.0, latency: 100, throughput: 4000, cost: 0.00, ctx: '128K' },

  // ═══════════ Baidu (2) ═══════════
  { id: 'ernie-4.5', name: 'ERNIE 4.5', provider: 'Baidu', color: '#3b82f6', accuracy: 82.0, latency: 250, throughput: 2600, cost: 0.50, ctx: '200K' },
  { id: 'ernie-4-turbo', name: 'ERNIE 4 Turbo', provider: 'Baidu', color: '#60a5fa', accuracy: 78.0, latency: 180, throughput: 3000, cost: 0.30, ctx: '128K' },

  // ═══════════ Tencent (2) ═══════════
  { id: 'hunyuan-large', name: 'Hunyuan Large', provider: 'Tencent', color: '#0891b2', accuracy: 80.0, latency: 240, throughput: 2600, cost: 0.50, ctx: '256K' },
  { id: 'hunyuan-turbo', name: 'Hunyuan Turbo', provider: 'Tencent', color: '#06b6d4', accuracy: 74.0, latency: 120, throughput: 3600, cost: 0.15, ctx: '128K' },

  // ═══════════ 01.AI (2) ═══════════
  { id: 'yi-large', name: 'Yi-Large', provider: '01.AI', color: '#db2777', accuracy: 78.0, latency: 220, throughput: 2800, cost: 3.00, ctx: '32K' },
  { id: 'yi-lightning', name: 'Yi-Lightning', provider: '01.AI', color: '#ec4899', accuracy: 74.0, latency: 120, throughput: 3600, cost: 0.14, ctx: '16K' },

  // ═══════════ Reka (2) ═══════════
  { id: 'reka-core', name: 'Reka Core', provider: 'Reka', color: '#059669', accuracy: 80.0, latency: 300, throughput: 2000, cost: 3.00, ctx: '128K' },
  { id: 'reka-flash', name: 'Reka Flash', provider: 'Reka', color: '#10b981', accuracy: 74.0, latency: 150, throughput: 3200, cost: 0.80, ctx: '128K' },

  // ═══════════ Perplexity (1) ═══════════
  { id: 'sonar-huge', name: 'Sonar Huge', provider: 'Perplexity', color: '#06b6d4', accuracy: 84.0, latency: 300, throughput: 2400, cost: 1.00, ctx: '200K' },

  // ═══════════ NousResearch (1) ═══════════
  { id: 'hermes-4-405b', name: 'Hermes 4 405B', provider: 'NousResearch', color: '#8b5cf6', accuracy: 82.0, latency: 420, throughput: 1400, cost: 0.00, ctx: '128K' },

  // ═══════════ TII (2) ═══════════
  { id: 'falcon-3-180b', name: 'Falcon 3 180B', provider: 'TII', color: '#eab308', accuracy: 76.0, latency: 350, throughput: 1600, cost: 0.00, ctx: '128K' },
  { id: 'falcon-3-10b', name: 'Falcon 3 10B', provider: 'TII', color: '#facc15', accuracy: 68.0, latency: 100, throughput: 4000, cost: 0.00, ctx: '32K' },

  // ═══════════ Upstage (1) ═══════════
  { id: 'solar-pro-2', name: 'Solar Pro 2', provider: 'Upstage', color: '#f97316', accuracy: 78.0, latency: 200, throughput: 2800, cost: 0.60, ctx: '32K' },

  // ═══════════ LG (1) ═══════════
  { id: 'exaone-3.5', name: 'EXAONE 3.5', provider: 'LG', color: '#a855f7', accuracy: 74.0, latency: 180, throughput: 3000, cost: 0.00, ctx: '32K' },

  // ═══════════ Naver (1) ═══════════
  { id: 'hyperclova-x', name: 'HyperCLOVA X', provider: 'Naver', color: '#22c55e', accuracy: 76.0, latency: 240, throughput: 2600, cost: 0.00, ctx: '128K' },

  // ═══════════ Sarvam (1) ═══════════
  { id: 'sarvam-m', name: 'Sarvam-M', provider: 'Sarvam', color: '#f97316', accuracy: 70.0, latency: 180, throughput: 3000, cost: 0.00, ctx: '32K' },

  // ═══════════ OpenBMB (1) ═══════════
  { id: 'minicpm-3', name: 'MiniCPM 3', provider: 'OpenBMB', color: '#06b6d4', accuracy: 66.0, latency: 60, throughput: 5000, cost: 0.00, ctx: '32K' },

  // ═══════════ Inception (1) ═══════════
  { id: 'mercury-coder', name: 'Mercury Coder', provider: 'Inception', color: '#10b981', accuracy: 78.0, latency: 40, throughput: 6000, cost: 0.25, ctx: '128K' },

  // ═══════════ Jais (1) ═══════════
  { id: 'jais-30b', name: 'Jais 30B', provider: 'Jais', color: '#f59e0b', accuracy: 66.0, latency: 180, throughput: 3000, cost: 0.00, ctx: '8K' },

  // ═══════════ Aleph Alpha (1) ═══════════
  { id: 'luminous-supreme', name: 'Luminous Supreme', provider: 'Aleph Alpha', color: '#e879f9', accuracy: 72.0, latency: 300, throughput: 2000, cost: 0.00, ctx: '32K' },

  // ═══════════ HuggingFace (1) ═══════════
  { id: 'zephyr-141b', name: 'Zephyr 141B', provider: 'HuggingFace', color: '#fbbf24', accuracy: 76.0, latency: 380, throughput: 1400, cost: 0.00, ctx: '32K' },

  // ═══════════ Inflection (1) ═══════════
  { id: 'pi-3.5', name: 'Pi 3.5', provider: 'Inflection', color: '#a78bfa', accuracy: 74.0, latency: 200, throughput: 2800, cost: 1.00, ctx: '128K' },
]

const STEPS = ['Plan', 'Select', 'Execute', 'Evaluate', 'Recommend']
const sleep = ms => new Promise(r => setTimeout(r, ms))
const noise = (base, pct = 0.05) => base * (1 + (Math.random() - 0.5) * 2 * pct)
const round1 = n => +n.toFixed(1)
const round0 = n => Math.round(n)
const round3 = n => +n.toFixed(3)

function getModel(id) { return MODELS.find(m => m.id === id) }

function buildResults(ids) {
  return ids.map(id => {
    const m = getModel(id) || { name: id, color: '#6366f1', accuracy: 70, latency: 200, throughput: 2000, cost: 0.5 }
    const acc  = round1(Math.max(50, Math.min(99, noise(m.accuracy, 0.04))))
    const lat  = round0(Math.max(30, noise(m.latency, 0.12)))
    const tput = round0(Math.max(500, noise(m.throughput, 0.10)))
    const cost = round3(Math.max(0.01, noise(m.cost, 0.08)))
    const overall = round1(acc * 0.7
                          + (100 - Math.min(lat, 500) / 5) * 0.1
                          + (Math.min(tput, 5000) / 50) * 0.1
                          + (100 - Math.min(cost * 10, 100)) * 0.1)
    return { id, name: m.name, color: m.color, accuracy: acc, latency: lat, throughput: tput, cost, overall, ctx: m.ctx }
  })
}

function normalizeResults(data, ids) {
  const arr = Array.isArray(data) ? data : data?.results
  if (!Array.isArray(arr) || !arr.length) return buildResults(ids)
  return arr.map(r => {
    const id = r.model || r.id || 'unknown'
    const m = getModel(id) || {}
    return {
      id,
      name: r.name || m.name || id,
      color: m.color || '#6366f1',
      accuracy:   +Number(r.accuracy   ?? r.score ?? 0).toFixed(1) || 0,
      latency:    Math.round(Number(r.latency    ?? r.latency_ms ?? 0)) || 0,
      throughput: Math.round(Number(r.throughput ?? r.requests_per_sec ?? 0)) || 0,
      cost:       +Number(r.cost ?? r.cost_per_1k ?? 0).toFixed(3) || 0,
      overall:    +Number(r.overall ?? r.score ?? r.accuracy ?? 0).toFixed(1) || 0,
      ctx: m.ctx,
    }
  })
}

function AnimatedNumber({ value, decimals = 0, duration = 700 }) {
  const [d, setD] = useState(0)
  const prev = useRef(0)
  useEffect(() => {
    const from = prev.current, to = value
    prev.current = value
    let start = null, raf
    const step = ts => {
      if (start === null) start = ts
      const p = Math.min((ts - start) / duration, 1)
      const e = 1 - Math.pow(1 - p, 3)
      setD(from + (to - from) * e)
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [value, duration])
  return <>{d.toFixed(decimals)}</>
}

function ConsoleMessage({ m }) {
  if (m.type === 'thought') {
    const shown = m.revealed !== undefined ? m.text.slice(0, m.revealed) : m.text
    const isStreaming = m.revealed !== undefined && m.revealed < m.text.length
    return (
      <div className="console-line thought">
        <span className="prompt">›</span>
        <span className="text">{shown}</span>
        {isStreaming && <span className="cursor" />}
      </div>
    )
  }
  if (m.type === 'tool') {
    return (
      <div className={`console-tool ${m.status}`}>
        <div className="tool-head">
          <span className="tool-icon">{m.status === 'running' ? '⟳' : '✓'}</span>
          <code className="tool-name">{m.name}</code>
          {m.duration !== undefined && <span className="tool-duration">{m.duration}ms</span>}
        </div>
        {m.result && <div className="tool-result">{m.result}</div>}
      </div>
    )
  }
  if (m.type === 'decision') {
    return (
      <div className="console-line decision">
        <span className="prompt gold">★</span>
        <span className="text">{m.text}</span>
      </div>
    )
  }
  return null
}

export default function App() {
  const [selected, setSelected] = useState(['gpt-6-astra', 'claude-opus-5.5', 'gemini-4-argon'])
  const [status, setStatus] = useState('checking')
  const [phase, setPhase] = useState(-1)
  const [messages, setMessages] = useState([])
  const [running, setRunning] = useState(false)
  const [results, setResults] = useState([])
  const [recommendation, setRecommendation] = useState(null)
  const [confidence, setConfidence] = useState(0)
  const [error, setError] = useState(null)
  const [runId, setRunId] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [activeSection, setActiveSection] = useState(0)
  const [hasAutoRun, setHasAutoRun] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('mlbench:search-history')
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })
  const [showHistory, setShowHistory] = useState(false)
  const searchInputRef = useRef(null)

  const s1 = useRef(null), s2 = useRef(null), s3 = useRef(null)
  const consoleRef = useRef(null)
  const cancelledRef = useRef(false)
  const runningRef = useRef(false)

  useEffect(() => {
    let stop = false
    async function check() {
      try {
        const r = await fetch(`${API_BASE}/health`)
        if (!stop) setStatus(r.ok ? 'online' : 'offline')
      } catch { if (!stop) setStatus('offline') }
    }
    check()
    const id = setInterval(check, 10000)
    return () => { stop = true; clearInterval(id) }
  }, [])

  useEffect(() => { runningRef.current = running }, [running])

  useEffect(() => {
    if (consoleRef.current) consoleRef.current.scrollTop = consoleRef.current.scrollHeight
  }, [messages])

  useEffect(() => {
    const refs = [s1, s2, s3]
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && e.intersectionRatio >= 0.55) {
          const idx = refs.findIndex(r => r.current === e.target)
          if (idx >= 0) setActiveSection(idx)
        }
      })
    }, { threshold: [0.55, 0.75] })
    refs.forEach(r => r.current && obs.observe(r.current))
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (activeSection === 2 && !hasAutoRun && !runningRef.current && selected.length > 0) {
      setHasAutoRun(true)
      const t = setTimeout(() => { if (!runningRef.current) runAgent() }, 500)
      return () => clearTimeout(t)
    }
  }, [activeSection, hasAutoRun, selected])

  const toggleModel = id => setSelected(p => p.includes(id) ? p.filter(m => m !== id) : [...p, id])
  const selectAll = () => setSelected(MODELS.map(m => m.id))
  const clearAll  = () => setSelected([])
  const autoSelect = () => setSelected([
    'gpt-6-astra', 'claude-opus-5.5', 'gemini-4-argon',
    'gpt-4o-mini', 'claude-haiku-5.5', 'gemini-3.2-flash',
    'deepseek-v4.1-pro', 'kimi-k3.1-pro', 'qwen-3.6-plus',
  ])

  const scrollToSection = idx => {
    const refs = [s1, s2, s3]
    refs[idx].current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const goToResults = () => {
    setHasAutoRun(false)
    scrollToSection(2)
  }

  const streamThought = async (text, speed = 16) => {
    const id = Date.now() + Math.random()
    setMessages(prev => [...prev, { _id: id, type: 'thought', text, revealed: 0 }])
    await new Promise(resolve => {
      let i = 0
      const tick = () => {
        if (cancelledRef.current) { resolve(); return }
        i += 1
        setMessages(prev => prev.map(x => x._id === id ? { ...x, revealed: i } : x))
        if (i >= text.length) resolve()
        else setTimeout(tick, speed)
      }
      tick()
    })
    await sleep(140)
  }

  const pushTool = async (name, args, durationMs, resultText) => {
    const id = Date.now() + Math.random()
    setMessages(prev => [...prev, { _id: id, type: 'tool', name, args, status: 'running' }])
    await sleep(Math.min(durationMs, 1000))
    setMessages(prev => prev.map(x => x._id === id ? { ...x, status: 'done', duration: durationMs, result: resultText } : x))
    await sleep(120)
  }

  const pushDecision = text => setMessages(prev => [...prev, { type: 'decision', text }])

  const resetAll = () => {
    cancelledRef.current = true
    setMessages([]); setPhase(-1); setResults([]); setRecommendation(null)
    setConfidence(0); setError(null); setElapsed(0); setHasAutoRun(false)
  }

  const rerun = () => { cancelledRef.current = false; runAgent() }

  const runAgent = useCallback(async () => {
    if (selected.length === 0) { setError('Select at least one model.'); return }
    if (runningRef.current) return
    cancelledRef.current = false
    runningRef.current = true
    setRunning(true); setError(null); setMessages([]); setResults([])
    setRecommendation(null); setConfidence(0); setElapsed(0)
    const startedAt = Date.now()

    try {
      setPhase(0)
      await streamThought(`Analyzing request: benchmark ${selected.length} model${selected.length > 1 ? 's' : ''} from ${new Set(selected.map(id => getModel(id)?.provider)).size} providers.`)
      await pushTool('plan_analyzer', { models: selected.length }, 380, `${selected.length}-model trade-off analysis`)

      setPhase(1)
      await streamThought(`Preparing benchmark suite for ${selected.map(id => getModel(id)?.name || id).join(', ')}.`)
      await pushTool('suite_builder', { suite: 'standard_v3' }, 480, `${selected.length} endpoints queued`)

      setPhase(2)
      const toolName = status === 'online' ? 'benchmark_api' : 'mock_benchmark'
      await streamThought(`Executing against ${status === 'online' ? 'live backend' : 'local simulation (backend offline)'}.`)
      let normalized
      const toolStart = Date.now()
      if (status === 'online') {
        try {
          const res = await fetch(`${API_BASE}/benchmark`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ models: selected }),
          })
          if (!res.ok) throw new Error(`backend ${res.status}`)
          normalized = normalizeResults(await res.json(), selected)
        } catch (e) {
          await streamThought(`Backend call failed (${e.message}). Falling back to simulation.`)
          normalized = buildResults(selected)
        }
      } else {
        await sleep(700 + Math.random() * 400)
        normalized = buildResults(selected)
      }
      await pushTool(toolName, { models: selected }, Date.now() - toolStart, `${normalized.length} results collected`)

      setPhase(3)
      await streamThought('Computing weighted scores (70% accuracy, 10% latency, 10% throughput, 10% cost).')
      const best = normalized.reduce((a, b) => a.overall >= b.overall ? a : b)
      const cheapest = normalized.reduce((a, b) => a.cost <= b.cost ? a : b)
      const fastest = normalized.reduce((a, b) => a.latency <= b.latency ? a : b)
      await pushTool('score_analyzer', {}, 320, `Best overall: ${best.name} (${best.overall.toFixed(1)})`)

      setPhase(4)
      await streamThought(`Best: ${best.name} (${best.overall.toFixed(1)}). Fastest: ${fastest.name} (${fastest.latency}ms). Cheapest: ${cheapest.name} ($${cheapest.cost}/1k).`)
      await sleep(300)

      const sorted = [...normalized].sort((a, b) => b.overall - a.overall)
      const margin = sorted.length > 1 ? sorted[0].overall - sorted[1].overall : 5
      const conf = Math.min(97, Math.max(55, Math.round(70 + margin * 4)))
      setConfidence(conf)

      const rationale = `${best.name} leads at ${best.accuracy}% accuracy, ${best.latency}ms latency, $${best.cost}/1k. ${sorted.length > 1 ? `Margin over ${sorted[1].name}: ${margin.toFixed(1)} points (${margin > 3 ? 'decisive' : 'modest'}).` : ''} ${fastest.id !== best.id ? `Use ${fastest.name} for latency-critical paths.` : ''} ${cheapest.id !== best.id && cheapest.id !== fastest.id ? `Use ${cheapest.name} for batch/volume.` : ''}`.trim()

      pushDecision(rationale)
      setResults(normalized)
      setRecommendation({ best, fastest, cheapest, rationale })
      setRunId(x => x + 1)
      setElapsed(Date.now() - startedAt)
      setPhase(5)
    } catch (e) {
      if (e.message !== 'cancelled') { setError(`Run failed: ${e.message}`); setPhase(-1) }
    } finally {
      setRunning(false); runningRef.current = false
    }
  }, [selected, status])

  useEffect(() => {
    try { localStorage.setItem('mlbench:search-history', JSON.stringify(searchHistory)) } catch {}
  }, [searchHistory])

  useEffect(() => {
    const handler = e => {
      const tag = (document.activeElement && document.activeElement.tagName) || ''
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(tag)) {
        e.preventDefault()
        searchInputRef.current && searchInputRef.current.focus()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const addToHistory = q => {
    const t = q.trim()
    if (t.length < 2) return
    setSearchHistory(prev =>
      [t, ...prev.filter(x => x.toLowerCase() !== t.toLowerCase())].slice(0, 8)
    )
  }
  const clearHistory = () => setSearchHistory([])

  const filteredModels = searchQuery.trim()
    ? MODELS.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : MODELS

  const best = results.length ? results.reduce((a, b) => a.overall >= b.overall ? a : b) : null
  const providers = [...new Set(MODELS.map(m => m.provider))]

  return (
    <div className="viewport">
      {/* ══════════ SECTION 1: HERO ══════════ */}
      <section ref={s1} className="section section-hero">
        <div className="hero">
          <video className="hero-video" autoPlay loop muted playsInline preload="auto">
            <source src={VIDEO_URL} type="video/mp4" />
          </video>
          <div className="hero-overlay" />
          <div className="hero-vignette" />

          <div className="hero-content">
            <div className="hero-badge">
              <span className="pulse-dot" />
              Live · {MODELS.length} models · {providers.length} providers
            </div>
            <h1 className="hero-title">
              Compare <b className="hero-grad">every frontier AI model</b><br />
              in <b className="hero-grad">one autonomous run</b>.
            </h1>
            <p className="hero-subtitle">
              Streaming reasoning. Live tool calls. Confidence-weighted recommendations.
              OpenAI, Anthropic, Google, Meta, Mistral, xAI, DeepSeek, Alibaba, Moonshot — benchmarked side-by-side, in seconds.
            </p>
            <div className="hero-actions">
              <button className="run-btn hero-cta" onClick={() => scrollToSection(1)}>
                Start benchmarking →
              </button>
              <a href="#" onClick={e => { e.preventDefault(); autoSelect(); scrollToSection(1); }} className="hero-secondary">
                Try 9-model lineup
              </a>
            </div>
            <div className="hero-stats">
              <div className="hero-stat"><b>{MODELS.length}</b><span>Models</span></div>
              <div className="hero-stat"><b>{providers.length}</b><span>Providers</span></div>
              <div className="hero-stat"><b>10M</b><span>Max context</span></div>
              <div className="hero-stat"><b>~15s</b><span>Benchmark</span></div>
            </div>
          </div>

          <div className={`status status-${status} hero-status`}>
            <span className="dot" />
            {status === 'online'   && 'Backend connected'}
            {status === 'offline'  && 'Backend offline · simulated'}
            {status === 'checking' && 'Connecting...'}
          </div>

          <div className="hero-fade" />
        </div>
        <div className="scroll-hint">Swipe up</div>
      </section>

      {/* ══════════ SECTION 2: MODELS ══════════ */}
      <section ref={s2} className="section section-models">
        <div className="section-inner">
          <h2 className="section-title">
            Select your <b>lineup</b>
            <span className="sub">{selected.length} of {MODELS.length} selected · {providers.length} providers{searchQuery ? ` · ${filteredModels.length} shown` : ""}</span>
          </h2>
          <div className="search-bar">
            <div className="search-input-wrap">
              <span className="search-icon">⌕</span>
              <input
                ref={searchInputRef}
                type="text"
                className="search-input"
                placeholder="Search models, providers...  (press /)"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setShowHistory(true)}
                onBlur={() => setTimeout(() => setShowHistory(false), 180)}
                onKeyDown={e => {
                  if (e.key === 'Enter') addToHistory(searchQuery)
                  if (e.key === 'Escape') { setSearchQuery(''); setShowHistory(false) }
                }}
              />
              {searchQuery && (
                <button
                  className="search-clear"
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => { setSearchQuery(''); searchInputRef.current && searchInputRef.current.focus() }}
                  title="Clear search"
                  type="button"
                >×</button>
              )}
            </div>

            {showHistory && searchHistory.length > 0 && !searchQuery && (
              <div className="search-history">
                <div className="search-history-head">
                  <span>Recent searches</span>
                  <button className="link-btn" onMouseDown={e => e.preventDefault()} onClick={clearHistory} type="button">
                    Clear history
                  </button>
                </div>
                {searchHistory.map((q, i) => (
                  <button
                    key={`${q}-${i}`}
                    type="button"
                    className="search-history-item"
                    onMouseDown={e => { e.preventDefault(); setSearchQuery(q); setShowHistory(false) }}
                  >
                    <span className="hist-icon">↻</span>
                    <span className="hist-label">{q}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {searchQuery && (
            <div className="search-result-info">
              {filteredModels.length === 0
                ? `No models match "${searchQuery}"`
                : `${filteredModels.length} of ${MODELS.length} models match "${searchQuery}"`}
            </div>
          )}

          <div className="models-scroll">
            <div className="models-grid">
              {filteredModels.map((m, i) => {
                const active = selected.includes(m.id)
                return (
                  <button key={m.id} type="button"
                    onClick={() => toggleModel(m.id)}
                    className={`model-card-compact ${active ? 'active' : ''}`}
                    style={{ '--accent': m.color, '--i': i }}>
                    <span className="mc-name">{m.name}</span>
                    <span className="mc-meta">{m.provider} · {m.ctx}</span>
                    <span className="mc-dot" />
                  </button>
                )
              })}
            </div>
          </div>
          <div className="models-footer">
            <div className="selected-info">
              <b>{selected.length}</b> model{selected.length !== 1 ? 's' : ''} selected
            </div>
            <button className="link-btn" onClick={autoSelect} type="button">Auto-select 9</button>
            <button className="link-btn" onClick={selectAll} type="button">All {MODELS.length}</button>
            <button className="link-btn" onClick={clearAll} type="button">None</button>
            <button className="run-btn" onClick={goToResults} disabled={running || selected.length === 0}>
              {running ? <><span className="spinner" />Agent running...</> : 'Benchmark →'}
            </button>
          </div>
        </div>
        <div className="scroll-hint">Swipe up for results</div>
      </section>

      {/* ══════════ SECTION 3: RESULTS ══════════ */}
      <section ref={s3} className="section section-results">
        <div className="results-container">
          <div className="results-header">
            <h2 className="results-title"><b>Live</b> results</h2>
            <div className="results-actions">
              {elapsed > 0 && <span className="elapsed-badge">{(elapsed / 1000).toFixed(2)}s</span>}
              {results.length > 0 && !running && (
                <button className="link-btn" onClick={rerun} type="button">↻ Rerun</button>
              )}
              {(results.length > 0 || messages.length > 0) && !running && (
                <button className="clear-btn" onClick={resetAll} type="button">Reset</button>
              )}
            </div>
          </div>

          <div className="pipeline-compact">
            {STEPS.map((s, i) => (
              <div key={s} className={`pipe-step ${phase > i ? 'done' : phase === i ? 'current' : ''}`}>
                <span className="pipe-dot" /><span className="pipe-label">{s}</span>
              </div>
            ))}
            {confidence > 0 && (
              <div className="conf-inline">
                <span className="conf-label">confidence</span>
                <div className="conf-track"><div className="conf-fill" style={{ width: `${confidence}%` }} /></div>
                <span className="conf-value">{confidence}%</span>
              </div>
            )}
          </div>

          {error && <div className="banner banner-error"><strong>⚠</strong> {error}</div>}

          {(running || messages.length > 0 || results.length > 0) ? (
            <div className="results-body">
              <div className="results-console-panel">
                <div className="results-console-head">
                  <span><span className="live-dot" />Agent console</span>
                  {phase >= 0 && phase <= 4 && <span>{STEPS[phase]}</span>}
                  {phase === 5 && <span style={{ color: 'var(--ok)' }}>done</span>}
                </div>
                <div className="results-console-body" ref={consoleRef}>
                  {messages.length === 0 && !running && <div className="console-empty">Agent idle.</div>}
                  {messages.map((m, i) => <ConsoleMessage key={m._id || i} m={m} />)}
                  {running && <div className="console-line"><span className="prompt">›</span><span className="cursor" /></div>}
                </div>
              </div>

              <div className="results-content">
                {recommendation && (
                  <div className="rec-compact">
                    <div className="rec-top">
                      <div className="rec-name">
                        🎯 <span style={{ color: recommendation.best.color }}>{recommendation.best.name}</span>
                      </div>
                      <div className="rec-conf">{confidence}% confidence</div>
                    </div>
                    <div className="rec-text">{recommendation.rationale}</div>
                    <div className="rec-pills" style={{ marginTop: 10 }}>
                      <span className="pill">🏆 Best: <b>{recommendation.best.name}</b></span>
                      <span className="pill">⚡ Fastest: <b>{recommendation.fastest.name}</b> · {recommendation.fastest.latency}ms</span>
                      <span className="pill">💰 Cheapest: <b>{recommendation.cheapest.name}</b> · ${recommendation.cheapest.cost}/1k</span>
                    </div>
                  </div>
                )}

                {results.length > 0 && (
                  <>
                    <div className="metrics-compact">
                      {results.map((r, i) => (
                        <div key={`${runId}-${r.id}`}
                          className={`metric-compact ${best && r.id === best.id ? 'winner' : ''}`}
                          style={{ '--accent': r.color, '--i': i }}>
                          {best && r.id === best.id && <span className="mc-win-badge">WINNER</span>}
                          <div className="mc-name">{r.name}</div>
                          <div className="mc-score" style={{ color: r.color }}><AnimatedNumber value={r.overall} decimals={1} /></div>
                          <div className="mc-row"><span>Accuracy</span><b><AnimatedNumber value={r.accuracy} decimals={1} />%</b></div>
                          <div className="mc-row"><span>Latency</span><b><AnimatedNumber value={r.latency} />ms</b></div>
                          <div className="mc-row"><span>Throughput</span><b><AnimatedNumber value={r.throughput} />rps</b></div>
                          <div className="mc-row"><span>Cost / 1k</span><b>$<AnimatedNumber value={r.cost} decimals={3} /></b></div>
                        </div>
                      ))}
                    </div>

                    <div className="chart-compact">
                      <div className="cc-title">Accuracy comparison</div>
                      {results.map((r, i) => (
                        <div key={`${runId}-bar-${r.id}`} className="bar-row-compact" style={{ '--i': i }}>
                          <span className="bar-label">{r.name}</span>
                          <div className="bar-track">
                            <div className="bar-fill" style={{ '--target': `${Math.min(r.accuracy, 100)}%`, background: `linear-gradient(90deg, ${r.color}, ${r.color}88)` }} />
                          </div>
                          <span className="bar-value">{r.accuracy.toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="big">📊</div>
              <div className="es-title">
                Ready to benchmark <b>{selected.length}</b> model{selected.length !== 1 ? 's' : ''}
              </div>
              <div className="es-sub">
                {selected.length === 0 ? 'Go back to select models' : `Auto-run will start as you scroll here`}
              </div>
              <button className="run-btn" onClick={rerun} disabled={selected.length === 0}>
                ▶ Run benchmark
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}