import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import { router } from 'expo-router'
import { api } from '@/lib/api'
import { saveTokens } from '@/lib/auth'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    if (!email || !password) return
    setLoading(true)
    try {
      const { accessToken, refreshToken } = await api.auth.login(email, password)
      await saveTokens(accessToken, refreshToken)
      router.replace('/(tabs)/home')
    } catch {
      Alert.alert('Login failed', 'Check your email and password and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Forge</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          textContentType="password"
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>{loading ? 'Signing in…' : 'Sign in'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', justifyContent: 'center', paddingHorizontal: 24 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 24, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  title: { fontSize: 28, fontWeight: '700', color: '#4f46e5', textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 24 },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, marginBottom: 12, color: '#111827' },
  button: { backgroundColor: '#4f46e5', borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginTop: 4 },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 15 }
})
