"use client";

import React, { useState, useEffect } from "react";
import { X, Key, ShieldCheck, Cpu, ExternalLink, RefreshCw, Check, Copy } from "lucide-react";

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<{
    hasGeminiKey: boolean;
    keyPrefix: string | null;
    provider: string;
    mode: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/config-status");
      const data = await res.json();
      setStatus(data);
    } catch (e) {
      console.error("Failed to fetch server config status", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  const copyEnvSnippet = () => {
    navigator.clipboard.writeText("GEMINI_API_KEY=your_gemini_api_key_here");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-violet-50/50 to-purple-50/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center shadow-md shadow-violet-500/20">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">AI Integration & Server Security</h2>
              <p className="text-xs text-slate-500">How CatalogAI keeps your API keys secure on the server</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-600">
          {/* Status Box */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  status?.hasGeminiKey ? "bg-emerald-500 animate-pulse" : "bg-violet-500"
                }`}
              />
              <div>
                <p className="font-semibold text-slate-800">
                  {status?.hasGeminiKey ? "Live Google Gemini AI Active" : "Smart Built-in Engine Active"}
                </p>
                <p className="text-xs text-slate-500">
                  {status?.hasGeminiKey
                    ? `Server is using key: ${status.keyPrefix}`
                    : "No key found on server. Using offline deterministic engine with spec guardrails."}
                </p>
              </div>
            </div>
            <button
              onClick={fetchStatus}
              disabled={loading}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Test Server
            </button>
          </div>

          {/* Security architecture explanation */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-violet-600" />
              100% Server-Side Key Protection
            </h3>
            <p className="leading-relaxed text-slate-600 text-xs sm:text-sm">
              In accordance with security best practices, CatalogAI <strong>never sends API keys to the user’s browser</strong>.
              All AI calls are proxied through a secured server route (<code className="px-1.5 py-0.5 rounded bg-slate-100 text-violet-700 font-mono text-xs">/api/generate</code>).
              Your keys remain strictly confined to the server environment.
            </p>
          </div>

          {/* Setup steps */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-violet-600" />
              How to Configure Google Gemini (Optional)
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-slate-600 pl-1">
              <li>
                Obtain a free API key from{" "}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-600 hover:text-violet-700 font-medium inline-flex items-center gap-0.5 underline underline-offset-2"
                >
                  Google AI Studio
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                Create a <code className="px-1 py-0.5 bg-slate-100 rounded text-slate-800 font-mono text-xs">.env.local</code> file in the project root directory.
              </li>
              <li>Add your key as shown below:</li>
            </ol>

            <div className="relative">
              <div className="p-3.5 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto flex items-center justify-between">
                <span>GEMINI_API_KEY=your_actual_key_here</span>
                <button
                  onClick={copyEnvSnippet}
                  className="ml-3 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded flex items-center gap-1 text-[11px] transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 italic">
              Restart your development server after creating or updating .env.local to apply changes.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium text-xs sm:text-sm transition-colors shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
