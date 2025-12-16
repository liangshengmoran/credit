"use client";

import * as React from "react";
import { Check, Copy, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  language?: string;
  raw?: string;
}

export function CodeBlock({
  children,
  className,
  language = "text",
  raw,
  ...props
}: CodeBlockProps) {
  const [hasCopied, setHasCopied] = React.useState(false);

  const copyToClipboard = React.useCallback(() => {
    if (!raw) return;
    navigator.clipboard.writeText(raw);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  }, [raw]);

  return (
    <div className="relative my-8 group overflow-hidden rounded-xl border border-zinc-700/50 dark:border-zinc-700 bg-[#1e1e1e] shadow-xl">
      <div className="flex items-center justify-between border-b border-zinc-700/50 bg-[#252526] px-4 py-2">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          </div>
          <div className="h-4 w-[1px] bg-zinc-600/50 mx-1" />
          <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 uppercase tracking-widest">
            <Terminal className="w-3 h-3" />
            {language}
          </div>
        </div>

        <button
          onClick={copyToClipboard}
          className={cn(
            "relative inline-flex h-7 w-7 items-center justify-center rounded-md transition-all duration-200",
            "bg-transparent hover:bg-white/10 active:scale-95",
            hasCopied ? "text-green-400" : "text-zinc-400 hover:text-zinc-200"
          )}
          title="Copy code"
        >
          {hasCopied ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      <div className={cn("overflow-x-auto p-5", className)} {...props}>
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: 0,
            background: "transparent",
            fontSize: "14px",
            lineHeight: "1.7",
          }}
          codeTagProps={{
            style: {
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              fontFamily: "var(--font-mono, ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace)",
            }
          }}
          PreTag="div"
          CodeTag="code"
          wrapLines={true}
          wrapLongLines={false}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
