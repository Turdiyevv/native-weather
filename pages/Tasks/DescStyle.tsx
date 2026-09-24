import { useTheme } from "../../theme/ThemeContext";
import {RouteProp, useRoute} from "@react-navigation/native";
import {Text, StyleSheet, View, Platform, ScrollView} from "react-native";
import Header from "../../components/global/Header";
import { RootStackParamList } from "../types/types";
import Star from "../../components/Task/Star";

type DescRouteProp = RouteProp<RootStackParamList, "DescStyle">;

const DescStyle: React.FC = () => {
  const { theme } = useTheme();
  const route = useRoute<DescRouteProp>();
  const description = route.params.description;

  return (
      <View style={{flex: 1}}>
          <View style={styles.background}>
            {/*<ImageBackground*/}
            {/*   source={require("../../assets/background2.jpg")}  background rasmi yo‘li*/}
            {/*   style={styles.background}*/}
            {/*   resizeMode="cover"*/}
            {/* >*/}
               {Array.from({ length: 50 }).map((_, i) => (
                    <Star key={i} />
               ))}
              <Header title={"Elementni ko'rish"} isBack={true} />
              <View style={styles.textContainer}>
                  <ScrollView style={[styles.textSmContainer, {backgroundColor: theme.background, borderColor: theme.border}]}>
                      <Text style={[styles.text, { color: theme.text }]}>{description}</Text>
                      <Text style={[styles.textLink, { color: theme.placeholder }]}>@turdiyevline</Text>
                  </ScrollView>
              </View>
        </View>
      </View>
  );
};

export default DescStyle;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  textContainer: {
      flexDirection: "row",
      height: "90%",
      justifyContent: "center",
      alignItems: "center",
      margin: 16,
  },
  textSmContainer: {
      borderWidth: 1,
      borderRadius: 16,
      position: "relative",
      padding: 10,
      shadowColor: "#fff",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.5,
      shadowRadius: 10,
      elevation: 40,
  },
    text: {
      margin: 10,
      fontSize: 16,
      lineHeight: 30,
      textAlign: "left",
      fontFamily: Platform.select({
        ios: "Helvetica Neue",
        android: "Roboto",
      }),
    },
    textLink: {
      bottom: 0,
        right: 0,
      position: "absolute",
      fontSize: 12,
      fontFamily: Platform.select({
        ios: "Helvetica Neue",
        android: "Roboto",
      }),
    },

});
