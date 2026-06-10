import { useEffect, useState, useCallback } from 'react'
import { View, FlatList, Text, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native'
import { router, useFocusEffect } from 'expo-router'
import { api, Project, MetricBucket } from '@/lib/api'
import { clearTokens } from '@/lib/auth'
import { AlertItem } from '@/components/AlertItem'

interface AlertEntry {
  key: string
  projectId: string
  projectName: string
  date: string
  count: number
}

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState<AlertEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  async function load() {
    try {
      const projects = await api.projects.list()
      const allAlerts: AlertEntry[] = []

      await Promise.all(
        projects.map(async (p: Project) => {
          try {
            const { buckets } = await api.metrics.get(p.id)
            for (const b of buckets) {
              allAlerts.push({
                key: `${p.id}-${b.date}`,
                projectId: p.id,
                projectName: p.name,
                date: b.date,
                count: b.count
              })
            }
          } catch {
            // skip projects with no metrics
          }
        })
      )

      // Most recent first
      allAlerts.sort((a, b) => b.date.localeCompare(a.date))
      setAlerts(allAlerts.slice(0, 50))
    } catch (err) {
      if (err instanceof Error && err.message === 'Session expired') {
        await clearTokens()
        router.replace('/')
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useFocusEffect(useCallback(() => { load() }, []))

  function onRefresh() { setRefreshing(true); load() }

  if (loading) {
    return <View style={styles.center}><ActivityIndicator color="#4f46e5" /></View>
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={alerts}
        keyExtractor={a => a.key}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4f46e5" />}
        ListEmptyComponent={<Text style={styles.empty}>No activity yet. Events will appear here once your projects receive API calls.</Text>}
        renderItem={({ item }) => (
          <AlertItem
            projectId={item.projectId}
            projectName={item.projectName}
            date={item.date}
            count={item.count}
          />
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { textAlign: 'center', color: '#9ca3af', fontSize: 14, marginTop: 48, paddingHorizontal: 32 }
})
