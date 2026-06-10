import { Tabs } from 'expo-router'
import { Text } from 'react-native'

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#4f46e5',
      tabBarInactiveTintColor: '#9ca3af',
      headerStyle: { backgroundColor: '#fff' },
      headerTintColor: '#111827',
      headerTitleStyle: { fontWeight: '600' }
    }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Projects',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>⊞</Text>
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🔔</Text>
        }}
      />
    </Tabs>
  )
}
