import { useColorScheme } from "react-native";

const A = useColorScheme();
export const textColor = A === 'dark' ? '#FFF' : '#000';