import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../constants/colors";
import { useStore } from "../store/StoreProvider";
const { NAVY } = Colors;

const LoginScreen = observer(() => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const insets = useSafeAreaInsets();
  const { authStore, settingsStore } = useStore();
  const { biometricsEnabled, toggleBiometrics } = settingsStore;
  const {
    isLoading,
    isBiometricAvailable,
    biometricType,
    login,
    biometricLogin,
    checkBiometricSupport,
  } = authStore;

  const biometricLoginIcon =
    biometricType === "Face ID" ? "face-recognition" : "fingerprint";
  const biometricIconColor = isLoading ? "grey" : "black";

  useEffect(() => {
    const checkBiometrics = async () => {
      await checkBiometricSupport();
    };

    checkBiometrics();
  }, []);

  useEffect(() => {
    const autoBiometricLogin = async () => {
      if (isBiometricAvailable) {
        await handleBiometricLogin();
      }
    };

    autoBiometricLogin();
  }, [isBiometricAvailable]);

  // Handle biometric login
  const handleBiometricLogin = async () => {
    try {
      await biometricLogin();
    } catch (error) {
      console.error("Biometric error:", error);
      Alert.alert("Error", "Biometric authentication failed");
    }
  };

  const handleLogin = async () => {
    Keyboard.dismiss();
    if (!username || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    // if (!username.includes("_")) {
    //   Alert.alert("Error", "Please fill a valid username");
    //   return;
    // }

    await login(username, password)
      .then(() => {
        if (!biometricsEnabled) {
          Alert.alert(
            "Login Successful",
            "Do you want to enable biometric login?",
            [
              {
                text: "No",
                onPress: () => console.log("Biometric login not enabled"),
                style: "cancel",
              },
              {
                text: "Yes",
                onPress: async () => {
                  try {
                    await toggleBiometrics();
                  } catch (error) {
                    console.error("Enable biometrics error:", error);
                    Alert.alert("Error", "Failed to enable biometric login");
                  }
                },
              },
            ],
          );
        }
      })
      .catch((err) => {
        let errorMessage;
        switch (err?.status) {
          case 400:
            errorMessage = "Invalid username or password. Please try again";
            break;
          case 500:
            errorMessage = "Server error. Please try again later";
            break;
          default:
            errorMessage = "An Unknown error occurred. Please try again later";
            break;
        }
        Alert.alert("Error", errorMessage);
      });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heading}>
            <View style={styles.logoContainer}>
              <Image
                source={require("../../assets/images/teddy.png")}
                style={styles.logo}
              />
            </View>
            <Text style={styles.title}>
              {isBiometricAvailable ? "Welcome Back" : "CourseCritique"}
            </Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#999"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoComplete="username"
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <AntDesign
                  name={showPassword ? "eye-invisible" : "eye"}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.loginButton,
                  (isLoading || !username || !password) &&
                    styles.loginButtonDisabled,
                ]}
                onPress={handleLogin}
                disabled={isLoading || !username || !password}
              >
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator color="#fff" size="small" />
                    <Text style={styles.loginButtonText}>Signing In...</Text>
                  </View>
                ) : (
                  <Text style={styles.loginButtonText}>Sign In</Text>
                )}
              </TouchableOpacity>
              {isBiometricAvailable && (
                <TouchableOpacity
                  onPress={handleBiometricLogin}
                  style={styles.biometricsButton}
                  disabled={isLoading}
                >
                  <MaterialCommunityIcons
                    name={biometricLoginIcon}
                    size={36}
                    color={biometricIconColor}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  heading: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e1e1e1",
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: "absolute",
    right: 15,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  eyeButtonText: {
    fontSize: 18,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 25,
  },
  forgotPasswordText: {
    color: NAVY,
    fontSize: 14,
    fontWeight: "500",
  },
  buttonContainer: {
    flexDirection: "row",
  },
  loginButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginButtonDisabled: {
    backgroundColor: "#ccc",
    shadowOpacity: 0,
    elevation: 0,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  biometricsButton: {
    paddingHorizontal: 16,
    padding: 0,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default LoginScreen;
