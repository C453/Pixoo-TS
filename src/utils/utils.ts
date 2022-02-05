import Jimp from 'jimp';
import type { RGB, ImageResampleMode } from '../types';

export async function loadImage(path: string) {
  return Jimp.read(path);
}

export async function resizeImage(
  image: Jimp,
  size: [number, number],
  method: ImageResampleMode = 'nearestNeighbor',
) {
  return image.resize(size[0], size[1], method);
}

export function toImageBuffer(image: Jimp) {
  function unflattenToRGB(arr: number[], result: RGB[]): RGB[] {
    if (arr.length === 0) {
      return result;
    }

    const pixelRGBData = arr.splice(0, 3) as RGB;
    result.push(pixelRGBData);
    return unflattenToRGB(arr, result);
  }

  // image.bitmap.data is format (r, g, b, a), but Pixoo only handles RGB data
  // so we remove the alpha channel here
  const imgBuf = Array.from(image.bitmap.data.filter((_val, index) => (index + 1) % 4 !== 0));

  if (imgBuf.length % 3 !== 0) {
    throw new Error('invalid image!');
  }

  const rgbBuf: RGB[] = [];
  unflattenToRGB(imgBuf, rgbBuf);

  return rgbBuf;
}

export function clamp(num: number, min: number = 0, max: number = 255) {
  return Math.min(Math.max(num, min), max);
}

export function clampColor(rgb: RGB): RGB {
  return [clamp(rgb[0]), clamp(rgb[1]), clamp(rgb[2])];
}

export function rgbToHex(rgb: RGB) {
  function toHex(c: number) {
    const hex = c.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  }

  return `#${rgb.map(toHex).join('')}`;
}
