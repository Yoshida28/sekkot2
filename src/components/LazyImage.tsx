import React, { useState } from 'react';
import { Blurhash } from 'react-blurhash';
import { useInView } from 'react-intersection-observer';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  blurhash?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({ 
  src, 
  alt, 
  className = '', 
  blurhash = 'LEHV6nWB2yk8pyo0adR*.7kCMdnj' 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <div ref={ref} className={`relative ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0">
          {blurhash ? (
            <Blurhash
              hash={blurhash}
              width="100%"
              height="100%"
              resolutionX={32}
              resolutionY={32}
              punch={1}
            />
          ) : (
            <Skeleton className="h-full w-full" />
          )}
        </div>
      )}
      
      {inView && (
        <img
          src={src}
          alt={alt}
          className={`${className} transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsLoaded(true)}
          loading="lazy"
          srcSet={`
            ${src}?w=400 400w,
            ${src}?w=800 800w,
            ${src}?w=1200 1200w
          `}
          sizes="(max-width: 400px) 100vw, (max-width: 800px) 50vw, 33vw"
        />
      )}
    </div>
  );
};

export default LazyImage;