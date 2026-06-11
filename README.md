# react-native-scroll-mask

[![npm version](https://img.shields.io/npm/v/react-native-scroll-mask.svg)](https://www.npmjs.com/package/react-native-scroll-mask)
[![license](https://img.shields.io/npm/l/react-native-scroll-mask.svg)](./LICENSE)

Fade the edges of any scrollable in React Native based on scroll position. The fade appears only where there is more content to scroll — the top edge fades in once you scroll down, the bottom edge fades out as you reach the end — so users always get a subtle hint that there is more to see.

Inspired by [twilson.net/scroll-mask](https://twilson.net/scroll-mask), built for React Native with [Reanimated](https://docs.swmansion.com/react-native-reanimated/) and [react-native-svg](https://github.com/software-mansion/react-native-svg). Works on **iOS** and **Android**.

<p align="center">
  <img src="https://raw.githubusercontent.com/carlos-dubon/react-native-scroll-mask/main/screenshots/dark.png" width="300" alt="Scroll mask in dark mode — the bottom edge of the list fades out" />
  &nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/carlos-dubon/react-native-scroll-mask/main/screenshots/light.png" width="300" alt="Scroll mask in light mode — the fade adapts to the background color" />
</p>

https://github.com/user-attachments/assets/e42ced86-6340-40d0-be3f-9b292f0588cd

<p align="center">
  <em>The fade follows the background <code>color</code>, so it adapts to any theme. Try the toggle in the <a href="./example">example app</a>.</em>
</p>

## Features

- Wrap any scrollable — `ScrollView`, `FlatList`, `SectionList`, `Animated.ScrollView`, etc.
- Vertical and horizontal support (auto-detected from the child's `horizontal` prop).
- Smooth, gesture-driven fades that run on the UI thread via Reanimated.
- Fully typed, tiny, and dependency-light (only Reanimated + SVG, which you most likely already use).
- Your own `onScroll` / `onContentSizeChange` handlers keep working.

## Installation

```sh
pnpm add react-native-scroll-mask
# or: npm install react-native-scroll-mask
# or: yarn add react-native-scroll-mask
```

### Peer dependencies

This package relies on Reanimated and SVG. If you don't have them yet:

```sh
# Expo
npx expo install react-native-reanimated react-native-svg

# Bare React Native
pnpm add react-native-reanimated react-native-svg
```

Make sure Reanimated is set up in your Babel config. With Expo (SDK 53+) `babel-preset-expo` configures it automatically. For a bare project, add the worklets plugin to `babel.config.js`:

```js
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: ['react-native-worklets/plugin'], // must be listed last
};
```

## Usage

Wrap a scrollable in `ScrollMask` and pass the `color` that sits behind it (usually your screen's background). The mask fades content into that color at the edges.

### Vertical `ScrollView`

```tsx
import { ScrollView, View, Text } from 'react-native';
import { ScrollMask } from 'react-native-scroll-mask';

const BACKGROUND = '#0b0b0f';

export function List() {
  return (
    <ScrollMask color={BACKGROUND} style={{ flex: 1 }}>
      <ScrollView>
        {items.map((item) => (
          <View key={item.id}>
            <Text>{item.label}</Text>
          </View>
        ))}
      </ScrollView>
    </ScrollMask>
  );
}
```

### Horizontal scroll

`horizontal` is inferred from the child, so a horizontal `ScrollView` just works:

```tsx
<ScrollMask color={BACKGROUND} fadeSize={56} style={{ height: 56 }}>
  <ScrollView horizontal>
    {tags.map((tag) => (
      <Chip key={tag} label={tag} />
    ))}
  </ScrollView>
</ScrollMask>
```

### `FlatList`

```tsx
import { FlatList } from 'react-native';
import { ScrollMask } from 'react-native-scroll-mask';

<ScrollMask color={BACKGROUND} style={{ flex: 1 }}>
  <FlatList
    data={data}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => <Row item={item} />}
  />
</ScrollMask>;
```

## Props

| Prop           | Type                     | Default      | Description                                                                                  |
| -------------- | ------------------------ | ------------ | -------------------------------------------------------------------------------------------- |
| `children`     | `ReactElement`           | **required** | A single scrollable element (`ScrollView`, `FlatList`, …).                                    |
| `color`        | `string`                 | **required** | The background color behind the scrollable. The edges fade into this color.                  |
| `horizontal`   | `boolean`                | child's prop | Direction of the fade. Defaults to the child's `horizontal` prop, falling back to `false`.   |
| `fadeSize`     | `number`                 | `40`         | Length (in px) of each faded edge.                                                           |
| `fadeDistance` | `number`                 | `24`         | Scroll distance (in px) over which a fade animates from fully hidden to fully shown.         |
| `style`        | `StyleProp<ViewStyle>`   | —            | Style for the wrapper `View`. Use this for sizing/layout (e.g. `flex: 1`).                    |
| `resetKey`     | `unknown`                | —            | When this value changes, the internal scroll offset is reset to `0` (handy after data swaps). |

## How it works

`ScrollMask` wraps your scrollable in a relative container and overlays two non-interactive gradients — one at each edge — that blend from `color` to transparent. As you scroll, it reads `contentOffset`, `layoutMeasurement`, and `contentSize` on the UI thread and animates each gradient's opacity with Reanimated:

- The **start** edge fades in as you scroll away from the beginning.
- The **end** edge fades out as you approach the end.

Because the effect is an overlay tinted with `color`, it works over a solid background. If your scrollable sits on top of an image or a multi-color gradient, set `color` to the dominant edge color or place the mask over a solid surface.

## Example app

A runnable Expo example lives in [`example/`](./example).

```sh
pnpm install
pnpm build          # build the library once
cd example
pnpm ios            # or: pnpm android
```

## License

MIT © [carlos-dubon](https://github.com/carlos-dubon)
