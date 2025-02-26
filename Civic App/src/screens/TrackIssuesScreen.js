import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  FlatList, 
  SafeAreaView,
  StatusBar,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mock data - replace with actual API call
const mockIssues = [
  {
    id: '1',
    title: 'Road Pothole',
    description: 'Large pothole on Fergusson College Road near Garware Bridge junction causing traffic slowdown',
    status: 'In Progress',
    category: 'Roads',
    location: 'FC Road, Shivajinagar',
    timestamp: '2025-02-20T14:30:00',
    image: 'https://example.com/pothole.jpg',
    statusColor: '#FFA000', // amber for in progress
    reportedBy: 'Rahul Sharma'
  },
  {
    id: '2',
    title: 'Street Light Outage',
    description: 'Three street lights not working near Saras Baug park entrance creating safety concerns at night',
    status: 'Reported',
    category: 'Lighting',
    location: 'Saras Baug, Swargate',
    timestamp: '2025-02-23T09:15:00',
    image: 'https://example.com/streetlight.jpg',
    statusColor: '#e53935', // red for reported
    reportedBy: 'Priya Patel'
  },
  {
    id: '3',
    title: 'Garbage Collection Missed',
    description: 'Garbage collection was missed in our society for the past two days causing hygiene issues',
    status: 'Resolved',
    category: 'Sanitation',
    location: 'Kothrud, Dahanukar Colony',
    timestamp: '2025-02-15T11:20:00',
    image: 'https://example.com/garbage.jpg',
    statusColor: '#43a047', // green for resolved
    reportedBy: 'Amit Deshmukh'
  },
  {
    id: '4',
    title: 'Water Supply Disruption',
    description: 'No water supply in our area since yesterday morning. Tanker requested but not received.',
    status: 'In Progress',
    category: 'Water',
    location: 'NIBM Road, Kondhwa',
    timestamp: '2025-02-18T16:45:00',
    image: 'https://example.com/water.jpg',
    statusColor: '#FFA000', // amber for in progress
    reportedBy: 'Sunita Joshi'
  },
  {
    id: '5',
    title: 'Illegal Construction',
    description: 'Unauthorized construction happening in the green zone area near the river bed',
    status: 'Reported',
    category: 'Zoning',
    location: 'Koregaon Park, Lane 7',
    timestamp: '2025-02-22T10:30:00',
    image: 'https://example.com/construction.jpg',
    statusColor: '#e53935', // red for reported
    reportedBy: 'Vikram Malhotra'
  },
  {
    id: '6',
    title: 'Broken Footpath',
    description: 'Footpath tiles broken and dangerous for pedestrians, especially senior citizens',
    status: 'Resolved',
    category: 'Pedestrian',
    location: 'JM Road, Deccan',
    timestamp: '2025-02-12T13:45:00',
    image: 'https://example.com/footpath.jpg',
    statusColor: '#43a047', // green for resolved
    reportedBy: 'Neha Kulkarni'
  },
];

const getStatusIcon = (status) => {
  switch(status) {
    case 'Reported':
      return 'alert-circle-outline';
    case 'In Progress':
      return 'time-outline';
    case 'Resolved':
      return 'checkmark-circle-outline';
    default:
      return 'help-circle-outline';
  }
};

export default function TrackIssuesScreen({ navigation }) {
  const [issues, setIssues] = useState(mockIssues);
  const [filter, setFilter] = useState('All');
  
  useEffect(() => {
    // Fetch issues from API - to be implemented
  }, []);
  
  const filteredIssues = filter === 'All' 
    ? issues 
    : issues.filter(issue => issue.status === filter);
  
  const renderStatusFilter = () => (
    <View style={styles.filterContainer}>
      {['All', 'Reported', 'In Progress', 'Resolved'].map(status => (
        <TouchableOpacity 
          key={status}
          style={[
            styles.filterButton, 
            filter === status ? styles.filterButtonActive : null
          ]}
          onPress={() => setFilter(status)}
        >
          <Text 
            style={[
              styles.filterText, 
              filter === status ? styles.filterTextActive : null
            ]}
          >
            {status}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric',
      month: 'short'
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.issueCard}
      onPress={() => navigation.navigate('IssueDetailScreen', { issue: item })}
    >
      <View style={styles.issueHeader}>
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <View style={[styles.statusContainer, { backgroundColor: item.statusColor }]}>
          <Ionicons name={getStatusIcon(item.status)} size={14} color="#FFF" />
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      
      <Text style={styles.issueTitle}>{item.title}</Text>
      <Text style={styles.issueDescription} numberOfLines={2}>{item.description}</Text>
      
      <View style={styles.issueFooter}>
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={14} color="#666" />
          <Text style={styles.locationText} numberOfLines={1}>{item.location}</Text>
        </View>
        <Text style={styles.dateText}>{formatDate(item.timestamp)}</Text>
      </View>
      
      <View style={styles.reporterContainer}>
        <View style={styles.reporterAvatarContainer}>
          <Text style={styles.reporterInitial}>{item.reportedBy.charAt(0)}</Text>
        </View>
        <Text style={styles.reporterText}>Reported by {item.reportedBy}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <View style={styles.container}>
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Track Issues</Text>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="search-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Filters */}
        {renderStatusFilter()}

        {/* Issues List */}
        {filteredIssues.length > 0 ? (
          <FlatList
            data={filteredIssues}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No issues found</Text>
            <Text style={styles.emptySubtext}>Issues you report will appear here</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: { 
    flex: 1, 
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerButton: {
    padding: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  filterButtonActive: {
    backgroundColor: '#1e88e5',
  },
  filterText: {
    fontSize: 12,
    color: '#666',
  },
  filterTextActive: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 16,
  },
  issueCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  issueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryContainer: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#FFF',
    marginLeft: 4,
    fontWeight: 'bold',
  },
  issueTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  issueDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  issueFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#999',
  },
  reporterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  reporterAvatarContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1e88e5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  reporterInitial: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  reporterText: {
    fontSize: 12,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
});