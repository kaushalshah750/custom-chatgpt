// client/src/components/Message.jsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FaCheckCircle } from 'react-icons/fa';

// Helper functions and custom components for lists/pricing remain the same.
const getNodeText = (node) => {
  if (!node || !node.children) return '';
  return node.children.map(child => {
    if (child.type === 'text') return child.value;
    return getNodeText(child);
  }).join('');
};

const StyledH2 = ({ children }) => (
  <h2 className="text-xl font-bold mt-8 mb-4 pb-2 border-b-2 border-blue-500/50">{children}</h2>
);
const StyledH3 = ({ children }) => (
  <h3 className="text-lg font-semibold mt-6 mb-3 text-gray-800 dark:text-gray-200">{children}</h3>
);
const StyledHr = () => <hr className="my-8 border-gray-300 dark:border-gray-600" />;

const PricingCard = ({ node }) => {
  const textContent = getNodeText(node);
  const match = textContent.match(/^(.*?)₹(.*?\/mo):(.*)$/);
  if (!match) return null;
  const [, title, price, featuresText] = match;
  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-lg border border-gray-300 dark:border-gray-700 shadow-md p-6 my-4 transition-transform hover:scale-[1.02]">
      <h4 className="text-lg font-bold text-blue-600 dark:text-blue-400">{title.trim()}</h4>
      <p className="text-2xl font-bold my-2 text-gray-900 dark:text-gray-100">
        <span className="text-lg">₹</span>{price.replace('/mo', '')}<span className="text-base font-normal text-gray-500">/mo</span>
      </p>
      <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400 list-none p-0">
        {featuresText.split(',').map((feature, i) => (
          <li key={i} className="flex items-center gap-2">
            <FaCheckCircle className="text-green-500 flex-shrink-0" />
            <span>{feature.trim()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};


// --- The Main Message Component ---
const Message = ({ message }) => {
  const { role, content } = message;
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`rounded-lg p-4 max-w-4xl text-left ${isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'}`}
      >
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2: StyledH2,
              h3: StyledH3,
              hr: StyledHr,
              li: ({ node, children, ...props }) => {
                const textContent = getNodeText(node);
                if (textContent.includes('₹') && textContent.includes('/mo:')) {
                  return <div className="not-prose my-1"><PricingCard node={node} /></div>;
                }
                const isNested = node.position.start.column > 10;
                if (isNested) {
                  return <li {...props} className="my-1 ml-4 before:content-['○_']">{children}</li>
                }
                return <li {...props} className="my-2 pl-6 relative before:content-['-'] before:absolute before:left-0 before:text-blue-500 before:font-bold">{children}</li>;
              },
              
              // --- DEFINITIVE TABLE STYLING ---
              table: ({node, ...props}) => (
                <div className="not-prose"> {/* Isolate table styles */}
                  <div className="overflow-x-auto my-6 rounded-lg border border-gray-300 dark:border-gray-700">
                    <table {...props} className="w-full text-sm" />
                  </div>
                </div>
              ),
              thead: ({node, ...props}) => (
                <thead {...props} className="bg-gray-100 dark:bg-gray-700/60" />
              ),
              tbody: ({node, ...props}) => (
                <tbody {...props} className="divide-y divide-gray-200 dark:divide-gray-700" />
              ),
              tr: ({node, ...props}) => (
                 <tr {...props} className="dark:text-gray-300" />
              ),
              th: ({node, ...props}) => (
                <th {...props} scope="col" className="px-4 py-3 text-left font-semibold uppercase tracking-wider" />
              ),
              td: ({node, ...props}) => (
                <td {...props} className="px-4 py-4 align-top" />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Message);
