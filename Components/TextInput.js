import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { TextInput as PaperInput } from "react-native-paper";

export default function TextInput({ errorText, description, leftIcon, rightIcon, ...props }) {
  return (
    <View style={styles.container}>
      <PaperInput
        style={styles.input}
        selectionColor="#560CCE" // Màu con trỏ
        underlineColor="transparent"
        mode="outlined"
        left={leftIcon ? <PaperInput.Icon name={leftIcon} color="#560CCE" /> : null}
        right={rightIcon ? <PaperInput.Icon name={rightIcon} color="#560CCE" /> : null}
        theme={{
          colors: {
            primary: "#560CCE", // Màu viền khi focus
            text: "#333333", // Màu chữ
            placeholder: "#888888", // Màu placeholder
            background: "#ffffff", // Màu nền
            error: "#f13a59", // Màu thông báo lỗi
          },
        }}
        {...props}
        // Căn giữa nội dung văn bản bên trong TextInput
        textAlign="center"
      />
      {description && !errorText && (
        <Text style={styles.description}>{description}</Text>
      )}
      {errorText && <Text style={styles.error}>{errorText}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 12,
    alignItems: "center", // Căn giữa TextInput trong container
  },
  input: {
    width: "90%", // Điều chỉnh chiều rộng theo ý muốn
    backgroundColor: "#ffffff",
    borderRadius: 8,
    // Đổ bóng cho iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    // Đổ bóng cho Android
    elevation: 2,
  },
  description: {
    fontSize: 12,
    color: "#414757",
    paddingTop: 4,
    paddingLeft: 4,
    textAlign: "center", // Căn giữa văn bản mô tả
  },
  error: {
    fontSize: 12,
    color: "#f13a59",
    paddingTop: 4,
    paddingLeft: 4,
    textAlign: "center", // Căn giữa văn bản lỗi
  },
});
