import { cloneElement } from 'react';
import {
  StyleSheet,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import type { ScrollMaskProps } from './types';

const DEFAULT_FADE_SIZE = 40;
const DEFAULT_FADE_DISTANCE = 24;

export function ScrollMask({
  children,
  color,
  fadeSize = DEFAULT_FADE_SIZE,
  fadeDistance = DEFAULT_FADE_DISTANCE,
}: ScrollMaskProps) {
  const offset = useSharedValue(0);
  const viewportSize = useSharedValue(0);
  const contentSize = useSharedValue(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement, contentSize: size } =
      event.nativeEvent;

    offset.value = contentOffset.y;
    viewportSize.value = layoutMeasurement.height;
    contentSize.value = size.height;
  };

  const topStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      offset.value,
      [0, fadeDistance],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  const bottomStyle = useAnimatedStyle(() => {
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

  const scrollable = cloneElement(children, { onScroll: handleScroll });

  return (
    <View style={styles.container}>
      {scrollable}

      <Animated.View
        pointerEvents="none"
        style={[styles.top, { height: fadeSize }, topStyle]}
      >
        <Svg width="100%" height="100%">
          <Defs>
            <LinearGradient id="scroll-mask-top" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={color} stopOpacity={1} />
              <Stop offset="1" stopColor={color} stopOpacity={0} />
            </LinearGradient>
          </Defs>
          <Rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#scroll-mask-top)"
          />
        </Svg>
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        style={[styles.bottom, { height: fadeSize }, bottomStyle]}
      >
        <Svg width="100%" height="100%">
          <Defs>
            <LinearGradient id="scroll-mask-bottom" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={color} stopOpacity={0} />
              <Stop offset="1" stopColor={color} stopOpacity={1} />
            </LinearGradient>
          </Defs>
          <Rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#scroll-mask-bottom)"
          />
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  top: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
