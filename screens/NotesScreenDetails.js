import { FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ScrollView
  } from "react-native";
import { useDispatch } from "react-redux";
import { deletePostThunk, updatePostThunk } from "../features/notesSlice";

export default function NotesScreenDetails() {
  const route = useRoute();
  const titleInputRef = useRef();
  const navigation = useNavigation();
  const params = route.params;
  const [photoUri] = useState(params.photo);
  const [noteContact, setNoteContact] = useState(params.contact);
  const [noteType, setNoteType] = useState(params.type);
  const [noteName, setNoteName] = useState(params.name);
  const [noteBody, setNoteBody] = useState(params.review);
  const [noteStall, setNoteStall] = useState(params.stall);
  const [username, setNoteUsername] = useState(params.username);
  const [editable, setEditable] = useState(false);
  const dispatch = useDispatch();
  const id = params.id;

  async function updatePost(id) {
    try {
      const updatedPost = {
        id,
        name: noteName,
        type: noteType,
        stall: noteStall,
        contact: noteContact,
        review: noteBody,
        username: username,
      };
      await dispatch(updatePostThunk(updatedPost));
    } catch (error) {
      console.error("Failed to update the post: ", error);
    } finally {
      navigation.goBack();
    }
  }

  async function deletePost(id) {
    try {
      await dispatch(deletePostThunk(id));
    } catch (error) {
      console.error("Failed to update the post: ", error);
    } finally {
      navigation.goBack();
    }
  }


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name={"arrow-left"} size={24} color={"black"} />
        </TouchableOpacity>

        <View style={{ flex: 1 }} />

        <TouchableOpacity
          onPress={() => {
            setEditable(!editable);
            if (!editable) {
              setTimeout(() => titleInputRef.current.focus(), 100);
            } else {
              setTimeout(() => titleInputRef.current.blur(), 100);
            }
          }}
        >
          <FontAwesome
            name={"pencil"}
            size={24}
            color={editable ? "forestgreen" : "black"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => deletePost(id)}
          style={{ marginLeft: 15 }}
        >
          <FontAwesome name={"trash"} size={24} color={"black"} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView}>
      <Image source={{ uri: `${photoUri}`}} 
        style={{ height: 120, width: 120, borderRadius: 3, marginBottom: 10, marginLeft: 30, marginTop: 10 }}
      />

      <Text style={styles.noteLabel} >Food Name: </Text>
      <TextInput
        style={styles.noteBody}
        placeholder={"Food Name"}
        value={noteName}
        onChangeText={(text) => setNoteName(text)}
        selectionColor={"gray"}
        editable={editable}
        ref={titleInputRef}
      />
      <Text style={styles.noteLabel} >Type: </Text>
      <TextInput
        style={styles.noteBody}
        placeholder={"Food Type"}
        value={noteType}
        onChangeText={(text) => setNoteType(text)}
        selectionColor={"grey"}
        editable={editable}
        ref={titleInputRef}
      />
      <Text style={styles.noteLabel} >Food Stall: </Text>
      <TextInput
        style={styles.noteBody}
        placeholder={"Food Stall"}
        value={noteStall}
        onChangeText={(text) => setNoteStall(text)}
        selectionColor={"gray"}
        editable={editable}
        ref={titleInputRef}
      />
      <Text style={styles.noteLabel} >Contact: </Text>
      <TextInput
        style={styles.noteBody}
        placeholder={"Contact Number"}
        value={noteContact}
        onChangeText={(text) => setNoteContact(text)}
        selectionColor={"gray"}
        editable={editable}
        ref={titleInputRef}
      />
      <Text style={styles.noteLabel} >Thoughts: </Text>
      <TextInput
        style={styles.noteBody}
        placeholder={"Your Reviews"}
        value={noteBody}
        onChangeText={(text) => setNoteBody(text)}
        selectionColor={"gray"}
        editable={editable}
        multiline={true}
      />
      <Text style={styles.noteLabel} >Contributed by: </Text>
      <TextInput
        style={styles.noteBody}
        placeholder={"Contributor"}
        value={username}
        onChangeText={(text) => setNoteUsername(text)}
        editable={false}
        selectionColor={"gray"}
        ref={titleInputRef}
      />
      </ScrollView>
      <View style={{ flex: 1 }} />
      <TouchableOpacity
        style={styles.button}
        onPress={async () => updatePost(id)}
      >
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "aliceblue",
    paddingTop: 50,
    padding: 25,
  },
  noteName: {
    fontSize: 30,
    fontWeight: "800",
    marginTop: 15,
    marginBottom: 25,
    color: "black",
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
    marginBottom: 10,
    padding: 5,
    width: 300,
    borderWidth: 2,
  },
  button: {
    backgroundColor: "black",
    borderRadius: 15,
    width: "100%",
    marginBottom: 5,
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "400",
    fontSize: 17,
    padding: 20,
    color: "white",
  },
});
