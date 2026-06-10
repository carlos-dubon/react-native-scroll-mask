import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScrollMask } from 'react-native-scroll-mask';

const themes = {
  dark: {
    background: '#0b0b0f',
    card: '#17171f',
    title: '#ffffff',
    text: '#ededf2',
  },
  light: {
    background: '#f3f3f7',
    card: '#ffffff',
    title: '#0b0b0f',
    text: '#1a1a22',
  },
};

type Theme = (typeof themes)[keyof typeof themes];

const rows = Array.from({ length: 24 }, (_, i) => `Row ${i + 1}`);

export default function App() {
  const [isDark] = useState(true);
  const theme = isDark ? themes.dark : themes.light;
  const styles = createStyles(theme);

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>react-native-scroll-mask</Text>

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
    title: {
      color: theme.title,
      fontSize: 22,
      fontWeight: '700',
      marginBottom: 24,
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
