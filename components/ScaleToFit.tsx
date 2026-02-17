"use client";

import React, { useEffect, useRef, useState } from "react";

interface ScaleToFitProps {
  children: React.ReactNode;
  className?: string;
  wrapperClassName?: string;
}

export default function ScaleToFit({ children, className = "", wrapperClassName = "" }: ScaleToFitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !contentRef.current) return;

      const container = containerRef.current;
      const content = contentRef.current;

      const style = window.getComputedStyle(container);
      const paddingTop = parseFloat(style.paddingTop);
      const paddingBottom = parseFloat(style.paddingBottom);
      const paddingLeft = parseFloat(style.paddingLeft);
      const paddingRight = parseFloat(style.paddingRight);

      const availableWidth = container.clientWidth - paddingLeft - paddingRight;
      const availableHeight = container.clientHeight - paddingTop - paddingBottom;
      
      // We use scrollWidth/Height to get the real size of the content
      // including overflow.
      const contentWidth = content.scrollWidth;
      const contentHeight = content.scrollHeight;

      if (contentWidth === 0 || contentHeight === 0) return;

      const scaleX = availableWidth / contentWidth;
      const scaleY = availableHeight / contentHeight;

      // Scale to fit BOTH dimensions (so content is fully visible)
      let newScale = Math.min(scaleX, scaleY);
      
      setScale(newScale);
    };

    // Initial check
    // Delay slightly to allow layout to settle
    const timer = setTimeout(handleResize, 100);

    const observer = new ResizeObserver((entries) => {
        // Debounce or just run? ResizeObserver handles it efficiently usually.
        window.requestAnimationFrame(handleResize);
    });
    
    if (containerRef.current) observer.observe(containerRef.current);
    if (contentRef.current) observer.observe(contentRef.current);
    
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden flex items-center justify-center ${className}`}
    >
      <div
        ref={contentRef}
        className={`origin-center flex items-center justify-center ${wrapperClassName}`}
        style={{
          transform: `scale(${scale})`,
          // Ensure the content has a chance to layout at its preferred size
          // We don't force width here; the child should define its min-width or fixed width
          width: "auto", 
          height: "auto"
        }}
      >
        {children}
      </div>
    </div>
  );
}
