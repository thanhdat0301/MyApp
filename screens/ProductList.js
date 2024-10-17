import { useState, useEffect } from "react";
import {
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  collection,
  onSnapshot,
} from "firebase/firestore";
import db from "../firebase/firebase.config";
import emptyList from "../image/ext/rolled_eyes.png";
import formatPrice from "../helpers/formatPrice";
import logoutIcon from "../assets/logout.webp"; // Sử dụng require để nhập hình ảnh

function ProductList({ route, navigation }) {
  const [products, setProducts] = useState([]);
  const isMobile = Platform.OS === "android" || Platform.OS === "ios";
  const user = route.params.user;

  useEffect(() => {
    const colRef = collection(db, "product");
    const unsubscribe = onSnapshot(colRef, (querySnapshot) => {
      const products = [];
      querySnapshot.forEach((doc) => {
        const { name, price, avatar_link, description } = doc.data();
        products.push({
          id: doc.id,
          name,
          price,
          avatar_link,
          description,
        });
      });
      setProducts(products);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.buttonAdd}
          onPress={() => navigation.navigate("Create New Product")}
        >
          <Text style={styles.textButton}>Thêm sản phẩm</Text>
        </Pressable>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: user.avatar_link }}
            style={styles.userImage}
          />
          <View style={styles.userText}>
            <Text style={styles.greeting}>Xin chào,</Text>
            <Text style={styles.userName}>{user.name}</Text>
          </View>
          <Pressable style={styles.buttonLogOut} onPress={() => { navigation.navigate("LoginScreen") }}>
            <Image
              source={logoutIcon}
              style={styles.logoutIcon}
            />
          </Pressable>
        </View>
      </View>

      {/* Product List */}
      <FlatList
        style={styles.list}
        data={products}
        numColumns={1}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Không có sản phẩm nào.</Text>
            <Image
              source={emptyList}
              style={styles.emptyImage}
            />
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.productCard}
            onPress={() => navigation.navigate("Product Details", { item })}
          >
            <Image
              source={{ uri: item.avatar_link }}
              style={styles.productImage}
            />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>{formatPrice(item.price)} VNĐ</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonAdd: {
    backgroundColor: "#1ecfea",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    elevation: 2,
  },
  textButton: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userText: {
    marginRight: 10,
  },
  greeting: {
    fontSize: 14,
    color: "#555",
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  buttonLogOut: {
    padding: 5,
  },
  logoutIcon: {
    width: 30,
    height: 30,
    tintColor: "#1ecfea",
  },
  list: {
    flex: 1,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
  },
  emptyImage: {
    width: 100,
    height: 100,
    marginTop: 20,
    resizeMode: "contain",
  },
  productCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3, // Đổ bóng trên Android
    shadowColor: "#000", // Đổ bóng trên iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
    resizeMode: "cover",
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  productPrice: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
});

export default ProductList;
