import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Logo from "../Components/Logo";
import Header from "../Components/Header";
import TextInput from "../Components/TextInput";
import Background from "../Components/Background";
import Button from "../Components/Button";
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { emailValidator } from "../helpers/emailValidator";
import { passwordValidator } from "../helpers/passwordValidator";
import db from "../firebase/firebase.config";
// import http from "../utils/http";
var userData = {};
function Login({ navigation }) {
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [username, setUsername] = useState({ value: "", error: "" });
  const [error, setError] = useState(false);

  const onLoginPressed = async () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    const usernameError =
      username === "" ? "Tài khoản không được để trống" : "";
    if (emailError || passwordError || usernameError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      setUsername({ ...username, error: usernameError });
      return;
    } else {
      const usersRef = collection(db, "users");

      // Tạo truy vấn kiểm tra nếu email, username và password đều khớp
      const q = query(
        usersRef,
        where("email", "==", email.value),
        where("username", "==", username.value),
        where("password", "==", password.value)
      );
      
      // Thực thi truy vấn và lấy dữ liệu
      const querySnapshot = await getDocs(q);
      // Kiểm tra nếu tồn tại tài khoản
      if (!querySnapshot.empty) {
        // Lấy thông tin tài khoản, nhưng bỏ qua password
        const userDoc = querySnapshot.docs[0]; // Lấy document đầu tiên
        const userDataWithoutPassword = {
          ...userDoc.data(),
          id: userDoc.id,
        };
        delete userDataWithoutPassword.password; // Loại bỏ password

        // Lưu thông tin tài khoản không có password vào state
        userData = { ...userDataWithoutPassword };
        navigation.navigate("Product List", {
          user: { ...userDataWithoutPassword },
        }); //
      } else {
        alert("Thông tin đăng nhập sai. Vui lòng thử lại!");
      }
    }
  };
  return (
    <>
      <Header style={styles.textHeader}>Đăng nhập</Header>
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => {
          setEmail({ value: text, error: "" });
          setError(false);
        }}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      {error && (
        <Text style={{ color: "red" }}>
          * Tài khoản, mật khẩu hoặc email có thể không đúng. Xin hãy nhập lại
        </Text>
      )}
      <TextInput
        label="Tên đăng nhập"
        returnKeyType="next"
        value={username.value}
        onChangeText={(text) => {
          setUsername({ value: text, error: "" });
          setError(false);
        }}
        error={!!username.error}
        errorText={username.error}
        autoCapitalize="none"
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => {
          setPassword({ value: text, error: "" });
          setError(false);
        }}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate("ResetPasswordScreen")}
        >
          <Text style={styles.forgot}>Quên mật khẩu?</Text>
        </TouchableOpacity>
      </View>
      <Button style={styles.loginButton} mode="contained" onPress={onLoginPressed}>
        Đăng nhập
      </Button>
      <View style={styles.row}>
        <Text>Chưa có tài khoản? </Text>
        <TouchableOpacity onPress={() => navigation.replace("RegisterScreen")}>
          <Text style={styles.link}>Đăng kí tại đây</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  forgotPassword: {
    width: "95%",
    alignItems: "flex-end",
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
    marginLeft: "5%"
  },
  loginButton: {
    marginLeft: "5%"
  },
  forgot: {
    fontSize: 13,
    color: "#414757",
  },
  link: {
    fontWeight: "bold",
    color: "#560CCE",
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
export const user = { ...userData };
export default Login;
