import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  ScrollView, 
  ActivityIndicator,
  Alert,
  Platform
} from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

export default function ReportIssueScreen() {
  const [location, setLocation] = useState(null);
  const [image, setImage] = useState(null);
  const [department, setDepartment] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [address, setAddress] = useState('');
  
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      // Request location permissions on component mount
      await getLocation();
      
      // Request camera permissions
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission denied', 'Camera access is needed to report issues with photos.');
        }
      }
    })();
  }, []);

  // Get current location and reverse geocode to address
  const getLocation = async () => {
    try {
      setError('');
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setError('Location permission is required to report an issue.');
        return;
      }
      
      let locationData = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest
      });
      
      setLocation(locationData.coords);
      
      // Reverse geocode to get readable address
      try {
        const geocode = await Location.reverseGeocodeAsync({
          latitude: locationData.coords.latitude,
          longitude: locationData.coords.longitude
        });
        
        if (geocode && geocode[0]) {
          const loc = geocode[0];
          const addressString = `${loc.street || ''}, ${loc.city || ''}, ${loc.region || ''}, ${loc.postalCode || ''}`;
          setAddress(addressString);
        }
      } catch (geoError) {
        console.error("Geocoding error:", geoError);
      }
    } catch (err) {
      console.error("Location error:", err);
      setError('Failed to get location. Please try again.');
    }
  };

  // Handle image capture
  const pickImage = async () => {
    try {
      setError('');
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets[0]) {
        setImage(result.assets[0].uri);
      }
    } catch (err) {
      console.error("Camera error:", err);
      setError('Failed to capture image. Please try again.');
    }
  };

  // Handle gallery image selection as a fallback
  const pickImageFromGallery = async () => {
    try {
      setError('');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets[0]) {
        setImage(result.assets[0].uri);
      }
    } catch (err) {
      console.error("Gallery error:", err);
      setError('Failed to select image. Please try again.');
    }
  };

  // Submit the issue report
  const submitIssue = async () => {
    if (!location || !image || !department || !description) {
      setError('All fields are required to submit a report.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      
      // In a real app, this would be a call to your backend using fetch
      // Example with fetch (commented out)
      /*
      const formData = new FormData();
      formData.append('latitude', location.latitude);
      formData.append('longitude', location.longitude);
      formData.append('address', address);
      formData.append('department', department);
      formData.append('description', description);
      
      // Append image
      const imageFileName = image.split('/').pop();
      const imageType = 'image/' + (imageFileName.split('.').pop() === 'png' ? 'png' : 'jpeg');
      
      formData.append('image', {
        uri: image,
        name: imageFileName,
        type: imageType
      });
      
      const response = await fetch('https://your-backend-url.com/api/issues', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const responseData = await response.json();
      */
      
      // For now, just log the data that would be sent
      console.log({
        latitude: location.latitude,
        longitude: location.longitude,
        address,
        department,
        description,
        imageUri: image
      });
      
      // Mock successful submission for demo purposes
      setTimeout(() => {
        setIsSubmitting(false);
        
        // Reset form after submission
        setImage(null);
        setDepartment('');
        setDescription('');
        
        // Show success message
        Alert.alert(
          'Report Submitted',
          'Your issue has been reported successfully. The civic authorities will look into it soon.',
          [
            {
              text: 'View My Reports',
              onPress: () => {
                if (navigation.navigate) {
                  navigation.navigate('My Reports');
                } else {
                  console.log('Navigation to My Reports');
                }
              },
            },
            {
              text: 'OK',
              style: 'cancel'
            },
          ]
        );
      }, 1500);
      
    } catch (err) {
      console.error("Submission error:", err);
      setIsSubmitting(false);
      setError('Failed to submit your report. Please try again later.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Report an Issue</Text>
      
      {/* Location Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location</Text>
        <View style={styles.locationContainer}>
          {location ? (
            <>
              <Text style={styles.locationText}>
                {address || `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`}
              </Text>
              <TouchableOpacity style={styles.refreshButton} onPress={getLocation}>
                <Text style={styles.refreshButtonText}>Refresh</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#1e88e5" />
              <Text style={styles.loadingText}>Fetching your location...</Text>
            </View>
          )}
        </View>
      </View>
      
      {/* Image Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add Photo Evidence</Text>
        {image ? (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: image }} style={styles.image} />
            <TouchableOpacity style={styles.retakeButton} onPress={pickImage}>
              <Text style={styles.buttonText}>Retake Photo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.imageButtonsContainer}>
            <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
              <Text style={styles.buttonText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.galleryButton} onPress={pickImageFromGallery}>
              <Text style={styles.buttonText}>Choose from Gallery</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      {/* Department Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Department</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={department}
            onValueChange={(itemValue) => setDepartment(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Department" value="" />
            <Picker.Item label="Road Maintenance" value="road" />
            <Picker.Item label="Garbage Collection" value="garbage" />
            <Picker.Item label="Water Supply" value="water" />
            <Picker.Item label="Sewage & Drainage" value="sewage" />
            <Picker.Item label="Street Lighting" value="lighting" />
            <Picker.Item label="Parks & Gardens" value="parks" />
            <Picker.Item label="Public Transport" value="transport" />
            <Picker.Item label="Building & Construction" value="construction" />
            <Picker.Item label="Public Health & Sanitation" value="health" />
          </Picker>
        </View>
      </View>
      
      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Describe the Issue</Text>
        <TextInput
          style={styles.input}
          placeholder="Provide details about the issue..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>
      
      {/* Error Message */}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      
      {/* Submit Button */}
      <TouchableOpacity
        style={[
          styles.submitButton,
          (!location || !image || !department || !description || isSubmitting) && styles.submitButtonDisabled
        ]}
        onPress={submitIssue}
        disabled={!location || !image || !department || !description || isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.submitButtonText}>Submit Report</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1e88e5',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  refreshButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#e3f2fd',
    borderRadius: 4,
  },
  refreshButtonText: {
    color: '#1e88e5',
    fontSize: 12,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    marginLeft: 10,
    color: '#666',
  },
  imagePreviewContainer: {
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  retakeButton: {
    backgroundColor: '#e3f2fd',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  imageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cameraButton: {
    flex: 1,
    backgroundColor: '#1e88e5',
    paddingVertical: 10,
    borderRadius: 4,
    marginRight: 8,
    alignItems: 'center',
  },
  galleryButton: {
    flex: 1,
    backgroundColor: '#90caf9',
    paddingVertical: 10,
    borderRadius: 4,
    marginLeft: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 4,
    minHeight: 100,
    backgroundColor: '#fff',
  },
  error: {
    color: '#d32f2f',
    marginBottom: 16,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#1e88e5',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  submitButtonDisabled: {
    backgroundColor: '#90caf9',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});