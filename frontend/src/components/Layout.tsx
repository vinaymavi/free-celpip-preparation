import React, { useState, useCallback } from "react";
import type { ReactNode } from "react";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import ModelSelector from "./ModelSelector";
import type { ModelConfig } from "../utils/langchain";

type Section = "dashboard" | "reading" | "writing" | "speaking" | "listening";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface LayoutProps {
  children: ReactNode;
  navigation: NavigationItem[];
  currentSection: string;
  onSectionChange: (section: Section) => void;
}

export default function Layout({
  children,
  navigation,
  currentSection,
  onSectionChange,
}: LayoutProps) {
  // Keep track of model configuration for child components that need it
  const [, setModelConfig] = useState<ModelConfig | null>(null);

  const handleModelChange = useCallback((config: ModelConfig) => {
    setModelConfig(config);
    console.log("Model configured:", config);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Disclosure as="nav" className="bg-white border-b border-gray-200">
        {({ open }) => (
          <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <h1 className="text-xl font-bold text-gray-900">
                      CELPIP Prep
                    </h1>
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    {navigation.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => onSectionChange(item.href as Section)}
                        className={clsx(
                          currentSection === item.href
                            ? "border-primary-500 text-gray-900"
                            : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                          "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                        )}
                      >
                        <item.icon className="w-5 h-5 mr-2" />
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center">
                  <ModelSelector
                    onModelChange={handleModelChange}
                    className="mr-4"
                  />
                  <div className="-mr-2 flex items-center sm:hidden">
                    <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="button"
                    onClick={() => onSectionChange(item.href as Section)}
                    className={clsx(
                      currentSection === item.href
                        ? "bg-primary-50 border-primary-500 text-primary-700"
                        : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800",
                      "block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left"
                    )}
                  >
                    <div className="flex items-center">
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </div>
                  </Disclosure.Button>
                ))}
              </div>
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="px-4">
                  <ModelSelector onModelChange={handleModelChange} />
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
