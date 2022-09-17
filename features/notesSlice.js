import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, getDocs, deleteDoc, setDoc, updateDoc, doc } from "firebase/firestore"; 
import { API_STATUS } from "../constants";
import { db } from "../firebase";

const initialState = {
  posts: [],
  status: API_STATUS.idle,
  error: null,
};

export const fetchPosts = createAsyncThunk("food/fetchPosts", async () => {
  const querySnapshot = await getDocs(collection(db, "food"));
  const notes = querySnapshot.docs.map((doc, index) => {
    return { id: doc.id, ...doc.data(), index };
  });
  return notes;
});

export const addNewPost = createAsyncThunk(
  "food/addNewPost",
  async (newPost) => {
    await setDoc(doc(db, "food", newPost.id), newPost);
    return newPost;
  }
);

export const updatePostThunk = createAsyncThunk(
  "posts/updatePost",
  async (updatedPost) => {
    await updateDoc(doc(db, "food", updatedPost.id), updatedPost);
    return updatedPost;
  }
);

export const deletePostThunk = createAsyncThunk(
  "posts/deletePost",
  async (id) => {
    await deleteDoc(doc(db, "food", id));
    return id;
  }
);

const notesSlice = createSlice({
  name: "food",
  initialState,
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = API_STATUS.pending;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = API_STATUS.fulfilled;
        // Add any fetched posts to the array
        state.posts = state.posts.concat(action.payload);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = API_STATUS.rejected;
        state.error = action.error.message;
        console.log("Failed to fetch posts. Error:", action.error.message);
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        state.posts.push(action.payload);
      })
      .addCase(updatePostThunk.fulfilled, (state, action) => {
        const { id, name, type, stall, contact, photo, review, username } = action.payload;
        const existingPost = state.posts.find((post) => post.id === id);
        if (existingPost) {
          existingPost.type = type;
          existingPost.name = name;
          existingPost.contact = contact;
          existingPost.stall = stall;
          existingPost.username = username;
          existingPost.photo = photo;
          existingPost.review = review;
        }
      })
      .addCase(deletePostThunk.fulfilled, (state, action) => {
        const id = action.payload;
        const updatedPosts = state.posts.filter((item) => item.id !== id);
        state.posts = updatedPosts;
      });
  },
});

export default notesSlice.reducer;