import type {
  RESIZE_NEAREST_NEIGHBOR,
  RESIZE_BILINEAR,
  RESIZE_BICUBIC,
} from 'jimp';

export enum PixooCommand {
  GET_GIF_ID = 'Draw/GetHttpGifId',
  SEND_GIF = 'Draw/SendHttpGif',
  SEND_TEXT = 'Draw/SendHttpText',
  SET_BRIGHTNESS = 'Channel/SetBrightness',
  SET_CLOCK_SELECT_ID = 'Channel/SetClockSelectId',
  SET_INDEX = 'Channel/SetIndex',
  SET_EQ_POSITION = 'Channel/SetEqPosition',
}

export type Position = [number, number];

export type PixooBufferPayload = {
  Command: PixooCommand;
  PicNum: number;
  PicWidth: number;
  PicOffset: number;
  PicID: number;
  PicSpeed: number;
  PicData: string;
};

export type RGB = [number, number, number];

export type PixooSize = 16 | 32 | 64;

export type GetHttpGifIdResponse = {
  error_code: number;
  PicId: number;
};

export type PixooGenericResponse = {
  error_code: number;
};

export type ImageResampleMode =
  | typeof RESIZE_NEAREST_NEIGHBOR
  | typeof RESIZE_BILINEAR
  | typeof RESIZE_BICUBIC;

export const Colors: {
  [value: string]: RGB;
} = {
  BLACK: [0, 0, 0],
  WHITE: [255, 255, 255],
};
