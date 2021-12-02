import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { StyleSheet, ToastAndroid, View } from "react-native";
import { Button, Input } from "react-native-elements";

const Login = ({ setToken }) => {
  const [studentID, setStudentID] = useState("");
  const [name, setName] = useState("");

  const handleOnSubmit = () => {
    if (studentID == "") {
      ToastAndroid.showWithGravity(
        "StudentID is empty",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
      return;
    }

    if (name == "") {
      ToastAndroid.showWithGravity(
        "Name is empty",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
      return;
    }

    fetch("https://qr-server-191.herokuapp.com/getToken", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentID,
        name,
      }),
    })
      .then((res) => res.json())
      .then(async (result) => {
        if (result.success) {
          try {
            await AsyncStorage.setItem("token", result.data.token);
            setToken(result.data.token);
          } catch (error) {
            console.log(error);
          }
        } else {
          ToastAndroid.showWithGravity(
            result.message,
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
          );
        }
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Input
          value={studentID}
          onChangeText={setStudentID}
          placeholder={"Student ID"}
        />
        <Input value={name} onChangeText={setName} placeholder={"Name"} />
        <Button title="Login" onPress={handleOnSubmit}></Button>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  box: {
    width: "80%",
  },
  container: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
