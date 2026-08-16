'use client';

import { Copy, Check } from 'lucide-react';
import { useState, useMemo } from 'react';

interface CodeBlockProps {
  code: string;
  language: string;
  title?: string;
}

interface Token {
  type: string;
  value: string;
}

export function CodeBlock({ code, language, title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tokens = useMemo(() => {
    if (language !== 'cpp') return [{ type: 'text', value: code }];

    const keywords = new Set([
      'auto', 'bool', 'break', 'case', 'catch', 'char', 'class', 'const', 'constexpr', 'continue',
      'default', 'delete', 'double', 'do', 'else', 'enum', 'explicit', 'export', 'extern', 'false',
      'float', 'for', 'friend', 'goto', 'if', 'inline', 'int', 'long', 'mutable', 'namespace',
      'new', 'noexcept', 'nullptr', 'operator', 'private', 'protected', 'public', 'register',
      'reinterpret_cast', 'return', 'short', 'signed', 'sizeof', 'static', 'static_cast', 'struct',
      'switch', 'template', 'this', 'throw', 'true', 'try', 'typedef', 'typeid', 'typename',
      'union', 'unsigned', 'using', 'virtual', 'void', 'volatile', 'while', 'std'
    ]);

    const result: Token[] = [];
    let i = 0;
    const len = code.length;

    while (i < len) {
      // Comments
      if (code[i] === '/' && code[i + 1] === '/') {
        let comment = '';
        while (i < len && code[i] !== '\n') {
          comment += code[i];
          i++;
        }
        result.push({ type: 'comment', value: comment });
        continue;
      }

      // Strings
      if (code[i] === '"') {
        let str = '"';
        i++;
        while (i < len && code[i] !== '"') {
          if (code[i] === '\\') {
            str += code[i] + code[i + 1];
            i += 2;
          } else {
            str += code[i];
            i++;
          }
        }
        if (i < len) str += code[i++];
        result.push({ type: 'string', value: str });
        continue;
      }

      // Numbers
      if (/\d/.test(code[i])) {
        let num = '';
        while (i < len && /\d/.test(code[i])) {
          num += code[i];
          i++;
        }
        result.push({ type: 'number', value: num });
        continue;
      }

      // Identifiers and keywords
      if (/[a-zA-Z_]/.test(code[i])) {
        let identifier = '';
        while (i < len && /[a-zA-Z0-9_]/.test(code[i])) {
          identifier += code[i];
          i++;
        }
        const type = keywords.has(identifier) ? 'keyword' : 'text';
        result.push({ type, value: identifier });
        continue;
      }

      // Everything else
      result.push({ type: 'text', value: code[i] });
      i++;
    }

    return result;
  }, [code, language]);

  const getColor = (type: string) => {
    switch (type) {
      case 'keyword':
        return '#60a5fa'; // blue-400
      case 'string':
        return '#4ade80'; // green-400
      case 'comment':
        return '#64748b'; // slate-500
      case 'number':
        return '#fb923c'; // orange-400
      default:
        return '#cbd5e1'; // slate-300
    }
  };

  return (
    <div className="not-prose mb-6">
      {title && (
        <div className="bg-slate-800 border border-slate-700 px-4 py-2 text-sm font-mono text-slate-300 rounded-t-lg">
          {title}
        </div>
      )}
      <div className="relative bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
        <button
          onClick={copyToClipboard}
          className="absolute top-4 right-4 p-2 bg-slate-700 hover:bg-slate-600 rounded transition text-slate-300 hover:text-white z-10"
          title="Copy to clipboard"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>

        <pre className="p-4 overflow-x-auto">
          <code className="font-mono text-sm leading-relaxed">
            {tokens.map((token, idx) => (
              <span key={idx} style={{ color: getColor(token.type) }}>
                {token.value}
              </span>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
