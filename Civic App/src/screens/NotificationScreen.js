import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function NotificationScreen() {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    setHasError(false);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data - this would be replaced with actual API call
      const data = [
        { 
          id: '1', 
          type: 'update', 
          title: 'Road Maintenance Update',
          message: 'Your reported pothole issue on Main Street has been assigned to a maintenance crew.',
          time: '2 hours ago',
          isRead: false,
          icon: 'construct-outline',
          color: '#1e88e5'
        },
        { 
          id: '2', 
          type: 'announcement', 
          title: 'Community Cleanup',
          message: 'Join us for a community cleanup event this weekend in Central Park.',
          time: '1 day ago',
          isRead: false,
          icon: 'people-outline',
          color: '#8e24aa'
        },
        { 
          id: '3', 
          type: 'alert', 
          title: 'Garbage Collection Delayed',
          message: 'Due to severe weather conditions, garbage collection scheduled for tomorrow has been postponed by 24 hours.',
          time: '3 days ago',
          isRead: true,
          icon: 'alert-circle-outline',
          color: '#e53935'
        },
        { 
          id: '4', 
          type: 'resolution', 
          title: 'Issue Resolved',
          message: 'The streetlight issue you reported on Oak Avenue has been resolved. Thank you for your contribution.',
          time: '5 days ago',
          isRead: true,
          icon: 'checkmark-circle-outline',
          color: '#43a047'
        },
        { 
          id: '5', 
          type: 'update', 
          title: 'Water Main Repair',
          message: 'A water main repair is scheduled for your neighborhood on Tuesday between 10am-2pm.',
          time: '1 week ago',
          isRead: true,
          icon: 'water-outline',
          color: '#1e88e5'
        }
      ];
      
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = (id) => {
    // Update local state to mark notification as read
    setNotifications(notifications.map(notification => 
      notification.id === id 
        ? {...notification, isRead: true} 
        : notification
    ));
    
    // This would also make an API call to update the server
  };

  const markAllAsRead = () => {
    // Update all notifications to read status
    setNotifications(notifications.map(notification => ({
      ...notification,
      isRead: true
    })));
    
    // This would also make an API call to update the server
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.notificationItem, item.isRead ? styles.readNotification : styles.unreadNotification]}
      onPress={() => markAsRead(item.id)}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
        <Ionicons name={item.icon} size={24} color="#ffffff" />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          {!item.isRead && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="notifications-off-outline" size={60} color="#ccc" />
      <Text style={styles.emptyText}>No notifications yet</Text>
      <Text style={styles.emptySubText}>When you receive notifications, they will appear here</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <TouchableOpacity 
            style={styles.markAllButton}
            onPress={markAllAsRead}
            disabled={isLoading || notifications.every(n => n.isRead) || notifications.length === 0}
          >
            <Text 
              style={[
                styles.markAllText, 
                (isLoading || notifications.every(n => n.isRead) || notifications.length === 0) && styles.markAllDisabled
              ]}
            >
              Mark all read
            </Text>
          </TouchableOpacity>
        </View>

        {/* Notification List */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1e88e5" />
            <Text style={styles.loadingText}>Loading notifications...</Text>
          </View>
        ) : hasError ? (
          <View style={styles.errorContainer}>
            <Ionicons name="cloud-offline-outline" size={60} color="#e53935" />
            <Text style={styles.errorText}>Couldn't load notifications</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={fetchNotifications}
            >
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList 
            data={notifications}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={renderEmptyList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 8,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  markAllButton: {
    padding: 8,
  },
  markAllText: {
    color: '#1e88e5',
    fontSize: 14,
    fontWeight: '500',
  },
  markAllDisabled: {
    color: '#bdbdbd',
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 8,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 2,
  },
  unreadNotification: {
    borderLeftWidth: 3,
    borderLeftColor: '#1e88e5',
  },
  readNotification: {
    opacity: 0.8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contentContainer: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1e88e5',
    marginLeft: 8,
  },
  message: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#1e88e5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  emptySubText: {
    marginTop: 8,
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
});