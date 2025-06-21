import React from 'react';

const Typography = ({ variant = "body1", children, className = "", ...props }) => {
  const variants = {
    h1: "text-3xl font-bold",
    h2: "text-2xl font-semibold", 
    h3: "text-lg font-semibold",
    h4: "text-base font-medium",
    body1: "text-base",
    body2: "text-sm",
    caption: "text-xs text-gray-500"
  };

  const Component = variant.startsWith('h') ? variant : 'p';

  return (
    <Component className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </Component>
  );
};

export default Typography;