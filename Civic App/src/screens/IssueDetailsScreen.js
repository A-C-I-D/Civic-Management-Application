import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function IssueDetailsScreen({ route, navigation }) {
  // Safely extract issue data or use empty object as fallback
  const issue = route?.params?.issue || {};
  
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(false);
  const [isIssueAvailable, setIsIssueAvailable] = useState(Boolean(route?.params?.issue));

  // Format the timestamp to a readable date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status color based on current status
  const getStatusColor = (status) => {
    if (!status) return '#1e88e5'; // default blue
    
    switch (status.toLowerCase()) {
      case 'pending':
        return '#e53935'; // red
      case 'in progress':
        return '#ff9800'; // orange
      case 'resolved':
        return '#43a047'; // green
      default:
        return '#1e88e5'; // blue
    }
  };

  useEffect(() => {
    // Simulate fetching comments from backend
    setIsLoading(true);
    setTimeout(() => {
      try {
        // Mock data - would be replaced with actual API call
        const mockComments = [
          {
            id: '1',
            user: 'John D.',
            text: 'Thanks for reporting this issue. Our team is looking into it.',
            timestamp: '2025-02-24T09:30:00',
            isOfficial: true
          },
          {
            id: '2',
            user: 'Sarah M.',
            text: 'I noticed this problem last week as well.',
            timestamp: '2025-02-24T14:15:00',
            isOfficial: false
          }
        ];
        setComments(mockComments);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching comments:', error);
        setLoadingError(true);
        setIsLoading(false);
      }
    }, 1000);
  }, []);

  const submitComment = () => {
    if (!comment.trim()) return;
    
    const newComment = {
      id: Date.now().toString(),
      user: 'You',
      text: comment,
      timestamp: new Date().toISOString(),
      isOfficial: false
    };
    
    setComments([...comments, newComment]);
    setComment('');
    // Backend logic for submitting comment would go here
  };

  const handleRetry = () => {
    navigation.goBack();
  };

  // If issue data is not available, show error view
  if (!isIssueAvailable) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Issue Details</Text>
          <View style={styles.shareButton} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={50} color="#e53935" />
          <Text style={styles.errorText}>Issue data not available</Text>
          <Text style={styles.errorSubtext}>The issue information could not be loaded</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Issue Details</Text>
        <TouchableOpacity 
          style={styles.shareButton}
          onPress={() => {/* Share functionality */}}
        >
          <Ionicons name="share-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container}>
        {/* Issue Status Banner */}
        <View style={[styles.statusBanner, { backgroundColor: getStatusColor(issue.status) }]}>
          <Ionicons name={
            issue.status?.toLowerCase() === 'resolved' ? 'checkmark-circle' :
            issue.status?.toLowerCase() === 'in progress' ? 'time' : 'alert-circle'
          } size={24} color="white" />
          <Text style={styles.statusText}>{issue.status || 'Unknown'}</Text>
        </View>

        {/* Issue Location & Timestamp */}
        <View style={styles.metadataContainer}>
          <View style={styles.metadataItem}>
            <Ionicons name="location-outline" size={20} color="#666" />
            <Text style={styles.metadataText}>
              {issue.location?.address || (issue.location ? `${issue.location.latitude}, ${issue.location.longitude}` : 'Location unknown')}
            </Text>
          </View>
          <View style={styles.metadataItem}>
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <Text style={styles.metadataText}>{formatDate(issue.timestamp)}</Text>
          </View>
          <View style={styles.metadataItem}>
            <Ionicons name="person-outline" size={20} color="#666" />
            <Text style={styles.metadataText}>{issue.reporter || 'Anonymous'}</Text>
          </View>
        </View>

        {/* Issue Category */}
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryLabel}>Category</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{issue.category || 'General'}</Text>
          </View>
        </View>

        {/* Issue Image */}
        {issue.image && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: issue.image }} style={styles.image} resizeMode="cover" />
            <TouchableOpacity style={styles.expandImageButton}>
              <Ionicons name="expand-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>
        )}

        {/* Issue Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{issue.description || 'No description provided.'}</Text>
        </View>

        {/* Progress Timeline */}
        <View style={styles.timelineContainer}>
          <Text style={styles.sectionTitle}>Progress Timeline</Text>
          <View style={styles.timeline}>
            <View style={[styles.timelinePoint, styles.timelinePointActive]}>
              <View style={styles.timelineDot}></View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Issue Reported</Text>
                <Text style={styles.timelineDate}>{formatDate(issue.timestamp)}</Text>
              </View>
            </View>
            <View style={[
              styles.timelinePoint, 
              issue.status === 'In Progress' || issue.status === 'Resolved' ? styles.timelinePointActive : {}
            ]}>
              <View style={styles.timelineDot}></View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>In Progress</Text>
                <Text style={styles.timelineDate}>{issue.inProgressDate ? formatDate(issue.inProgressDate) : 'Pending'}</Text>
              </View>
            </View>
            <View style={[
              styles.timelinePoint, 
              issue.status === 'Resolved' ? styles.timelinePointActive : {}
            ]}>
              <View style={styles.timelineDot}></View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Resolved</Text>
                <Text style={styles.timelineDate}>{issue.resolvedDate ? formatDate(issue.resolvedDate) : 'Pending'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Comments Section */}
        <View style={styles.commentsContainer}>
          <Text style={styles.sectionTitle}>Comments</Text>
          
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#1e88e5" />
              <Text style={styles.loadingText}>Loading comments...</Text>
            </View>
          ) : loadingError ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={24} color="#e53935" />
              <Text style={styles.errorText}>Failed to load comments</Text>
              <TouchableOpacity style={styles.retryButton}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : comments.length === 0 ? (
            <View style={styles.emptyCommentsContainer}>
              <Ionicons name="chatbubble-outline" size={40} color="#ccc" />
              <Text style={styles.emptyCommentsText}>No comments yet</Text>
              <Text style={styles.emptyCommentsSubtext}>Be the first to comment on this issue</Text>
            </View>
          ) : (
            comments.map((cmt) => (
              <View key={cmt.id} style={[
                styles.commentCard,
                cmt.isOfficial ? styles.officialComment : {}
              ]}>
                {cmt.isOfficial && (
                  <View style={styles.officialBadge}>
                    <Text style={styles.officialBadgeText}>Official</Text>
                  </View>
                )}
                <View style={styles.commentHeader}>
                  <Text style={styles.commentUser}>{cmt.user}</Text>
                  <Text style={styles.commentTime}>{formatDate(cmt.timestamp)}</Text>
                </View>
                <Text style={styles.commentText}>{cmt.text}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Comment Input Section */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a comment..."
          value={comment}
          onChangeText={setComment}
          multiline
        />
        <TouchableOpacity 
          style={[styles.submitButton, !comment.trim() ? styles.submitButtonDisabled : {}]} 
          onPress={submitComment}
          disabled={!comment.trim()}
        >
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  shareButton: {
    padding: 8,
  },
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5',
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#1e88e5',
    marginBottom: 16,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  metadataContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metadataText: {
    marginLeft: 8,
    color: '#333',
    fontSize: 14,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginRight: 8,
  },
  categoryBadge: {
    backgroundColor: '#1e88e5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  categoryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  imageContainer: {
    position: 'relative',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  image: { 
    width: '100%', 
    height: 200,
  },
  expandImageButton: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  descriptionContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  timelineContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  timeline: {
    marginLeft: 8,
  },
  timelinePoint: {
    flexDirection: 'row',
    marginBottom: 16,
    opacity: 0.5,
  },
  timelinePointActive: {
    opacity: 1,
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#1e88e5',
    marginRight: 12,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  timelineDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  commentsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 90, // Extra space for input container
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorText: {
    marginTop: 12,
    fontWeight: 'bold',
    fontSize: 18,
    color: '#e53935',
  },
  errorSubtext: {
    marginTop: 8,
    marginBottom: 24,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#1e88e5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyCommentsContainer: {
    alignItems: 'center',
    padding: 24,
  },
  emptyCommentsText: {
    marginTop: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  emptyCommentsSubtext: {
    marginTop: 4,
    color: '#999',
    textAlign: 'center',
  },
  commentCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    position: 'relative',
  },
  officialComment: {
    backgroundColor: '#e3f2fd',
    borderLeftWidth: 3,
    borderLeftColor: '#1e88e5',
  },
  officialBadge: {
    position: 'absolute',
    right: 12,
    top: 12,
    backgroundColor: '#1e88e5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  officialBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  commentUser: {
    fontWeight: 'bold',
    color: '#333',
  },
  commentTime: {
    fontSize: 12,
    color: '#999',
  },
  commentText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 80,
  },
  submitButton: {
    backgroundColor: '#1e88e5',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  submitButtonDisabled: {
    backgroundColor: '#9e9e9e',
  },
});