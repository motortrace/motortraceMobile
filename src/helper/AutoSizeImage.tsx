import react from 'react';
import React, { useEffect, useState } from 'react';
import { Image, Dimensions } from 'react-native';
import Colors from '../constants/colors';

const AutoSizeImage = ({ uri }: { uri: string }) => {
  const [imageHeight, setImageHeight] = useState<number | null>(null);
  const screenWidth = Dimensions.get('window').width;
  const containerPadding = 32; // Adjust if your container has different horizontal padding
  const maxWidth = (screenWidth - containerPadding - 20);

  useEffect(() => {
    Image.getSize(
      uri,
      (originalWidth, originalHeight) => {
        const ratio = originalHeight / originalWidth;
        const scaledHeight = maxWidth * ratio;
        setImageHeight(scaledHeight);
      },
      () => {
        setImageHeight(maxWidth * (9 / 16)); // fallback to 16:9
      }
    );
  }, [uri]);

  if (!imageHeight) return null;

  return (
    <Image
      source={{ uri }}
      style={{
        width: maxWidth,
        height: imageHeight,
        borderRadius: 8,
        backgroundColor: Colors.neutral100,
      }}
      resizeMode="cover"
    />
  );
};

export default AutoSizeImage;