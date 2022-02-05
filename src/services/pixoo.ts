import axios from 'axios';
import { PixooCommand } from '../types';
import type {
  PixooGenericResponse,
  GetHttpGifIdResponse,
  PixooBufferPayload,
} from '../types';

import type Pixoo from '../Pixoo';

export async function postBuffer(pixoo: Pixoo, payload: PixooBufferPayload) {
  const response = await axios.post(pixoo.url, payload);

  const data = response.data as PixooGenericResponse;

  if (data.error_code !== 0) {
    throw new Error('Error!');
  }
}

export async function getHttpGifId(
  pixoo: Pixoo,
): Promise<GetHttpGifIdResponse> {
  const response = await axios.post(pixoo.url, {
    Command: PixooCommand.GET_GIF_ID,
  });

  const data = response.data as GetHttpGifIdResponse;

  if (data.error_code !== 0) {
    throw new Error('Error!');
  }

  return data;
}
