import React, { Component } from 'react';
import{Card,Header,Icon} from 'react-native-elements';
import firebase from 'firebase';

import db from '../config.js';
import {
  View,
  Text,
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert} from 'react-native';

  export default class ReceiverDetailsScreen extends Component{
constructor(props){
    super(props);
    this.state={
      userId          : firebase.auth().currentUser.email,
      recieverId      : this.props.navigation.getParam('details')["user_id"],
      requestId       : this.props.navigation.getParam('details')["request_id"],
      bookName        : this.props.navigation.getParam('details')["book_name"],
      reason_for_requesting     : this.props.navigation.getParam('details')["reason_to_request"],
      recieverName    : '',
      recieverContact : '',
      recieverAddress : '',
      recieverRequestDocId : ''
    }
  }

  getRecieverDetails(){
	db.collection('users').where('email_id','==',this.state.recieverId).get()
	.then(snapshot=>{
	  snapshot.forEach(doc=>{
		this.setState({
		  recieverName    : doc.data().first_name,
		  recieverContact : doc.data().contact,
		  recieverAddress : doc.data().address,
		})
	  })
	});
  
	db.collection('requested_books').where('request_id','==',this.state.requestId).get()
	.then(snapshot=>{
	  snapshot.forEach(doc => {
		this.setState({recieverRequestDocId:doc.id})
	 })
  })}

  componentDidMount(){
	this.getUserDetails(this.state.userId)
	this.getRecieverDetails()
  }
  updateBookStatus=()=>{
	db.collection('all_donations').add({
	  book_name           : this.state.bookName,
	  request_id          : this.state.requestId,
	  requested_by        : this.state.recieverName,
	  donor_id            : this.state.userId,
	  request_status      :  "Donor Interested"
	})
  }
  getUserDetails=(userId)=>{
    db.collection("users").where('email_id','==', userId).get()
    .then((snapshot)=>{
      snapshot.forEach((doc) => {
        this.setState({
          userName  :doc.data().first_name + " " + doc.data().last_name
        })
      })
    })
  }
  addNotification=()=>{
    var message = this.state.userName + " has shown interest in donating the book"
    db.collection("all_notifications").add({
      "targeted_user_id"    : this.state.recieverId,
      "donor_id"            : this.state.userId,
      "request_id"          : this.state.requestId,
      "book_name"           : this.state.bookName,
      "date"                : firebase.firestore.FieldValue.serverTimestamp(),
      "notification_status" : "unread",
      "message"             : message
    })
  }
	  render(){
		  return(
			  <View>
			              <Card
              title={"Book Information"}
              titleStyle= {{fontSize : 20}}
            >
            <Card >
              <Text style={{fontWeight:'bold'}}>Name : {this.state.bookName}</Text>
            </Card>
            <Card>
              <Text style={{fontWeight:'bold'}}>Reason : {this.state.reason_for_requesting}</Text>
            </Card>
          </Card>    
		  <Card
            title={"Reciever Information"}
            titleStyle= {{fontSize : 20}}
            >
            <Card>
              <Text style={{fontWeight:'bold'}}>Name: {this.state.recieverName}</Text>
            </Card>
            <Card>
              <Text style={{fontWeight:'bold'}}>Contact: {this.state.recieverContact}</Text>
            </Card>
            <Card>
              <Text style={{fontWeight:'bold'}}>Address: {this.state.recieverAddress}</Text>
            </Card>
          </Card>
		  <TouchableOpacity
                  
                  onPress={()=>{
                    this.updateBookStatus()
					this.addNotification()
                    this.props.navigation.navigate('MyDonations')
                  }}>
                <Text>I want to Donate</Text>
              </TouchableOpacity>
			  </View>
			 
		  )
	  }
  }