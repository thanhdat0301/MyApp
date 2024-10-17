import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
} from "react-native";
import { addDoc, collection } from "firebase/firestore";
import db from "../firebase/firebase.config";
import { launchImageLibrary } from "react-native-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { user } from "./Login";

export default function CreateNewProduct({ navigation }) {
  const [textName, onChangeNameText] = useState("");
  const [textPrice, onChangePriceText] = useState("");
  const [textDescription, onChangeDescriptionText] = useState("");
  const storage = getStorage();
  const [imageUri, setImageUri] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  
  //Chọn ảnh từ thư viện ảnh
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
      const imageName = `images/${Date.now()}.jpg`;
      const storageRef = ref(storage, imageName);
      const response = await fetch(uri);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);
      setImageUrl(url);
      console.log("Image URL: ", url);
    } catch (error) {
      console.error("Error uploading image: ", error);
    }
  };

  async function AddProduct() {
    await addDoc(collection(db, "product"), {
      name: textName,
      price: textPrice,
      avatar_link: imageUrl,
      description: textDescription,
    })
      .then(() => {
        navigation.navigate("Product List", { user });
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  function ButtonSave() {
    if (
      textName.length === 0 ||
      textPrice.length === 0 ||
      textDescription.length === 0
    ) {
      alert("All the fields are required");
      return;
    }
    AddProduct();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tạo Sản Phẩm Mới</Text>

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
        placeholder="Giá sản phẩm"
        keyboardType="numeric"
      />
      <TextInput
        style={styles.textfield}
        onChangeText={onChangeDescriptionText}
        value={textDescription}
        placeholder="Mô tả sản phẩm"
        multiline
        numberOfLines={4}
      />

      <View style={styles.imagePicker}>
        <Pressable style={styles.buttonSelectImage} onPress={selectImage}>
          <Text style={styles.textButton}>Chọn Hình Ảnh</Text>
        </Pressable>
        {imageUri && (
          <Image
            source={{ uri: imageUri }}
            style={styles.imagePreview}
          />
        )}
        {imageUrl ? <Text style={styles.imageUrl}>URL Hình Ảnh: {imageUrl}</Text> : null}
      </View>

      <Pressable style={styles.buttonSave} onPress={ButtonSave}>
        <Text style={styles.textButton}>Lưu</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#560CCE",
    marginBottom: 20,
    textAlign: "center",
  },
  textfield: {
    marginBottom: 15,
    padding: 10,
    fontSize: 16,
    color: "#000000",
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  imagePicker: {
    alignItems: "center",
    marginVertical: 20,
  },
  buttonSelectImage: {
    backgroundColor: "#1ecfea",
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    resizeMode: "cover",
  },
  imageUrl: {
    marginTop: 10,
    color: "#560CCE",
  },
  buttonSave: {
    backgroundColor: "#1ecfea",
    borderRadius: 5,
    paddingVertical: 12,
    alignItems: "center",
  },
  textButton: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});
