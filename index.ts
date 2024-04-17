import sharp from "sharp";
import { match } from "ts-pattern";

interface ImageMetaData {
  input: string;
  height: number;
  width: number;
}

interface ImageMetaDataWithOffset {
  input: string;
  top: number;
  left: number;
}

export enum JoinImageDirection {
  Auto = "auto",
  AutoReverse = "auto-reverse",
  Vertical = "vertical",
  Horizontal = "horizontal",
}

export interface JoinImageOptions {
  direction?: JoinImageDirection;
  background?: string | {
    alpha: number,
    b: number,
    g: number,
    r: number,
  }
}

const getImageMetadata = async (input: string): Promise<ImageMetaData> => {
  const { width, height } = await sharp(input).metadata();

  if (width === undefined || height === undefined) {
    throw Error(
      `Image "${input}" could not be loaded or does not have valid dimensions`,
    );
  }

  return {
    input,
    height,
    width,
  };
};

const getDimensions = (images: ImageMetaData[]) => {
  return {
    maxWidth: Math.max(...images.map(({ width }) => width)),
    maxHeight: Math.max(...images.map(({ height }) => height)),
    totalWidth: images.reduce(
      (accumulator, { width }) => accumulator + width,
      0,
    ),
    totalHeight: images.reduce(
      (accumulator, { height }) => accumulator + height,
      0,
    ),
  };
};

const addOffsetToImages = (
  images: ImageMetaData[],
  isVertical: boolean,
): ImageMetaDataWithOffset[] => {
  let top = 0;
  let left = 0;

  return images.reduce(
    (res: ImageMetaDataWithOffset[], image: ImageMetaData) => {
      res.push({
        input: image.input,
        top,
        left,
      });

      top += isVertical ? image.height : 0;
      left += isVertical ? 0 : image.width;

      return res;
    },
    [],
  );
};

export const joinImages = async (
  images: string[],
  output: string,
  options?: JoinImageOptions,
) => {
  const imageData = await Promise.all(images.map(getImageMetadata));

  const { maxWidth, maxHeight, totalWidth, totalHeight } =
    getDimensions(imageData);

  const isVertical = match(options?.direction)
    .with(JoinImageDirection.AutoReverse, () => maxWidth < maxHeight)
    .with(JoinImageDirection.Vertical, () => true)
    .with(JoinImageDirection.Horizontal, () => false)
    .otherwise(() => maxWidth > maxHeight);

  const imageOffsetData = addOffsetToImages(imageData, isVertical);

  await sharp({
    create: {
      background: options?.background || { alpha: 0, b: 255, g: 255, r: 255 },
      channels: 4,
      height: isVertical ? totalHeight : maxHeight,
      width: isVertical ? maxWidth : totalWidth,
    },
  })
    .composite(imageOffsetData)
    .toFile(output);
};
