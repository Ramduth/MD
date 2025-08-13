import { forwardRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PreviewProps {
  content: string;
  className?: string;
}

export const Preview = forwardRef<HTMLDivElement, PreviewProps>(
  ({ content, className }, ref) => {
    return (
      <Card className={cn("flex flex-col h-full", className)}>
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Live Preview</h2>
        </div>
        
        <div 
          ref={ref}
          className="flex-1 overflow-auto bg-preview-bg"
        >
          <div className="max-w-none p-6 prose prose-slate dark:prose-invert">
            {content ? (
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-bold mb-4 text-foreground">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-semibold mb-3 text-foreground">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-semibold mb-2 text-foreground">{children}</h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className="text-lg font-semibold mb-2 text-foreground">{children}</h4>
                  ),
                  h5: ({ children }) => (
                    <h5 className="text-base font-semibold mb-2 text-foreground">{children}</h5>
                  ),
                  h6: ({ children }) => (
                    <h6 className="text-sm font-semibold mb-2 text-foreground">{children}</h6>
                  ),
                  p: ({ children }) => (
                    <p className="mb-4 text-foreground leading-relaxed">{children}</p>
                  ),
                  code: ({ children, className }) => {
                    const isInline = !className;
                    return (
                      <code className={cn(
                        isInline 
                          ? "bg-muted px-1.5 py-0.5 rounded text-sm font-mono" 
                          : "block bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto",
                        "text-foreground"
                      )}>
                        {children}
                      </code>
                    );
                  },
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground mb-4">
                      {children}
                    </blockquote>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside mb-4 space-y-1 text-foreground">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside mb-4 space-y-1 text-foreground">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-foreground">{children}</li>
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto mb-4">
                      <table className="min-w-full border border-border">
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="border border-border px-4 py-2 bg-muted font-semibold text-left text-foreground">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border border-border px-4 py-2 text-foreground">
                      {children}
                    </td>
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            ) : (
              <div className="text-center text-muted-foreground py-12">
                <p className="text-lg">Start typing to see the preview</p>
                <p className="text-sm mt-2">Your markdown will be rendered here in real-time</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }
);

Preview.displayName = 'Preview';