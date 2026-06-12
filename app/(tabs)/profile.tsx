import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { router } from 'expo-router'
import { clearTokens, getTokens } from '@/lib/auth'
import { useEffect, useState } from 'react'

export default function ProfileScreen() {
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    getTokens().then(tokens => {
      if (!tokens) { router.replace('/'); return }
    })
  }, [])

  async function handleLogout() {
    Alert.alert('Log out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out', style: 'destructive',
        onPress: async () => {
          await clearTokens()
          router.replace('/')
        }
      }
    ])
  }

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        {email && <Text style={styles.email}>{email}</Text>}
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 24 },
  section: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 12, fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  email: { fontSize: 14, color: '#111827' },
  logoutButton: { backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#fca5a5' },
  logoutText: { fontSize: 14, fontWeight: '600', color: '#ef4444' }
})
