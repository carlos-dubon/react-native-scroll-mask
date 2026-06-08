import { cloneElement, useId, type ReactElement } from 'react';
import {
  StyleSheet,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ViewStyle,
} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
type Edge = 'top' | 'bottom' | 'left' | 'right';

const DEFAULT_FADE_SIZE = 40;
const DEFAULT_FADE_DISTANCE = 24;

type ScrollableProps = {
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

export function ScrollMask({
  children,
  color,
  horizontal,
  fadeSize = DEFAULT_FADE_SIZE,
  fadeDistance = DEFAULT_FADE_DISTANCE,
}: ScrollMaskProps) {
  const gradientId = useId().replace(/:/g, '');

  const childProps = children.props;
  const isHorizontal = horizontal ?? childProps.horizontal ?? false;

  const offset = useSharedValue(0);
  const viewportSize = useSharedValue(0);
  const contentSize = useSharedValue(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement, contentSize: size } =
      event.nativeEvent;

    offset.value = isHorizontal ? contentOffset.x : contentOffset.y;
    viewportSize.value = isHorizontal
      ? layoutMeasurement.width
      : layoutMeasurement.height;
    contentSize.value = isHorizontal ? size.width : size.height;

    childProps.onScroll?.(event);
  };

  const handleContentSizeChange = (width: number, height: number) => {
    contentSize.value = isHorizontal ? width : height;
    childProps.onContentSizeChange?.(width, height);
  };

  const startFadeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      offset.value,
      [0, fadeDistance],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  const endFadeStyle = useAnimatedStyle(() => {
    const distanceToEnd = contentSize.value - viewportSize.value - offset.value;

    return {
      opacity: interpolate(
        distanceToEnd,
        [0, fadeDistance],
        [0, 1],
        Extrapolation.CLAMP,
      ),
    };
  });

  const scrollable = cloneElement(children, {
    onScroll: handleScroll,
    onContentSizeChange: handleContentSizeChange,
  } as Partial<ScrollableProps>);

  const startEdge: Edge = isHorizontal ? 'left' : 'top';
  const endEdge: Edge = isHorizontal ? 'right' : 'bottom';

  return (
    <View style={styles.container}>
      {scrollable}

      <Animated.View
        pointerEvents="none"
        style={[edgeLayout(startEdge, fadeSize), startFadeStyle]}
      >
        <ScrollFadeGradient
          id={`${gradientId}-start`}
          color={color}
          edge={startEdge}
        />
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        style={[edgeLayout(endEdge, fadeSize), endFadeStyle]}
      >
        <ScrollFadeGradient
          id={`${gradientId}-end`}
          color={color}
          edge={endEdge}
        />
      </Animated.View>
    </View>
  );
}

function edgeLayout(edge: Edge, size: number): ViewStyle {
  switch (edge) {
    case 'top':
      return { position: 'absolute', top: 0, left: 0, right: 0, height: size };
    case 'bottom':
      return {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: size,
      };
    case 'left':
      return { position: 'absolute', left: 0, top: 0, bottom: 0, width: size };
    case 'right':
      return { position: 'absolute', right: 0, top: 0, bottom: 0, width: size };
  }
}

function ScrollFadeGradient({
  id,
  color,
  edge,
}: {
  id: string;
  color: string;
  edge: Edge;
}) {
  const isHorizontal = edge === 'left' || edge === 'right';
  const axis = isHorizontal
    ? { x1: '0', y1: '0', x2: '1', y2: '0' }
    : { x1: '0', y1: '0', x2: '0', y2: '1' };
  const edgeIsStart = edge === 'top' || edge === 'left';

  return (
    <Svg width="100%" height="100%">
      <Defs>
        <LinearGradient id={id} {...axis}>
          <Stop offset="0" stopColor={color} stopOpacity={edgeIsStart ? 1 : 0} />
          <Stop offset="1" stopColor={color} stopOpacity={edgeIsStart ? 0 : 1} />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${id})`} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
});
