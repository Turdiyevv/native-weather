import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import {useTheme} from "../theme/ThemeContext";

export default function FilePickerComponent({ onChange, initialFiles = [], disabled = false }: any) {
  const { theme } = useTheme();
    const [files, setFiles] = useState<any[]>(initialFiles);

  const pickDocuments = async () => {
      try {
        global.filePickerOpen = true;
        const result = await DocumentPicker.getDocumentAsync({ multiple: true });
        if (result.assets) {
          const selected = result.assets.map((file) => ({
            uri: file.uri,
            name: file.name,
            type: file.mimeType,
          }));

          const newFiles = [...files, ...selected];
          setFiles(newFiles);
          onChange(newFiles);
        }
      } finally {
        global.filePickerOpen = false;
      }
  };

  const removeFile = (uri: string) => {
      if (disabled) return;
      const newFiles = files.filter((file) => file.uri !== uri);
      setFiles(newFiles);
      onChange(newFiles);
  };

  return (
    <View>
      <View style={styles.btnRow}>
        <TouchableOpacity style={[styles.btn, {backgroundColor: theme.card}]} onPress={pickDocuments} disabled={disabled}>
          <Text style={[styles.btnText, {color: theme.text}]}>Fayl tanlash</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal style={{ marginTop: 15 }}>
        {files.map((file, i) => (
          <View key={i} style={styles.fileBox}>
            {file.type?.includes("image") ? (
              <Image source={{ uri: file.uri }} style={styles.image} />
            ) : (
              <Text style={styles.fileName}>{file.name}</Text>
            )}

            {!disabled && (
              <TouchableOpacity style={styles.removeBtn} onPress={() => removeFile(file.uri)}>
                <Text style={styles.removeText}>×</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btn: {
    padding: 8,
    borderRadius: 8,
  },
  btnText: {
    color: "#121",
    fontSize: 14,
  },
  fileBox: {
    position: "relative",
    marginRight: 12,
    marginVertical:5
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 8,
  },
  fileName: {
    width: 90,
    height: 90,
    backgroundColor: "#ddd",
    padding: 5,
    borderRadius: 8,
  },
  removeBtn: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    borderRadius: 12,
    width: 22,
    height: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  removeText: {
    color: "white",
    fontSize: 16,
    marginTop: -2,
  },
});
