import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const issues = [
  { id: '1', title: 'Pothole on FC Road', status: 'Pending' },
  { id: '2', title: 'Garbage not collected', status: 'Resolved' },
];

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reported Issues</Text>
      <FlatList
        data={issues}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.issueCard}
            onPress={() => navigation.navigate('IssueDetails', { issue: item })}
          >
            <Text style={styles.issueTitle}>{item.title}</Text>
            <Text style={styles.issueStatus}>{item.status}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ReportIssue')}
      >
        <Text style={styles.buttonText}>Report an Issue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  issueCard: { padding: 15, backgroundColor: '#f0f0f0', marginBottom: 10, borderRadius: 5 },
  issueTitle: { fontSize: 16, fontWeight: 'bold' },
  issueStatus: { fontSize: 14, color: 'gray' },
  button: { backgroundColor: 'blue', padding: 15, alignItems: 'center', borderRadius: 5 },
  buttonText: { color: 'white', fontSize: 16 },
});
