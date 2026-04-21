import { Colors } from "../constants/colors";
import { useTheme } from "../theme/ThemeProvider";

export const useColors = () => {
  const { theme } = useTheme();
  // const themeConverter = (style: StyleProp<any>, darkTheme?: boolean) => {
  //   if (!darkTheme) return style;
  //   const updStyle = { ...style } as StyleProp<any>;
  //   const darkThemeProps = Object.keys(themes.dark);
  //   Object.entries(style).forEach(([key, value]) => {
  //     if (darkThemeProps.includes(key)) updStyle[key] = themes.dark[key];
  //   });
  // };
  return Colors[theme === "dark" ? "dark" : "light"];
};
