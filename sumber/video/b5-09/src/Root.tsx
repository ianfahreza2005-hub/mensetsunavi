import React from 'react';
import { Composition } from 'remotion';
import { Video } from './Video';
import { FPS, TOTAL } from './waktu';

// Video B5-09 "Saat tidak paham, jangan diam" (Bab 5 · Menjawab Pertanyaan). 1920×1080, 60 fps.
export const RemotionRoot: React.FC = () => {
  return <Composition id="B5-09" component={Video} durationInFrames={TOTAL} fps={FPS} width={1920} height={1080} />;
};
