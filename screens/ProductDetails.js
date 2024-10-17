import { useState } from "react";
import {
  View,
  TextInput,
  Alert,
  StyleSheet,
  Text,
  Pressable,
  Button,
  Platform,
  Image,
} from "react-native";
import { updateDoc, deleteDoc, doc } from "firebase/firestore";
import db from "../firebase/firebase.config";
import Dialog from "react-native-dialog";
import AwesomeAlert from "react-native-awesome-alerts";
import { launchImageLibrary } from "react-native-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { user } from "./Login";
const ProductDetails = ({ route, navigation }) => {
  const isMobile = Platform.OS === "android" || Platform.OS === "ios";
  const [visible, setVisible] = useState(false);
  const [textName, onChangeNameText] = useState(route.params.item.name);
  const [textPrice, onChangePriceText] = useState(route.params.item.price);
  const [textDescription, onChangeDescriptionText] = useState(
    route.params.item.description
  );
  const storage = getStorage();
  const [imageUri, setImageUri] = useState(route.params.item.avatar_link);
  const [imageUrl, setImageUrl] = useState(route.params.item.avatar_link);

  const selectImage = async () => {
    const result = await launchImageLibrary({
      mediaType: "photo",
      quality: 1,
    });

    if (!result.didCancel && result.assets) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      uploadImageToFirebase(uri);
    }
  };

  const uploadImageToFirebase = async (uri) => {
    try {
      // Tạo một ID ngẫu nhiên hoặc tên tệp cho hình ảnh
      const imageName = `images/${Date.now()}.jpg`;
      const storageRef = ref(storage, imageName);

      // Fetch image data from the uri
      const response = await fetch(uri);
      const blob = await response.blob();

      // Upload image
      await uploadBytes(storageRef, blob);

      // Lấy URL tải xuống
      const url = await getDownloadURL(storageRef);
      setImageUrl(url);
      console.log("Image URL: ", url); // In URL để kiểm tra
    } catch (error) {
      console.error("Error uploading image: ", error);
    }
  };
  async function UpdateUser() {
    const ref = doc(db, "product", route.params.item.id);
    await updateDoc(ref, {
      name: textName,
      price: textPrice,
      avatar_link: imageUrl,
      description: textDescription,
    })
      .then(() => {
        navigation.navigate("Product List", { user });
      })
      .catch((error) => {
        alert(error.messapp, analytics);
      });
  }
  const handleCancel = () => {
    setVisible(false);
  };

  const handleDelete = () => {
    DeleteUser();
    setVisible(false);
  };
  const showConfirmDialog = () => {
    setVisible(true);
  };

  async function DeleteUser() {
    const ref = doc(db, "product", route.params.item.id);
    await deleteDoc(ref)
      .then(() => {
        navigation.navigate("Product List", { user });
        alert("Deleted Product Successfully!");
      })
      .catch((error) => {
        alert(error.message);
      });
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textfield}
        onChangeText={onChangeNameText}
        value={textName}
        placeholder="Tên sản phẩm"
      />
      <TextInput
        style={styles.textfield}
        onChangeText={onChangePriceText}
        value={textPrice}
        placeholder="Giá"
      />
      <TextInput
        style={styles.textfield}
        onChangeText={onChangeDescriptionText}
        value={textDescription}
        placeholder="Mô tả sản phẩm"
      />
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Button title="Select Image" onPress={selectImage} />
        {imageUri && (
          <Image
            source={{ uri: imageUri }}
            style={{
              width: 100,
              height: 150,
              paddingTop: 30,
              paddingBottom: 30,
              marginTop: 20,
              marginBottom: 20,
              resize: "contain",
            }}
          />
        )}
        {imageUrl ? <Text>Image URL: {imageUrl}</Text> : null}
      </View>
      <Pressable
        style={styles.buttonUpdate}
        onPress={() => {
          UpdateUser();
        }}
      >
        <Text>Thay đổi thông tin sản phẩm</Text>
      </Pressable>
      <Pressable
        style={styles.buttonDelete}
        onPress={() => {
          showConfirmDialog();
        }}
      >
        <Text>Xóa sản phẩm</Text>
      </Pressable>
      {(isMobile && (
        <View style={styles.dialog_container}>
          <Dialog.Container visible={visible}>
            <Dialog.Title>Xác nhận xóa</Dialog.Title>
            <Dialog.Description>
              Bạn có chắc muốn xóa sản phẩm này. Thao tác này sẽ không thể hoàn
              tác
            </Dialog.Description>
            <Dialog.Button label="Hủy" onPress={handleCancel} />
            <Dialog.Button label="Xóa" onPress={handleDelete} />
          </Dialog.Container>
        </View>
      )) || (
          <AwesomeAlert
            show={visible}
            showProgress={false}
            title="Chắc chắn xóa ?"
            message="Thao tác của bạn sẽ không thể hoàn tác"
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showCancelButton={true}
            showConfirmButton={true}
            cancelText="Quay lại"
            confirmText="Đồng ý"
            confirmButtonColor="#DD6B55"
            onCancelPressed={() => {
              handleCancel();
            }}
            onConfirmPressed={() => {
              handleDelete();
            }}
          />
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 30,
  },
  textfield: {
    marginBottom: 10,
    padding: 10,
    fontSize: 15,
    color: "#000000",
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
  },
  buttonUpdate: {
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#0de065",
  },
  buttonDelete: {
    marginTop: 5,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    fontWeight: "800",
    backgroundColor: "#f24848",
  },
  textButton: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
  },
  dialog_container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ProductDetails;
