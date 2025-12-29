import {KeyboardTypeOptions} from "react-native";
import {UserTask} from "./userTypes";

export type RootStackParamList = {
  LoginPage: undefined;
  MainPage: undefined;
  AddPage: { task?: UserTask };
  ProfileView: undefined;
  ProfileEdit: undefined;
  HomePage: undefined;
  Chat: undefined;
  Support: undefined;
  Habits: undefined;
  AddHabit: undefined;
  Business: undefined;
  Earnings: undefined;
  LoginCodePage: undefined;
  DescStyle: { description: string };
  ViewTask: { task: UserTask };
  IncomeAndExpenses: {
    selectedDate: string;
    businessId: string;
  };
};
export interface Checkbox {
  label?: string;
  value: boolean;
  onChange: (val: boolean) => void;
  color?: string;
}
export interface TextFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  required?: boolean;
  errorMessage?: string;
  secureTextEntry?: boolean;
  minLength?: number;
  minHeight?: number;
  editable?: boolean;
  multiline?: number | any;
  keyboardType?: KeyboardTypeOptions;
  sumFormat?: boolean;
}
export interface ConfirmModalProps {
  visible: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}
export interface TodoItemProps {
  item: {
    id: string;
    title: string;
    description: string;
    done?: boolean;
    deadline?: string | Date;
    time: string | Date;
    isReturning?: number;
    status?: number;
    isDeleted?: boolean;
    files?: [];
    alarmDate?: Date | any;
    notificationId?: string;
  };
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onToggle?: (item: object) => void;
  onLongPress?: (y: number) => void;
  onPress?: (e: any) => void;
  onPressIn?: (e: any) => void;
  onPressOut?: (e: any) => void;
}
export interface LeftMenuProps {
  buttons: {
      icon: string;
      size?: number;
      color?: string;
      marginLeft?:string | any;
      onPress: () => void;
  }[];
  containerStyle?: object;
}