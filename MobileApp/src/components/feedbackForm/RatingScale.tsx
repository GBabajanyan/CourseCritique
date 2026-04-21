import { useColors } from "@/src/hooks/useColors";
import { MaterialIcons } from "@expo/vector-icons";
import { Rating } from "@kolking/react-native-rating";
import React from "react";
import { TouchableOpacity, View } from "react-native";

interface RatingScaleProps {
  type: "5" | "3" | "thumb";
  value?: number;
  iconSize?: number;
  onChange: (val: number) => void;
}

const RatingScale: React.FC<RatingScaleProps> = ({
  type,
  value,
  iconSize,
  onChange,
}) => {
  const { SAFFRON, NAVY } = useColors();

  if (type === "thumb") {
    const isLiked = !!value;
    const isSelected = value !== undefined;
    const thumbUpIconName =
      isLiked && isSelected ? "thumb-up-alt" : "thumb-up-off-alt";
    const thumbDownIconName =
      !isLiked && isSelected ? "thumb-down-alt" : "thumb-down-off-alt";
    return (
      <View style={{ flexDirection: "row", gap: 16, justifyContent: "center" }}>
        <TouchableOpacity onPress={() => onChange(1)}>
          <MaterialIcons
            name={thumbUpIconName}
            size={iconSize}
            color={isLiked && isSelected ? SAFFRON : NAVY}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onChange(0)}>
          <MaterialIcons
            name={thumbDownIconName}
            size={iconSize}
            color={!isLiked && isSelected ? SAFFRON : NAVY}
          />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flexDirection: "row" }}>
      <Rating
        variant="stars-outline"
        rating={value}
        onChange={onChange}
        maxRating={Number(type)}
        fillColor={SAFFRON}
        baseColor={NAVY}
        size={iconSize}
      />
    </View>
  );
};

export default RatingScale;
