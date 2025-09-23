import Toast from "react-native-toast-message";
import { View, Text, StyleSheet } from "react-native";

const ToastConfig = {
  successCustom: ({ text1, text2, ...rest }) => (
    <View style={[styles.toastContainer, { backgroundColor: "#4BB543" }]}>
      <Text style={styles.toastTitle}>{text1}</Text>
      <Text style={styles.toastMessage}>{text2}</Text>
    </View>
  ),
  errorCustom: ({ text1, text2, ...rest }) => (
    <View style={[styles.toastContainer, { backgroundColor: "#FF4C4C" }]}>
      <Text style={styles.toastTitle}>{text1}</Text>
      <Text style={styles.toastMessage}>{text2}</Text>
    </View>
  ),
};

const styles = StyleSheet.create({
  toastContainer: {
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 3,
  },
  toastTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "Satoshi-Regular",
    fontSize: 16,
  },
  toastMessage: {
    color: "#fff",
    marginTop: 2,
    fontFamily: "Satoshi-Regular",
    fontSize: 14,
  },
});

export default ToastConfig;
