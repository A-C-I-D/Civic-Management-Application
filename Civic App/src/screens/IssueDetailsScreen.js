import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TextInput, Button, ScrollView } from 'react-native';

export default function IssueDetailsScreen({ route }) {
  const { issue } = route.params;
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    // Fetch existing comments from backend - To be implemented by Prachi & Chaitanya
  }, []);

  const submitComment = () => {
    if (!comment.trim()) return;
    setComments([...comments, comment]);
    setComment('');
    // Backend logic for submitting comment - To be implemented by Prachi & Chaitanya
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Issue Details</Text>
      <Text style={styles.label}>Status: {issue.status}</Text>
      <Text style={styles.label}>Location: {issue.location.latitude}, {issue.location.longitude}</Text>
      <Text style={styles.label}>Submitted On: {issue.timestamp}</Text>
      <Image source={{ uri: issue.image }} style={styles.image} />
      <Text style={styles.label}>Description:</Text>
      <Text style={styles.description}>{issue.description}</Text>
      <Text style={styles.label}>Comments:</Text>
      {comments.map((cmt, index) => (
        <Text key={index} style={styles.comment}>{cmt}</Text>
      ))}
      <TextInput
        style={styles.input}
        placeholder="Add a comment..."
        value={comment}
        onChangeText={setComment}
      />
      <Button title="Submit Comment" onPress={submitComment} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  description: { fontSize: 14, marginBottom: 10 },
  image: { width: '100%', height: 200, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
  comment: { fontSize: 14, padding: 5, backgroundColor: '#f0f0f0', marginVertical: 2, borderRadius: 5 }
});