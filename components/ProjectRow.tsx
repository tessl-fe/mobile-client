import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import type { Project, MetricBucket } from '@/lib/api'

interface Props {
  project: Project
  buckets: MetricBucket[]
  onPress: () => void
}

export function ProjectRow({ project, buckets, onPress }: Props) {
  const total = buckets.reduce((sum, b) => sum + b.count, 0)
  const lastSeen = buckets.length > 0 ? buckets[buckets.length - 1].date : null

  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.left}>
        <Text style={styles.name}>{project.name}</Text>
        <Text style={styles.meta}>
          {total.toLocaleString()} events{lastSeen ? ` · last ${lastSeen}` : ''}
        </Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb'
  },
  left: { flex: 1 },
  name: { fontSize: 15, fontWeight: '500', color: '#111827' },
  meta: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  arrow: { fontSize: 18, color: '#d1d5db', marginLeft: 8 }
})
