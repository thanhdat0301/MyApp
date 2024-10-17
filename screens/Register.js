import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";

import { emailValidator } from "../helpers/emailValidator";
import { passwordValidator } from "../helpers/passwordValidator";
import { nameValidator } from "../helpers/nameValidator";
import Background from "../Components/Background";
import Logo from "../Components/Logo";
import Header from "../Components/Header";
import TextInput from "../Components/TextInput";
import Button from "../Components/Button";
const blank_avatar = "../assets/Blank-Avatar.webp";

import { addDoc, collection } from "firebase/firestore";
import db from "../firebase/firebase.config";
import Login from "./Login";

export default function Register({ navigation }) {
  const [name, setName] = useState({ value: "", error: "" });
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [username, setUsername] = useState({ value: "", error: "" });

  const onSignUpPressed = async () => {
    const nameError = nameValidator(name.value);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    const usernameError =
      username.value === "" ? "Tài khoản không được để trống" : "";
    if (emailError || passwordError || nameError || usernameError) {
      setName({ ...name, error: nameError });
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      setUsername({ ...username, error: usernameError });
      return;
    } else {
      const user = {
        name: name.value,
        email: email.value,
        password: password.value,
        username: username.value,
        avatar_link: blank_avatar,
      };
      await addDoc(collection(db, "users"), user)
        .then(() => {
          // navigation.navigate("Product List", { user });
          navigation.navigate("LoginScreen");
        })
        .catch((err) => {
          alert(err.message);
        });
    }
  };

  return (
    <View>
      <Header style={styles.textHeader}>Đăng kí thành viên</Header>
      <TextInput
        label="Tên hiển thị"
        returnKeyType="next"
        value={name.value}
        onChangeText={(text) => setName({ value: text, error: "" })}
        error={!!name.error}
        errorText={name.error}
      />
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: "" })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Tên đăng nhập"
        returnKeyType="next"
        value={username.value}
        onChangeText={(text) => setUsername({ value: text, error: "" })}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: "" })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <Button
        mode="contained"
        onPress={onSignUpPressed}
        style={[styles.registerButton, { marginTop: 24 }]}
      >
        Đăng kí
      </Button>
      <View style={styles.row}>
        <Text>Đã có tài khoản? </Text>
        <TouchableOpacity onPress={() => navigation.replace("LoginScreen")}>
          <Text style={styles.link}>Đăng nhập tại đây</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginTop: 4,
    marginLeft: '5%'
  },
  link: {
    fontWeight: "bold",
    color: "#560CCE",
  },
  registerButton: {
    marginLeft: "5%"
  },
  textHeader: {
    marginTop: 35,
    fontSize: 24, // Kích thước chữ lớn hơn
    fontWeight: "bold", // Chữ đậm
    color: "#560CCE", // Màu chữ
    textAlign: "center", // Căn giữa chữ
    letterSpacing: 1, // Khoảng cách giữa các chữ
  },
});
