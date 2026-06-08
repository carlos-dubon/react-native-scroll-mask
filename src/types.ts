import type { ReactElement } from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

export type Edge = 'top' | 'bottom' | 'left' | 'right';

export type ScrollableProps = {
  horizontal?: boolean | null;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onContentSizeChange?: (width: number, height: number) => void;
};

export type ScrollMaskProps = {
  children: ReactElement<ScrollableProps>;
  color: string;
  horizontal?: boolean;
  fadeSize?: number;
  fadeDistance?: number;
};
