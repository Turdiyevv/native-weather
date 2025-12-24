import {useTheme} from "../../theme/ThemeContext";
import {RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import {Text, StyleSheet, View} from "react-native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import Header from "../../components/global/Header";
import {RootStackParamList} from "../types/types";

type DescRouteProp = RouteProp<RootStackParamList, "DescStyle">;


type SupportNav = NativeStackNavigationProp<RootStackParamList, "DescStyle">;
const DescStyle: React.FC = () => {
    const navigation = useNavigation<SupportNav>();
    const { theme } = useTheme();
    const route = useRoute<DescRouteProp>();
    const description  = route.params.description;
  return (
      <View>
          <View style={styles.bar} />
          <Header title={"ELementni ko'rish"}/>
          <Text style={[styles.text,{color: theme.text}]}> {description}</Text>
      </View>
  )
}
export default DescStyle;
const styles = StyleSheet.create({
    bar: { height: 35, width: "100%" },
    text: {fontSize: 22}
})