# react-native-scroll-mask

[![npm version](https://img.shields.io/npm/v/react-native-scroll-mask.svg)](https://www.npmjs.com/package/react-native-scroll-mask)
[![license](https://img.shields.io/npm/l/react-native-scroll-mask.svg)](./LICENSE)

Fades the edges of a scroll view so people get a hint there's more to see. The top edge only shows up once you've scrolled down a bit, and the bottom fades away as you reach the end.

I put this together after running into [twilson.net/scroll-mask](https://twilson.net/scroll-mask) and wanting the same effect in React Native. It's built on [Reanimated](https://docs.swmansion.com/react-native-reanimated/) and [react-native-svg](https://github.com/software-mansion/react-native-svg), and I've been using it on both iOS and Android.

<p align="center">
  <img src="https://raw.githubusercontent.com/carlos-dubon/react-native-scroll-mask/main/screenshots/light.png" width="300" alt="Scroll mask in light mode — the fade adapts to the background color" />
</p>

The fade is just your background `color` painted over the edge, so it picks up whatever theme you're on.

## Install

```sh
npm i react-native-scroll-mask
```

It leans on Reanimated and SVG. If you don't already have those:

```sh
# Expo
npx expo install react-native-reanimated react-native-svg

# bare React Native
npm install react-native-reanimated react-native-svg
```

Reanimated needs its Babel plugin to be set up. On Expo (SDK 53+) `babel-preset-expo` takes care of it. On a bare project, add the worklets plugin to `babel.config.js` — it has to be last:

```js
module.exports = {
  presets: ["module:@react-native/babel-preset"],
  plugins: ["react-native-worklets/plugin"],
};
```

## Using it

Wrap a scrollable and pass the `color` sitting behind it — usually your screen background. That's what the edges fade into.

```tsx
import { ScrollView, View, Text } from "react-native";
import { ScrollMask } from "react-native-scroll-mask";

const BACKGROUND = "#0b0b0f";

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

Horizontal works the same way. It reads the `horizontal` prop off the child, so you don't have to say it twice:

```tsx
<ScrollMask color={BACKGROUND} fadeSize={56} style={{ height: 56 }}>
  <ScrollView horizontal>
    {tags.map((tag) => (
      <Chip key={tag} label={tag} />
    ))}
  </ScrollView>
</ScrollMask>
```

`FlatList`, `SectionList`, `Animated.ScrollView` — anything that scrolls and fires `onScroll` is fine:

```tsx
import { FlatList } from "react-native";
import { ScrollMask } from "react-native-scroll-mask";

<ScrollMask color={BACKGROUND} style={{ flex: 1 }}>
  <FlatList
    data={data}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => <Row item={item} />}
  />
</ScrollMask>;
```

Your own `onScroll` and `onContentSizeChange` keep firing — it wraps them, it doesn't take them over.

## Props

`color` and a single scrollable child are the only things you have to pass.

| Prop           | Type                   | Default      | What it does                                                               |
| -------------- | ---------------------- | ------------ | -------------------------------------------------------------------------- |
| `children`     | `ReactElement`         | **required** | One scrollable element (`ScrollView`, `FlatList`, …).                      |
| `color`        | `string`               | **required** | The background behind the scrollable. Edges fade into this.                |
| `horizontal`   | `boolean`              | child's prop | Fade direction. Falls back to the child's `horizontal`, then to `false`.   |
| `fadeSize`     | `number`               | `40`         | How long each faded edge is, in px.                                        |
| `fadeDistance` | `number`               | `24`         | How much you scroll (px) to take a fade from hidden to fully shown.        |
| `style`        | `StyleProp<ViewStyle>` | —            | Style for the wrapper. This is where sizing goes (`flex: 1`, etc.).        |
| `resetKey`     | `unknown`              | —            | Change it to snap the tracked scroll offset back to `0` after a data swap. |

## How it works

Nothing fancy. It drops two SVG gradients over your scrollable, one per edge, each going from `color` to transparent. As you scroll it reads `contentOffset` / `layoutMeasurement` / `contentSize` on the UI thread and animates each gradient's opacity with Reanimated — the start edge fades in as you leave the top, the end edge fades out as you approach the bottom.

Since it's just a tint of `color`, it wants a solid background underneath. If your list sits over a photo or a busy gradient, set `color` to whatever's closest at the edge, or put the mask over a solid surface.

## Example

There's a runnable Expo app in [`example/`](./example):

```sh
pnpm install
pnpm build
cd example
pnpm ios   # or pnpm android
```

## License

MIT © [carlos-dubon](https://github.com/carlos-dubon)
