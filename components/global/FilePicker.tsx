import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import ImageViewing from "react-native-image-viewing";
import { useTheme } from "../../theme/ThemeContext";

export default function FilePickerComponent({
  onChange,
  initialFiles = [],
  disabled = false,
}: any) {
  const { theme } = useTheme();

  const [files, setFiles] = useState<any[]>(initialFiles);
  const [previewIndex, setPreviewIndex] = useState<number>(0);
  const [viewerVisible, setViewerVisible] = useState(false);

  const images = files
    .filter(f => f.type?.includes("image"))
    .map(f => ({ uri: f.uri }));

  const pickDocuments = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ multiple: true });
      if (result.assets) {
        const selected = result.assets.map(file => ({
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
    const newFiles = files.filter(file => file.uri !== uri);
    setFiles(newFiles);
    onChange(newFiles);
  };

  const openPreview = (uri: string) => {
    const index = images.findIndex(img => img.uri === uri);
    if (index >= 0) {
      setPreviewIndex(index);
      setViewerVisible(true);
    }
  };

  return (
    <View>
      {/* BUTTON */}
      <View style={styles.btnRow}>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: theme.border }]}
          onPress={() => {
              global.filePickerOpen = true;
              global.ignoreNextAppState = true;
              pickDocuments();
          }}
          disabled={disabled}
        >
          <Text style={[styles.btnText, { color: theme.text }]}>
            Fayl tanlash
          </Text>
        </TouchableOpacity>
      </View>

      {/* FILE LIST */}
      <ScrollView horizontal style={{ marginTop: 15 }}>
        {files.map((file, i) => (
          <View key={i} style={styles.fileBox}>
            {file.type?.includes("image") ? (
              <TouchableOpacity onPress={() => openPreview(file.uri)}>
                <Image source={{ uri: file.uri }} style={styles.image} />
              </TouchableOpacity>
            ) : (
              <Text style={styles.fileName}>{file.name}</Text>
            )}

            {!disabled && (
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removeFile(file.uri)}
              >
                <Text style={styles.removeText}>×</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>

      {/* FULLSCREEN IMAGE VIEWER */}
      <ImageViewing
        images={images}
        imageIndex={previewIndex}
        visible={viewerVisible}
        onRequestClose={() => setViewerVisible(false)}
        swipeToCloseEnabled
        doubleTapToZoomEnabled
      />
    </View>
  );
}

const styles = StyleSheet.create({
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  btnText: {
    fontSize: 14,
  },
  fileBox: {
    position: "relative",
    marginRight: 12,
    marginVertical: 5,
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
