import type { ReactElement } from 'react';

export type Edge = 'top' | 'bottom';

export type ScrollMaskProps = {
  children: ReactElement;
  color: string;
  fadeSize?: number;
  fadeDistance?: number;
};
