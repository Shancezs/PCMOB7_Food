import React, { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Animated, { SlideInLeft, SlideOutRight } from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";
import { API_STATUS, NOTES_SCREEN } from "../constants";
import { fetchPosts } from "../features/notesSlice";

export default function NotesScreenHome() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.notes.posts);
  const notesStatus = useSelector((state) => state.notes.status);
  const isLoading = notesStatus === API_STATUS.pending;


  useEffect(() => {
    if (notesStatus === API_STATUS.idle) {
      dispatch(fetchPosts());
    }
  }, [notesStatus, dispatch]);

  function renderItem({ item }) {
    return (
      <Animated.View
      entering={SlideInLeft.delay(item.index * 100)}
      exiting={SlideOutRight.delay(300)}
    >
      <TouchableOpacity
        style={styles.noteCard}
        onPress={() => navigation.navigate(NOTES_SCREEN.Details, item)}
      >
        <Image source={{ uri: `${item.photo}`}} style={styles.noteCardPhoto} />
        <Text style={styles.noteCardBodyText}>Food: {item.name}</Text>
        <Text style={styles.noteCardBodyText}>Type: {item.type}</Text>
        <Text style={styles.noteCardBodyText}>Stall Name: {item.stall}</Text>
        <Text style={styles.noteCardBodyText}>Contact No: {item.contact}</Text>
        
        <Text style={styles.noteCardNext}>read more</Text>
      </TouchableOpacity>
    </Animated.View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.Page}> Food Directory</Text>

      {isLoading && <ActivityIndicator />}

      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(post) => post.id.toString()}
      />

      <View style={{ flex: 1 }} />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate(NOTES_SCREEN.Add)}
      >
        <Text style={styles.buttonText}>New Contribution</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  noteCard: {
    borderColor: "gray",
    borderWidth: 1,
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
    Height: 50,
    marginLeft: 10,
  },
  noteCardPhoto: {
    width: 50,
    height: 50,
    position: "absolute",
    top: 25,
    left: 10,
  },
  noteCardBodyText: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 4,
    marginLeft: 5,
    left: 50,
  },
  noteCardNext: {
    fontSize: 12,
    fontWeight: "500",
    color: "blue",
    textAlign: "right",
  },
  container: {
    flex: 1,
    backgroundColor: "aliceblue",
    paddingTop: 50,
    padding: 25,
  },
  Page: {
    fontWeight: "bold",
    fontSize: 40,
    marginBottom: 20,
    color: "darkblue",
  },
  button: {
    backgroundColor: "black",
    borderRadius: 15,
    width: "100%",
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "400",
    fontSize: 17,
    padding: 20,
    color: "white",
  },
});