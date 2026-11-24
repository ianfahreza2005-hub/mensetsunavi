import React from 'react';
import { Composition } from 'remotion';
import { Video } from './Video';
import { FPS, TOTAL } from './waktu';

// Video B2-09 "Contoh telepon renraku" (Bab 2 · Hou-Ren-Sou Sebelum Wawancara). 1920×1080, 60 fps.
export const RemotionRoot: React.FC = () => {
  return <Composition id="B2-09" component={Video} durationInFrames={TOTAL} fps={FPS} width={1920} height={1080} />;
};
