import React from 'react';

interface GlitchProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
  children?: React.ReactNode;
}

export const Glitch: React.FC<GlitchProps> = ({ text, children, className = '', ...props }) => {
  return (
    <div
      className={`relative inline-block animate-pulse ${className}`}
      {...props}
      data-text={text}
    >
      <style>{`
        .glitch-text {
          position: relative;
        }
        .glitch-text::before,
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .glitch-text::before {
          left: 2px;
          text-shadow: -1px 0 #ff0000;
          clip: rect(24px, 550px, 90px, 0);
          animation: glitch-anim-1 2s infinite linear alternate-reverse;
        }
        .glitch-text::after {
          left: -2px;
          text-shadow: -1px 0 #bf00ff;
          clip: rect(85px, 550px, 140px, 0);
          animation: glitch-anim-2 3s infinite linear alternate-reverse;
        }
        @keyframes glitch-anim-1 {
          0% { clip: rect(20px, 9999px, 15px, 0); }
          100% { clip: rect(85px, 9999px, 100px, 0); }
        }
        @keyframes glitch-anim-2 {
          0% { clip: rect(120px, 9999px, 10px, 0); }
          100% { clip: rect(5px, 9999px, 60px, 0); }
        }
      `}</style>
      <span className="glitch-text" data-text={text}>
        {children || text}
      </span>
    </div>
  );
};

Glitch.displayName = 'Glitch';
