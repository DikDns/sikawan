import { ImgHTMLAttributes, useState } from 'react';
import { cn } from '@/lib/utils';

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    fallback?: string;
}

export default function Image({
    src,
    alt,
    className,
    fallback = '/placeholder-image.png',
    ...props
}: ImageProps) {
    const [imgSrc, setImgSrc] = useState(src || fallback);
    const [isLoading, setIsLoading] = useState(true);

    const handleError = () => {
        setImgSrc(fallback);
        setIsLoading(false);
    };

    const handleLoad = () => {
        setIsLoading(false);
    };

    return (
        <img
            src={imgSrc}
            alt={alt}
            className={cn(className, isLoading && 'opacity-50')}
            onError={handleError}
            onLoad={handleLoad}
            {...props}
        />
    );
}
