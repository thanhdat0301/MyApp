import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./screens/ProductList";
import CreateNewProduct from "./screens/CreateNewProduct";
import ProductDetails from "./screens/ProductDetails";
import Login from "./screens/Login";
import Register from "./screens/Register";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LoginScreen"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#f4511e",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerTitleAlign: "center",
        }}
      >
        <Stack.Screen
          name="LoginScreen"
          component={Login}
          options={{ title: "Login", headerShown: false }}
        />
        <Stack.Screen
          name="RegisterScreen"
          component={Register}
          options={{ title: "Register", headerShown: false }}
        />
        <Stack.Screen
          name="Product List"
          component={HomeScreen}
          options={{ title: "Danh sách sản phẩm" }}
        />
        <Stack.Screen
          name="Create New Product"
          component={CreateNewProduct}
          options={{ title: "" }}
        />
        <Stack.Screen
          name="Product Details"
          component={ProductDetails}
          options={{ title: "Chỉnh sửa sản phẩm" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    // <Register />
  );
}
