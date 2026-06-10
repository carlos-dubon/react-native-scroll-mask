import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { ScrollMask } from 'react-native-scroll-mask';

const themes = {
  dark: {
    background: '#0b0b0f',
    card: '#17171f',
    title: '#ffffff',
    subtitle: '#8a8a99',
    accent: '#6c7bff',
    text: '#ededf2',
  },
  light: {
    background: '#f3f3f7',
    card: '#ffffff',
    title: '#0b0b0f',
    subtitle: '#6b6b76',
    accent: '#4854d8',
    text: '#1a1a22',
  },
};

type Theme = (typeof themes)[keyof typeof themes];

const rows = Array.from({ length: 24 }, (_, i) => `Row ${i + 1}`);

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const theme = isDark ? themes.dark : themes.light;
  const styles = createStyles(theme);

  return (
    <View style={styles.screen}>
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

      <ScrollMask color={theme.background} style={styles.vertical}>
        <ScrollView>
          {rows.map((row) => (
            <View key={row} style={styles.row}>
              <Text style={styles.rowText}>{row}</Text>
            </View>
          ))}
        </ScrollView>
      </ScrollMask>
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: 20,
      paddingTop: 80,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: 24,
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
    vertical: {
      flex: 1,
    },
    row: {
      backgroundColor: theme.card,
      borderRadius: 14,
      paddingVertical: 18,
      paddingHorizontal: 18,
      marginBottom: 10,
    },
    rowText: {
      color: theme.text,
      fontSize: 16,
      fontWeight: '500',
    },
  });
}
