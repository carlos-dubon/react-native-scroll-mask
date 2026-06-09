import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScrollMask } from 'react-native-scroll-mask';

const BACKGROUND = '#0b0b0f';

const rows = Array.from({ length: 24 }, (_, i) => `Row ${i + 1}`);

export default function App() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>react-native-scroll-mask</Text>

      <ScrollMask color={BACKGROUND} style={styles.list}>
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

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BACKGROUND,
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  title: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 24,
  },
  list: {
    flex: 1,
  },
  row: {
    backgroundColor: '#17171f',
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 10,
  },
  rowText: {
    color: '#ededf2',
    fontSize: 16,
    fontWeight: '500',
  },
});
