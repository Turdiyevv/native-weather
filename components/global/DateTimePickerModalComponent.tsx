// components/DateTimePickerModalComponent.tsx
import React from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";

interface Props {
  isVisible: boolean;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
  minimumDate?: Date;
  mode?: "date" | "time" | "datetime"; // optional, default "datetime"
}

const DateTimePickerModalComponent: React.FC<Props> = ({
  isVisible,
  onConfirm,
  onCancel,
  minimumDate,
  mode = "datetime",
}) => {
  return (
    <DateTimePickerModal
      isVisible={isVisible}
      mode={mode}
      onConfirm={onConfirm}
      onCancel={onCancel}
      minimumDate={minimumDate || new Date()}
    />
  );
};

export default DateTimePickerModalComponent;
