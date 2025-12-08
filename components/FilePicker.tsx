import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from "react-native";
import * as DocumentPicker from "expo-document-picker";

export default function FilePickerComponent({ onChange, initialFiles = [] }: any) {
  const [files, setFiles] = useState<any[]>(initialFiles);

  const pickDocuments = async () => {
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
  };

  const removeFile = (uri: string) => {
    const newFiles = files.filter((file) => file.uri !== uri);
    setFiles(newFiles);
    onChange(newFiles);
  };

  return (
    <View>
      <Text style={styles.title}>Fayllar</Text>
      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.btn} onPress={pickDocuments}>
          <Text style={styles.btnText}>Fayl tanlash (PDF, DOCX...)</Text>
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

            <TouchableOpacity style={styles.removeBtn} onPress={() => removeFile(file.uri)}>
              <Text style={styles.removeText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "600",
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btn: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 8,
  },
  btnText: {
    color: "white",
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
