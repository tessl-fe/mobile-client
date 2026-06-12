import { useEffect, useState, useCallback } from 'react'
import { View, FlatList, Text, TouchableOpacity, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native'
import { router, useFocusEffect } from 'expo-router'
import { api, Project, MetricBucket } from '@/lib/api'
import { clearTokens } from '@/lib/auth'
import { ProjectRow } from '@/components/ProjectRow'

export default function HomeScreen() {
  const [projects, setProjects] = useState<Project[]>([])
  const [metrics, setMetrics] = useState<Record<string, MetricBucket[]>>({})
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  async function load() {
    try {
      const list = await api.projects.list()
      setProjects(list)
      const entries = await Promise.all(
        list.map(async p => {
          try {
            const { buckets } = await api.metrics.get(p.id)
            return [p.id, buckets] as [string, MetricBucket[]]
          } catch {
            return [p.id, []] as [string, MetricBucket[]]
          }
        })
      )
      setMetrics(Object.fromEntries(entries))
    } catch (err) {
      if (err instanceof Error && err.message === 'Session expired') {
        await clearTokens()
        router.replace('/')
        return
      }
      // Network errors during background refresh should not crash the screen
      if (!refreshing) {
        setProjects([])
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useFocusEffect(useCallback(() => { load() }, []))

  function onRefresh() {
    if (refreshing) return
    setRefreshing(true)
    load()
  }

  if (loading) {
    return <View style={styles.center}><ActivityIndicator color="#4f46e5" /></View>
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={projects}
        keyExtractor={p => p.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4f46e5" />}
        ListEmptyComponent={<Text style={styles.empty}>No projects yet. Create one in the web dashboard.</Text>}
        renderItem={({ item }) => (
          <ProjectRow
            project={item}
            buckets={metrics[item.id] ?? []}
            onPress={() => {}}
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
