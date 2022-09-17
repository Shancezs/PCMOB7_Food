import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { nanoid } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { addNewPost } from "../features/notesSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function NotesScreenAdd() {
  const navigation = useNavigation();
  const [noteBody, setNoteBody] = useState("");
  const [noteContact, setNoteContact] = useState("");
  const [noteType, setNoteType] = useState("");
  const [noteName, setNoteName] = useState("");
  const [noteStall, setNoteStall] = useState("");
  const dispatch = useDispatch();

  const canSave = [noteName, noteType, noteStall, noteContact, noteBody, "https://cdn-icons-png.flaticon.com/512/333/333344.png"].every(Boolean);

  async function savePost() {
    const username = await AsyncStorage.getItem("username");
    if (canSave) {
      try {
        const post = {
          id: nanoid(),
          review: noteBody,
          name: noteName,
          type: noteType,
          stall: noteStall,
          contact: noteContact,
          username: username,
          photo: "https://cdn-icons-png.flaticon.com/512/333/333344.png",
        };
        await dispatch(addNewPost(post));
      } catch (error) {
        console.error("Failed to save the post: ", error);
      } finally {
        navigation.goBack();
      }
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <FontAwesome name={"arrow-left"} size={24} color={"black"} />
      </TouchableOpacity>

      <Text style={styles.noteLabel} >Food: </Text>
      <TextInput
        style={styles.noteBody}
        placeholder={"Food Name"}
        value={noteName}
        onChangeText={(text) => setNoteName(text)}
        selectionColor={"gray"}
      />

<Text style={styles.noteLabel} >Type: </Text>
      <TextInput
        style={styles.noteBody}
        placeholder={"Food Type"}
        value={noteType}
        onChangeText={(text) => setNoteType(text)}
        selectionColor={"grey"}
      />

      <Text style={styles.noteLabel} >Stall Name: </Text>
      <TextInput
        style={styles.noteBody}
        placeholder={"Food Stall"}
        value={noteStall}
        onChangeText={(text) => setNoteStall(text)}
        selectionColor={"gray"}
      />
      <Text style={styles.noteLabel} >Contact Number: </Text>
      <TextInput
        style={styles.noteBody}
        placeholder={"Stall Contact Number"}
        value={noteContact}
        onChangeText={(text) => setNoteContact(text)}
        selectionColor={"gray"}
      />
      <Text style={styles.noteLabel} >Review: </Text>
      <TextInput
        style={styles.noteBody}
        placeholder={"Add your reviews"}
        value={noteBody}
        onChangeText={(text) => setNoteBody(text)}
        selectionColor={"gray"}
        multiline={true}
      />
      <View style={{ flex: 1 }} />
      <TouchableOpacity
        style={styles.button}
        onPress={async () => await savePost()}
      >
        <Text style={styles.buttonText}>Make my food contribution</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "aliceblue",
    paddingTop: 60,
    padding: 25,
  },
  noteTitle: {
    fontSize: 24,
    fontWeight: "600",
    marginTop: 30,
    marginBottom: 25,
  },
  noteLabel: {
    fontSize: 20,
    fontWeight: "500",
    left: 20,
  },
  noteBody: {
    fontSize: 18,
    fontWeight: "400",
    left: 20,
    backgroundColor: "#fff",
    borderRadius: 5,
    color: "grey",
    marginBottom: 10,
    padding: 5,
    width: 300,
    borderWidth: 2,
  },
  button: {
    backgroundColor: "black",
    borderRadius: 15,
    width: "100%",
    marginBottom: 20,
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "400",
    fontSize: 17,
    padding: 20,
    color: "white",
  },
});