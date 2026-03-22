import React, { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Search = () => {
  const [number, onChangeNumber] = useState("");
  const { bottom } = useSafeAreaInsets();
  const bottomPadding = bottom + 20;

  return (
    <View style={[styles.container, { paddingBottom: bottomPadding }]}>
      <TextInput
        style={styles.input}
        onChangeText={onChangeNumber}
        value={number}
        placeholder="useless placeholder"
        keyboardType="numeric"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 24,
    
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
});

export default Search;
