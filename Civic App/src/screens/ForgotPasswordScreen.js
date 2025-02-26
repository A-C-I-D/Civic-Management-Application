import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback,
  Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';

export default function ForgotPasswordScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [resetSent, setResetSent] = useState(false);

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required");
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleResetPassword = async () => {
    // Clear any previous validation errors
    setEmailError("");
    
    // Validate inputs
    const isEmailValid = validateEmail(email);
    
    if (!isEmailValid) {
      return;
    }

    setIsLoading(true);

    try {
      // Mock API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would send a reset email through an API
      setResetSent(true);
    } catch (error) {
      console.error("Reset password error:", error);
      Alert.alert(
        "Connection Error", 
        "Unable to send reset email. Please check your internet connection and try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Return to login
  const handleBackToLogin = () => {
    navigation.navigate("LoginScreen");
  };

  // Resend password reset
  const handleResendReset = () => {
    setResetSent(false);
    setEmail("");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          {/* Header with back button */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBackToLogin} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.logoContainer}>
            <Image 
              source={{ uri: 'https://placehold.co/200x200/1e88e5/ffffff?text=CC' }} 
              style={styles.logo} 
            />
            <Text style={styles.appName}>Civic Connect</Text>
          </View>

          {!resetSent ? (
            // Password Reset Request Form
            <View style={styles.formContainer}>
              <Text style={styles.title}>Forgot Password</Text>
              <Text style={styles.description}>
                Enter your email address and we'll send you instructions to reset your password.
              </Text>
              
              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (emailError) validateEmail(text);
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onBlur={() => validateEmail(email)}
                />
              </View>
              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
              
              {/* Reset Password Button */}
              <TouchableOpacity 
                style={[
                  styles.resetButton,
                  !email && styles.resetButtonDisabled,
                  isLoading && styles.resetButtonLoading
                ]}
                onPress={handleResetPassword}
                disabled={isLoading || !email}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.resetButtonText}>Send Reset Link</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            // Success Message
            <View style={styles.formContainer}>
              <View style={styles.successIconContainer}>
                <Ionicons name="mail-outline" size={60} color="#1e88e5" />
              </View>
              <Text style={styles.title}>Check Your Email</Text>
              <Text style={styles.description}>
                If an account exists for {email}, you'll receive a password reset link shortly.
              </Text>
              
              <TouchableOpacity 
                style={styles.resetButton}
                onPress={handleBackToLogin}
              >
                <Text style={styles.resetButtonText}>Back to Login</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.resendContainer}
                onPress={handleResendReset}
              >
                <Text style={styles.resendText}>Didn't receive the email? </Text>
                <Text style={styles.resendLink}>Try again</Text>
              </TouchableOpacity>
            </View>
          )}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
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
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 70,
    height: 70,
    borderRadius: 18,
  },
  appName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1e88e5",
    marginTop: 10,
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 8,
    paddingHorizontal: 12,
    height: 50,
    backgroundColor: "#f9f9f9",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: "#333",
    fontSize: 16,
  },
  errorText: {
    color: "#e53935",
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 4,
  },
  resetButton: {
    backgroundColor: "#1e88e5",
    borderRadius: 8,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  resetButtonDisabled: {
    backgroundColor: "#90caf9",
  },
  resetButtonLoading: {
    backgroundColor: "#64b5f6",
  },
  resetButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  successIconContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  resendText: {
    color: "#666",
    fontSize: 14,
  },
  resendLink: {
    color: "#1e88e5",
    fontSize: 14,
    fontWeight: "bold",
  },
});