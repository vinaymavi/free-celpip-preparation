import { useState, useEffect } from "react";
import {
  CogIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { langChainService } from "../utils/langchain";
import type { LLMProvider, ModelConfig } from "../utils/langchain";

interface ModelSelectorProps {
  onModelChange?: (config: ModelConfig) => void;
  className?: string;
}

const PROVIDER_INFO = {
  openai: {
    name: "OpenAI",
    models: ["gpt-3.5-turbo", "gpt-4", "gpt-4-turbo"],
    description: "Advanced language models with strong reasoning capabilities",
    envVar: "VITE_OPENAI_API_KEY",
  },
  anthropic: {
    name: "Anthropic",
    models: [
      "claude-3-sonnet-20240229",
      "claude-3-haiku-20240307",
      "claude-3-opus-20240229",
    ],
    description: "Constitutional AI models focused on helpfulness and safety",
    envVar: "VITE_ANTHROPIC_API_KEY",
  },
  google: {
    name: "Google",
    models: ["gemini-pro", "gemini-pro-vision"],
    description: "Google's latest generative AI models",
    envVar: "VITE_GOOGLE_API_KEY",
  },
  cohere: {
    name: "Cohere",
    models: ["command", "command-light", "command-nightly"],
    description: "Enterprise-grade language models optimized for business use",
    envVar: "VITE_COHERE_API_KEY",
  },
};

export default function ModelSelector({
  onModelChange,
  className = "",
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] =
    useState<LLMProvider>("openai");
  const [selectedModel, setSelectedModel] = useState<string>("gpt-3.5-turbo");
  const [temperature, setTemperature] = useState(0.7);
  const [apiKey, setApiKey] = useState("");
  const [isInitializing, setIsInitializing] = useState(false);
  const [initializationStatus, setInitializationStatus] = useState<{
    status: "idle" | "success" | "error";
    message?: string;
  }>({ status: "idle" });

  useEffect(() => {
    // Load API key from environment variable if available
    const envApiKey = import.meta.env[PROVIDER_INFO[selectedProvider].envVar];
    if (envApiKey) {
      setApiKey(envApiKey);
    }
  }, [selectedProvider]);

  const handleProviderChange = (provider: LLMProvider) => {
    setSelectedProvider(provider);
    setSelectedModel(PROVIDER_INFO[provider].models[0]);
    setInitializationStatus({ status: "idle" });

    // Load API key from environment if available
    const envApiKey = import.meta.env[PROVIDER_INFO[provider].envVar];
    if (envApiKey) {
      setApiKey(envApiKey);
    } else {
      setApiKey("");
    }
  };

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    setInitializationStatus({ status: "idle" });
  };

  const initializeModel = async () => {
    if (!apiKey.trim()) {
      setInitializationStatus({
        status: "error",
        message: "API key is required",
      });
      return;
    }

    setIsInitializing(true);
    setInitializationStatus({ status: "idle" });

    try {
      const config: ModelConfig = {
        provider: selectedProvider,
        model: selectedModel,
        temperature,
        apiKey: apiKey.trim(),
      };

      await langChainService.initializeLLM(config);

      setInitializationStatus({
        status: "success",
        message: `${PROVIDER_INFO[selectedProvider].name} ${selectedModel} initialized successfully`,
      });

      onModelChange?.(config);
    } catch (error) {
      setInitializationStatus({
        status: "error",
        message:
          error instanceof Error ? error.message : "Failed to initialize model",
      });
    } finally {
      setIsInitializing(false);
    }
  };

  const currentModel = langChainService.getCurrentModel();
  const isModelInitialized = langChainService.isInitialized();

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <CogIcon className="w-4 h-4 mr-2" />
        <span>
          {isModelInitialized && currentModel
            ? `${PROVIDER_INFO[currentModel.provider].name} - ${
                currentModel.model
              }`
            : "Configure LLM"}
        </span>
        {isModelInitialized && (
          <CheckCircleIcon className="w-4 h-4 ml-2 text-green-500" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 w-80 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Configure Language Model
            </h3>

            {/* Provider Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Provider
              </label>
              <select
                value={selectedProvider}
                onChange={(e) =>
                  handleProviderChange(e.target.value as LLMProvider)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {Object.entries(PROVIDER_INFO).map(([key, info]) => (
                  <option key={key} value={key}>
                    {info.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                {PROVIDER_INFO[selectedProvider].description}
              </p>
            </div>

            {/* Model Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model
              </label>
              <select
                value={selectedModel}
                onChange={(e) => handleModelChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {PROVIDER_INFO[selectedProvider].models.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>

            {/* Temperature */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temperature: {temperature}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Focused</span>
                <span>Creative</span>
              </div>
            </div>

            {/* API Key */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={`Enter your ${PROVIDER_INFO[selectedProvider].name} API key`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Environment variable: {PROVIDER_INFO[selectedProvider].envVar}
              </p>
            </div>

            {/* Status Messages */}
            {initializationStatus.status !== "idle" && (
              <div
                className={`mb-4 p-3 rounded-md ${
                  initializationStatus.status === "success"
                    ? "bg-green-50 text-green-800"
                    : "bg-red-50 text-red-800"
                }`}
              >
                <div className="flex items-center">
                  {initializationStatus.status === "success" ? (
                    <CheckCircleIcon className="w-4 h-4 mr-2" />
                  ) : (
                    <XCircleIcon className="w-4 h-4 mr-2" />
                  )}
                  <span className="text-sm">
                    {initializationStatus.message}
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button
                onClick={initializeModel}
                disabled={isInitializing || !apiKey.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isInitializing ? "Initializing..." : "Initialize Model"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
