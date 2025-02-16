import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function IssueDetailsScreen({ route, navigation }) {
  const { issue } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{issue.title}</Text>
      <Text style={styles.description}>{issue.description}</Text>
      <Text style={styles.status}>Status: {issue.status}</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  description: { fontSize: 16, marginBottom: 10 },
  status: { fontSize: 14, fontWeight: 'bold', color: 'gray', marginBottom: 10 },
  button: { backgroundColor: 'blue', padding: 10, alignItems: 'center', borderRadius: 5 },
  buttonText: { color: 'white', fontSize: 16 },
});
