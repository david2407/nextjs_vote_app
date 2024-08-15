import Image from 'next/image';
import { useState } from 'react';

const MyImage = ({ src, alt, width, height }) => {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    setImgSrc('/default.jpeg'); // Replace this with your fallback image path
  };

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      onError={handleError}
      unoptimized // Use this if you want to disable automatic optimization (optional)
    />
  );
};

export default MyImage;









