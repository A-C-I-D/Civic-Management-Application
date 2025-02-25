import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications(); // Backend logic to be implemented by Prachi & Chaitanya
  }, []);

  const fetchNotifications = async () => {
    // Fetch notifications from backend API
    // Backend team: Replace with actual API call
    const data = [
      { id: '1', message: 'Your reported issue has been updated.', time: '2 hours ago' },
      { id: '2', message: 'New road maintenance work near your area.', time: '1 day ago' },
      { id: '3', message: 'Garbage collection delayed due to rain.', time: '3 days ago' }
    ];
    setNotifications(data);
  };

  const renderItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.time}>{item.time}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <FlatList data={notifications} renderItem={renderItem} keyExtractor={(item) => item.id} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  notificationItem: { padding: 15, borderBottomWidth: 1, borderColor: '#ccc' },
  message: { fontSize: 16 },
  time: { fontSize: 12, color: 'gray', marginTop: 5 }
});
