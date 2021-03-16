// export function displayQuizList(){

// }



/**
 * This is the Newsfeed Screen. Available when user is logged in.
 */
 import React, { useState } from "react";
//  import { Button, View } from "react-native";
 import { firebase } from "../Config";
//  import PostFeed from "../../components/container/PostFeed";
 
 /**
  *
  * This screen shows the posts of all users.
  * @param {any} props
  */
 export default function Quizzes(props) {
   const [array, setArray] = useState([]);
   const [calledFunction, setCalledFunction] = useState(false);
   const [profilePicURL, setProfilePicURL] = useState("");
 
   /**
    * Returns an array of all the posts in the correct order.
    * @param snapshot All the posts
    */
   function databaseArray(snapshot) {
     let returnArr = [];
     let keyArr = [];
 
     snapshot.forEach((childSnapshot) => {
       var num = 0;
       childSnapshot.forEach((element) => {
         var key = Object.keys(childSnapshot.val())[num];
 
         if (!keyArr.includes(key)) {
           keyArr.push(key);
           var name_val = element.val().username;
           var captionVal = element.val().caption;
           var imgLocation = element.val().imgLocation;
           var time = element.val().time;
           var date = element.val().date;
           var sortDate = element.val().sortDate;
           var likes = element.val().likes;
           var imgRef = firebase.storage.ref().child("ProfilePictures/" + name_val);
 
           imgRef.getDownloadURL().then(function (url) {
             if (profilePicURL != url) {
               setProfilePicURL(url);
             }
           });
 
           var profilePic = profilePicURL;
 
           returnArr.push({
             key: key,
             name: name_val,
             caption: captionVal,
             imgLocation: imgLocation,
             date: date,
             time: time,
             sortDate: sortDate,
             likes: likes,
             profilePic: profilePicURL,
           });
           num = num + 1;
         }
       });
     });
     returnArr.sort((a, b) => a.sortDate.localeCompare(b.sortDate));
 
     returnArr.reverse();
 
     return returnArr;
   }
 
   /**
    * Retrieve user's posts from Firebase
    */
 
   function getUserPosts() {
     firebase
       .database()
       .ref("posts")
       .once("value")
       .then(function (snapshot) {
         setArray(databaseArray(snapshot));
       });
   }
 
   /**
    * Checks if getUserPosts() has been called once already or not
    * If it hasn't, it calls getUserPosts()
    */
   if (!calledFunction) {
     getUserPosts();
     setCalledFunction(true);
   }
 
   return (
    <div>
    <h1>Welcome to Quizzes</h1>
</div>
    //  <View>
    //    <Button onPress={() => getUserPosts()} title="Refresh" color="#75DDDD" />
    //    <PostFeed props={array} />
    //  </View>
   );
 }
 