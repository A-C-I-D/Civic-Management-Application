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
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignUpScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Validate name
  const validateName = (name) => {
    if (!name.trim()) {
      setNameError("Full name is required");
      return false;
    } else if (name.trim().length < 2) {
      setNameError("Name must be at least 2 characters");
      return false;
    }
    setNameError("");
    return true;
  };

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

  // Validate password
  const validatePassword = (password) => {
    if (!password) {
      setPasswordError("Password is required");
      return false;
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    } else if (!/[A-Z]/.test(password)) {
      setPasswordError("Password must contain at least one uppercase letter");
      return false;
    } else if (!/[0-9]/.test(password)) {
      setPasswordError("Password must contain at least one number");
      return false;
    }
    setPasswordError("");
    return true;
  };

  // Validate confirm password
  const validateConfirmPassword = (confirmPass) => {
    if (!confirmPass) {
      setConfirmPasswordError("Please confirm your password");
      return false;
    } else if (confirmPass !== password) {
      setConfirmPasswordError("Passwords do not match");
      return false;
    }
    setConfirmPasswordError("");
    return true;
  };

  const handleSignUp = async () => {
    // Clear any previous validation errors
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    
    // Validate inputs
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);
    
    if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    if (!acceptTerms) {
      Alert.alert(
        "Terms & Conditions", 
        "Please accept the Terms & Conditions to continue",
        [{ text: "OK" }]
      );
      return;
    }

    setIsLoading(true);

    try {
      // Mock API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock registration - In a real app, this would be an API call
      // Store user info (in a real app, only store auth token)
      await AsyncStorage.setItem("userToken", "dummy-auth-token");
      
      // Navigate to home screen
      Alert.alert(
        "Success", 
        "Your account has been created successfully!",
        [{ 
          text: "Continue", 
          onPress: () => navigation.replace("HomeScreen")
        }]
      );
    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert(
        "Registration Failed", 
        "There was a problem creating your account. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Social signup handlers
  const handleSocialSignUp = (provider) => {
    setIsLoading(true);
    
    // In a real app, this would integrate with OAuth providers
    setTimeout(() => {
      setIsLoading(false);
      
      Alert.alert(
        "Social Sign Up", 
        `${provider} sign up is not implemented in this demo version.`,
        [{ text: "OK" }]
      );
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <View style={styles.logoContainer}>
            <Image 
              source={{ uri: 'https://placehold.co/200x200/1e88e5/ffffff?text=CC' }} 
              style={styles.logo} 
            />
            <Text style={styles.appName}>Civic Connect</Text>
            <Text style={styles.tagline}>Join your community today</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Create Account</Text>
            
            {/* Name Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (nameError) validateName(text);
                }}
                autoCapitalize="words"
                onBlur={() => validateName(name)}
              />
            </View>
            {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
            
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
            
            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError) validatePassword(text);
                  if (confirmPassword && confirmPasswordError) validateConfirmPassword(confirmPassword);
                }}
                secureTextEntry={!showPassword}
                onBlur={() => validatePassword(password)}
              />
              <TouchableOpacity 
                style={styles.eyeIcon} 
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            
            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (confirmPasswordError) validateConfirmPassword(text);
                }}
                secureTextEntry={!showConfirmPassword}
                onBlur={() => validateConfirmPassword(confirmPassword)}
              />
              <TouchableOpacity 
                style={styles.eyeIcon} 
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons 
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>
            {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
            
            {/* Terms and Conditions */}
            <TouchableOpacity 
              style={styles.termsContainer} 
              onPress={() => setAcceptTerms(!acceptTerms)}
            >
              <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
                {acceptTerms && <Ionicons name="checkmark" size={12} color="white" />}
              </View>
              <Text style={styles.termsText}>
                I accept the{" "}
                <Text style={styles.termsLink}>Terms & Conditions</Text>
                {" "}and{" "}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </TouchableOpacity>
            
            {/* Sign Up Button */}
            <TouchableOpacity 
              style={[
                styles.signUpButton,
                (!name || !email || !password || !confirmPassword) && styles.signUpButtonDisabled,
                isLoading && styles.signUpButtonLoading
              ]}
              onPress={handleSignUp}
              disabled={isLoading || !name || !email || !password || !confirmPassword}
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.signUpButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>
            
            {/* Social Sign Up Options */}
            <View style={styles.socialSection}>
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or sign up with</Text>
                <View style={styles.dividerLine} />
              </View>
              
              <View style={styles.socialButtonsRow}>
                <TouchableOpacity 
                  style={styles.socialButton} 
                  onPress={() => handleSocialSignUp("Google")}
                  disabled={isLoading}
                >
                  <Ionicons name="logo-google" size={20} color="#DB4437" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.socialButton} 
                  onPress={() => handleSocialSignUp("Apple")}
                  disabled={isLoading}
                >
                  <Ionicons name="logo-apple" size={20} color="#000000" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.socialButton} 
                  onPress={() => handleSocialSignUp("Facebook")}
                  disabled={isLoading}
                >
                  <Ionicons name="logo-facebook" size={20} color="#4267B2" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
              <Text style={styles.loginLink}>Log In</Text>
            </TouchableOpacity>
          </View>
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
  logoContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 24,
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
  tagline: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
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
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
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
  eyeIcon: {
    padding: 10,
  },
  errorText: {
    color: "#e53935",
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 4,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 4,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#1e88e5",
    borderColor: "#1e88e5",
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: "#666",
  },
  termsLink: {
    color: "#1e88e5",
    fontWeight: "bold",
  },
  signUpButton: {
    backgroundColor: "#1e88e5",
    borderRadius: 8,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  signUpButtonDisabled: {
    backgroundColor: "#90caf9",
  },
  signUpButtonLoading: {
    backgroundColor: "#64b5f6",
  },
  signUpButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  socialSection: {
    marginTop: 10,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
  },
  dividerText: {
    color: "#999",
    paddingHorizontal: 10,
    fontSize: 14,
  },
  socialButtonsRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    backgroundColor: "white",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  loginText: {
    color: "#666",
    fontSize: 14,
  },
  loginLink: {
    color: "#1e88e5",
    fontSize: 14,
    fontWeight: "bold",
  },
});