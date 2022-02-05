import { Buffer } from 'buffer';
import type {
  PixooSize, RGB, Position, ImageResampleMode,
} from './types';
import FONT_PICO_8 from './utils/font';

import { getHttpGifId, postBuffer } from './services/pixoo';
import { PixooCommand, Colors } from './types';

import {
  clampColor, loadImage, resizeImage, toImageBuffer,
} from './utils/utils';

export default class Pixoo {
  ip: string;

  picId: number = 0;

  size: PixooSize;

  buffer: RGB[] = [];

  constructor(ip: string, size: PixooSize) {
    this.ip = ip;
    this.size = size;
  }

  async init() {
    const { PicId } = await getHttpGifId(this);
    this.picId = PicId;

    this.fill();
  }

  fill(rgb: RGB = Colors.BLACK) {
    const clamped = clampColor(rgb);

    this.buffer = [];

    for (let i = 0; i < this.pixelCount; i += 1) {
      this.buffer.push(clamped);
    }
  }

  fillRGB(r: number, g: number, b: number) {
    this.fill([r, g, b]);
  }

  async drawBuffer() {
    this.picId += 1;

    await postBuffer(this, {
      Command: PixooCommand.SEND_GIF,
      PicNum: 1,
      PicWidth: this.size,
      PicOffset: 0,
      PicID: this.picId,
      PicSpeed: 1000,
      PicData: Buffer.from(this.buffer.flat()).toString('base64'),
    });
  }

  async drawPixel(pos: Position, rgb: RGB) {
    if (
      pos[0] < 0
      || pos[1] >= this.size
      || pos[1] < 0
      || pos[1] >= this.size
    ) {
      return;
    }

    const index = pos[0] + pos[1] * this.size;

    if (index < 0 || index >= this.pixelCount) {
      return;
    }

    const clamped = clampColor(rgb);
    this.buffer[index] = clamped;
  }

  async drawText(text: string, pos: Position, color: RGB = Colors.WHITE) {
    [...text].map((c, i) => this.drawChar(c, [i * 4 + pos[0], pos[1]], color));

    await this.drawBuffer();
  }

  async drawChar(char: string, pos: Position, color: RGB) {
    const charMatrix = FONT_PICO_8[char];
    if (!charMatrix) {
      return;
    }
    charMatrix.forEach((bit, index) => {
      if (bit === 1) {
        const x = index % 3;
        const y = Math.floor(index / 3);

        this.drawPixel([pos[0] + x, pos[1] + y], color);
      }
    });
  }

  async drawImage(
    imagePath: string,
    pos: Position,
    resampleMode: ImageResampleMode = 'nearestNeighbor',
  ) {
    this.buffer = [];
    const image = await loadImage(imagePath);

    const resized = await resizeImage(
      image,
      [this.size, this.size],
      resampleMode,
    );
    const imgBuf = toImageBuffer(resized);

    for (let y = 0; y < resized.getHeight(); y += 1) {
      for (let x = 0; x < resized.getWidth(); x += 1) {
        const shiftedXPos = x + pos[0];
        if (this.size - 1 < shiftedXPos || shiftedXPos < 0) {
          continue;
        }

        const shiftedYPos = y + pos[1];
        if (this.size - 1 < shiftedYPos || shiftedYPos < 0) {
          continue;
        }

        this.drawPixel([shiftedXPos, shiftedYPos], imgBuf[x + y * this.size]);
      }
    }

    await this.drawBuffer();
  }

  get url() {
    return `http://${this.ip}/post`;
  }

  get pixelCount() {
    return this.size * this.size;
  }
}
