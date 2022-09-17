import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  LayoutAnimation,
  Platform,
  UIManager,
  Image,
} from "react-native";
import { API, API_LOGIN, API_SIGNUP, HOME_STACK } from "../constants";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function AuthScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoginScreen, setIsLoginScreen] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    return () => setLoading(false);
  }, []);

  function resetTextInputs() {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
  }

  async function signUp() {
    setLoading(true);
    if (password != confirmPassword) {
      setErrorText("Your password dont match.");
    } else {
      try {
        const response = await axios.post(API + API_SIGNUP, {
          username,
          password,
        });
        if (response.data.Error) {
          setLoading(false);
          setErrorText(response.data.Error);
        } else {
          login();
        }
      } catch (error) {
        setLoading(false);
        console.log(error.response);
        setErrorText(error.response.data.description);
      } finally {
        setLoading(false);
        LayoutAnimation.spring();
      }
    }
  }

  async function login() {
    setLoading(true);
    Keyboard.dismiss();
    try {
      const response = await axios.post(API + API_LOGIN, {
        username,
        password,
      });
      await AsyncStorage.setItem("token", response.data.access_token);
      await AsyncStorage.setItem("username", username);
      resetTextInputs();
      navigation.navigate(HOME_STACK);
    } catch (error) {
      console.log(error.response);
      setErrorText(error.response.data.description);
    }
    setLoading(false);
    LayoutAnimation.spring();
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isLoginScreen ? "Food Circle" : "New Contributor"}
      </Text>

      <Image source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/pcmob4-todo-79c09.appspot.com/o/food.png?alt=media&token=539fd0a8-b71f-4d25-9624-9ad1c884cf72'}} 
      style={styles.noteCardPhoto}/>
      <TextInput
        style={styles.inputView}
        placeholder="Username"
        value={username}
        onChangeText={(username) => setUsername(username)}
      />

      <TextInput
        style={styles.inputView}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={(pw) => setPassword(pw)}
      />

      {!isLoginScreen && (
        <TextInput
          style={styles.inputView}
          placeholder="Password confirm"
          secureTextEntry={true}
          value={confirmPassword}
          onChangeText={(pw) => setConfirmPassword(pw)}
        />
      )}

      <TouchableOpacity
        style={loading ? styles.buttonLoading : styles.button}
        onPress={async () => {
          LayoutAnimation.spring();
          setErrorText("");
          isLoginScreen ? await login() : await signUp();
        }}
      >
        {loading ? (
          <ActivityIndicator style={styles.buttonText} />
        ) : (
          <Text style={styles.buttonText}>
            {isLoginScreen ? "Login" : "Register"}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          LayoutAnimation.easeInEaseOut();
          setIsLoginScreen(!isLoginScreen);
          setErrorText("");
        }}
      >
        <Text style={styles.switchText}>
          {isLoginScreen ? "No account? Sign up" : "Have account? Login here"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.errorText}>{errorText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  switchText: {
    fontSize: 20,
    marginTop: 20,
    color: "gray",
  },
  errorText: {
    marginTop: 20,
    fontSize: 15,
    color: "red",
  },
  container: {
    flex: 1,
    backgroundColor: "aliceblue",
    paddingTop: 50,
    padding: 25,
  },
  title: {
    fontWeight: "bold",
    fontSize: 40,
    color: "darkblue",
    textAlign: "center",
  },
  noteCardPhoto: {
    width: 250,
    height: 250,
    resizeMode: "contain",
    left: 35,
  },
  inputView: {
    backgroundColor: "#fff",
    borderRadius: 5,
    marginBottom: 20,
    padding: 10,
  },
  button: {
    backgroundColor: "black",
    borderRadius: 15,
    width: "100%",
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "400",
    fontSize: 15,
    padding: 15,
    color: "white",
  },
});
