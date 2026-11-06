import ReactMarkdown from "react-markdown";
export function LearningMarkdown({ children }: { children: string }) {
  return (
    <div className="learning-markdown">
      <ReactMarkdown
        components={{
          a: ({ children, href }) => (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
