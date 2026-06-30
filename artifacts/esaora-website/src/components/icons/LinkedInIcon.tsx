import React from 'react';

interface LinkedInIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
  className?: string;
}

export const LinkedInIcon: React.FC<LinkedInIconProps> = ({ size = 24, color = "#0077b5", className, ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path 
        d="M20.447 20.452H16.89V14.892C16.89 13.567 16.864 11.861 15.042 11.861C13.194 11.861 12.91 13.303 12.91 14.796V20.452H9.352V8.996H12.766V10.561H12.815C13.29 9.664 14.448 8.711 16.183 8.711C19.794 8.711 20.457 11.087 20.457 14.184V20.452H20.447ZM5.337 7.433C4.199 7.433 3.275 6.511 3.275 5.375C3.275 4.238 4.199 3.317 5.337 3.317C6.473 3.317 7.398 4.238 7.398 5.375C7.398 6.511 6.474 7.433 5.337 7.433ZM7.119 20.452H3.555V8.996H7.119V20.452ZM22.225 0H1.771C0.792 0 0 0.774 0 1.729V22.271C0 23.227 0.792 24 1.771 24H22.221C23.2 24 24 23.227 24 22.271V1.729C24 0.774 23.2 0 22.225 0Z" 
        fill={color}
      />
    </svg>
  );
};
