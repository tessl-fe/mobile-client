import { View, Text, StyleSheet } from 'react-native'

interface Props {
  projectId: string
  projectName: string
  date: string
  count: number
}

export function AlertItem({ projectName, date, count }: Props) {
  return (
    <View style={styles.item}>
      <View style={styles.dot} />
      <View style={styles.content}>
        <Text style={styles.project}>{projectName}</Text>
        <Text style={styles.detail}>{count} events on {date}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff'
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4f46e5',
    marginTop: 5,
    marginRight: 10
  },
  content: { flex: 1 },
  project: { fontSize: 14, fontWeight: '500', color: '#111827' },
  detail: { fontSize: 12, color: '#6b7280', marginTop: 2 }
})
