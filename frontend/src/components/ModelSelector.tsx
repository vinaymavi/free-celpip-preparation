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
    models: ["gpt-4.1", "o4-mini"],
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

const STORAGE_KEY = "celpip-model-config";

// Utility functions for localStorage
const saveModelConfig = (config: ModelConfig) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.warn("Failed to save model config to localStorage:", error);
  }
};

const loadModelConfig = (): ModelConfig | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.warn("Failed to load model config from localStorage:", error);
    return null;
  }
};

const clearModelConfig = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn("Failed to clear model config from localStorage:", error);
  }
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

  // Track the current initialized model configuration in component state
  const [currentInitializedConfig, setCurrentInitializedConfig] =
    useState<ModelConfig | null>(null);

  useEffect(() => {
    // Load saved configuration from localStorage
    const savedConfig = loadModelConfig();
    if (savedConfig && savedConfig.model && savedConfig.apiKey) {
      setSelectedProvider(savedConfig.provider);
      setSelectedModel(savedConfig.model);
      setTemperature(savedConfig.temperature ?? 0.7);
      setApiKey(savedConfig.apiKey);

      // Check if the service is already initialized with this config
      const currentServiceConfig = langChainService.getCurrentModel();
      if (
        currentServiceConfig &&
        currentServiceConfig.provider === savedConfig.provider &&
        currentServiceConfig.model === savedConfig.model &&
        langChainService.isInitialized()
      ) {
        // Service is already initialized with this config
        setCurrentInitializedConfig(savedConfig);
        setInitializationStatus({
          status: "success",
          message: `${PROVIDER_INFO[savedConfig.provider].name} ${
            savedConfig.model
          } loaded from saved configuration`,
        });
        onModelChange?.(savedConfig);
      } else {
        // Auto-initialize the model if we have a saved config
        langChainService
          .initializeLLM(savedConfig)
          .then(() => {
            setInitializationStatus({
              status: "success",
              message: `${PROVIDER_INFO[savedConfig.provider].name} ${
                savedConfig.model
              } loaded from saved configuration`,
            });
            setCurrentInitializedConfig(savedConfig);
            onModelChange?.(savedConfig);
          })
          .catch(() => {
            setInitializationStatus({
              status: "error",
              message: "Failed to initialize saved model configuration",
            });
            setCurrentInitializedConfig(null);
          });
      }
    }
  }, [onModelChange]);

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
    setCurrentInitializedConfig(null);

    // Clear saved configuration when manually changing providers
    clearModelConfig();

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
    setCurrentInitializedConfig(null);
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

      // Save the configuration to localStorage on successful initialization
      saveModelConfig(config);

      setInitializationStatus({
        status: "success",
        message: `${PROVIDER_INFO[selectedProvider].name} ${selectedModel} initialized successfully`,
      });

      setCurrentInitializedConfig(config);
      onModelChange?.(config);
    } catch (error) {
      setInitializationStatus({
        status: "error",
        message:
          error instanceof Error ? error.message : "Failed to initialize model",
      });
      setCurrentInitializedConfig(null);
    } finally {
      setIsInitializing(false);
    }
  };

  const isModelInitialized = currentInitializedConfig !== null;

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <CogIcon className="w-4 h-4 mr-2" />
        <span>
          {isModelInitialized && currentInitializedConfig
            ? `${PROVIDER_INFO[currentInitializedConfig.provider].name} - ${
                currentInitializedConfig.model
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
                className="px-4 py-2 text-sm font-medium text-white btn btn-primary border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
