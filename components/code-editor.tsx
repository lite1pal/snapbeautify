"use client";

import React, { useState } from "react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  rounded: number;
}

export function CodeEditor({ value, onChange, rounded }: CodeEditorProps) {
  // Simple syntax highlighting (very basic implementation)
  const highlightCode = (code: string) => {
    // Split the code into lines
    const lines = code.split("\n");

    // Define regex patterns for different code elements
    const keywordPattern =
      /\b(function|return|if|else|for|while|let|const|var|class|import|export|from|await|async)\b/g;
    const stringPattern = /(["'`])(.*?)\1/g;
    const commentPattern = /(\/\/.*$)/g;
    const numberPattern = /\b(\d+)\b/g;
    const methodPattern = /\b(\w+)\(/g;

    // Process each line
    return lines.map((line, lineIndex) => {
      // Replace patterns with highlighted spans
      let highlighted = line
        // Strings
        .replace(stringPattern, "<span style='color:#ffcc00'>$&</span>")
        // Keywords
        .replace(keywordPattern, "<span style='color:#5e9eff'>$&</span>")
        // Comments
        .replace(commentPattern, "<span style='color:#9f9f9f'>$&</span>")
        // Numbers
        .replace(numberPattern, "<span style='color:#5bd9b6'>$&</span>")
        // Methods
        .replace(methodPattern, "<span style='color:#d7a3ff'>$1</span>(");

      // Add line numbers
      return (
        <div key={lineIndex} className="flex">
          <span className="w-6 mr-4 inline-block text-right opacity-30 text-gray-400">
            {lineIndex + 1}
          </span>
          <span
            dangerouslySetInnerHTML={{ __html: highlighted }}
            style={{ width: "100%" }}
          />
        </div>
      );
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative w-auto">
      {/* Code display with syntax highlighting */}
      <pre
        className="p-4 font-mono text-sm text-white"
        style={{
          backgroundColor: "rgba(25, 25, 30, 0.95)",
          borderRadius: `${rounded}px`,
          overflow: "hidden",
          maxWidth: "100%",
          boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
        }}
      >
        {highlightCode(value)}
      </pre>

      {/* Actual text area for editing (positioned over the pre but invisible) */}
      <textarea
        value={value}
        onChange={handleChange}
        className="absolute inset-0 opacity-0 w-full h-full overflow-auto resize-none"
        spellCheck="false"
      />
    </div>
  );
}
