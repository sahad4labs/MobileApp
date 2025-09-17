import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import Header from "../components/Header";

export default function Layout({ 
  children, 
  headerProps 
}) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Header {...headerProps} />
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
});
