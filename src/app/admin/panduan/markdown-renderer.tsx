"use client";

import { useMemo } from "react";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const html = useMemo(() => {
    let result = content
      // Headers
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold text-gray-900 mt-6 mb-2">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold text-gray-900 mt-8 mb-3 pb-2 border-b border-gray-200">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-primary-700">$1</code>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary-600 hover:text-primary-800 underline" target="_blank" rel="noopener noreferrer">$1</a>')
      // Unordered lists
      .replace(/^- (.*$)/gm, '<li class="text-gray-700 ml-4 list-disc">$1</li>')
      // Ordered lists
      .replace(/^\d+\. (.*$)/gm, '<li class="text-gray-700 ml-4 list-decimal">$1</li>')
      // Horizontal rule
      .replace(/^---$/gm, '<hr class="my-6 border-gray-300" />')
      // Blockquote
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-primary-400 bg-primary-50 px-4 py-2 my-3 text-gray-700 rounded-r-lg">$1</blockquote>')
      // Table
      .replace(/\|(.+)\|/g, (match) => {
        if (match.includes("---")) return "";
        const cells = match.split("|").filter(c => c.trim());
        const row = cells.map(c => `<td class="px-3 py-2 border border-gray-200 text-sm text-gray-700">${c.trim()}</td>`).join("");
        return `<tr>${row}</tr>`;
      })
      // Paragraphs - wrap remaining text
      .replace(/^(?!<[hplibctd]|<tr|<li|<\/li|<\/ul|<\/ol|<bl|^$)(.+)$/gm, '<p class="text-gray-700 leading-relaxed mb-3">$1</p>')
      // Clean up empty paragraphs
      .replace(/<p class="[^"]*"><\/p>/g, "")
      // Line breaks
      .replace(/\n\n/g, "\n");

    // Wrap tables
    result = result.replace(/(<tr>[\s\S]*?<\/tr>)/g, '<table class="w-full border-collapse my-4">$1</table>');

    // Wrap list items
    result = result.replace(/((?:<li[^>]*>.*<\/li>\n?)+)/g, '<ul class="list-disc pl-5 space-y-1 my-3">$1</ul>');

    return result;
  }, [content]);

  return (
    <div
      className="prose prose-gray max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
