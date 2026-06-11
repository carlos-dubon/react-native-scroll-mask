import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';
import { ScrollMask } from 'react-native-scroll-mask';

const themes = {
  dark: {
    background: '#0b0b0f',
    card: '#17171f',
    title: '#ffffff',
    subtitle: '#8a8a99',
    accent: '#6c7bff',
    text: '#ededf2',
    statusBar: 'light' as const,
  },
  light: {
    background: '#f3f3f7',
    card: '#ffffff',
    title: '#0b0b0f',
    subtitle: '#6b6b76',
    accent: '#4854d8',
    text: '#1a1a22',
    statusBar: 'dark' as const,
  },
};

type Theme = (typeof themes)[keyof typeof themes];

const rows = Array.from({ length: 24 }, (_, i) => `Row ${i + 1}`);
const tags = [
  'Reanimated',
  'SVG',
  'iOS',
  'Android',
  'Expo',
  'TypeScript',
  'Scroll',
  'Mask',
  'Fade',
  'Edges',
];

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const theme = isDark ? themes.dark : themes.light;
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.screen}>
        <StatusBar style={theme.statusBar} />

        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>react-native-scroll-mask</Text>
            <Text style={styles.subtitle}>
              Edges fade based on scroll position
            </Text>
          </View>
          <View style={styles.toggle}>
            <Text style={styles.toggleLabel}>{isDark ? 'Dark' : 'Light'}</Text>
            <Switch
              value={isDark}
              onValueChange={setIsDark}
              trackColor={{ false: '#c9c9d2', true: theme.accent }}
              thumbColor="#ffffff"
              ios_backgroundColor="#c9c9d2"
            />
          </View>
        </View>

        <Text style={styles.label}>Vertical</Text>
        <ScrollMask color={theme.background} style={styles.vertical}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.verticalContent}
          >
            {rows.map((row) => (
              <View key={row} style={styles.row}>
                <Text style={styles.rowText}>{row}</Text>
              </View>
            ))}
          </ScrollView>
        </ScrollMask>

        <Text style={styles.label}>Horizontal</Text>
        <ScrollMask
          color={theme.background}
          fadeSize={56}
          style={styles.horizontal}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalContent}
          >
            {tags.map((tag) => (
              <View key={tag} style={styles.chip}>
                <Text style={styles.chipText}>{tag}</Text>
              </View>
            ))}
          </ScrollView>
        </ScrollMask>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: 20,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      paddingTop: 24,
      paddingBottom: 32,
    },
    headerText: {
      flex: 1,
      paddingRight: 12,
    },
    title: {
      color: theme.title,
      fontSize: 22,
      fontWeight: '700',
    },
    subtitle: {
      color: theme.subtitle,
      fontSize: 14,
      marginTop: 6,
    },
    toggle: {
      alignItems: 'center',
      gap: 4,
    },
    toggleLabel: {
      color: theme.subtitle,
      fontSize: 12,
      fontWeight: '600',
    },
    label: {
      color: theme.accent,
      fontSize: 12,
      fontWeight: '600',
      letterSpacing: 1,
      textTransform: 'uppercase',
      marginBottom: 8,
    },
    vertical: {
      flex: 1,
      marginBottom: 28,
    },
    verticalContent: {
      gap: 10,
      paddingVertical: 4,
    },
    row: {
      backgroundColor: theme.card,
      borderRadius: 14,
      paddingVertical: 18,
      paddingHorizontal: 18,
    },
    rowText: {
      color: theme.text,
      fontSize: 16,
      fontWeight: '500',
    },
    horizontal: {
      height: 56,
      marginBottom: 40,
    },
    horizontalContent: {
      gap: 10,
      alignItems: 'center',
    },
    chip: {
      backgroundColor: theme.card,
      borderRadius: 999,
      paddingVertical: 12,
      paddingHorizontal: 20,
      justifyContent: 'center',
    },
    chipText: {
      color: theme.text,
      fontSize: 14,
      fontWeight: '500',
    },
  });
}
