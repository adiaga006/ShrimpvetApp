import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { MaterialIcons } from '@expo/vector-icons';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  colors?: string[];
  disabled?: boolean;
  animation?: string;
  icon?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  isLoading = false,
  style,
  textStyle,
  colors = ['#f4511e', '#e67e22'],
  disabled = false,
  animation = 'pulse',
  icon = 'login',
}) => {
  return (
    <Animatable.View
      animation={animation}
      iterationCount={isLoading ? 'infinite' : undefined}
      duration={1500}
      style={[styles.button, style, disabled && styles.disabledButton]}
    >
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || isLoading}
        style={styles.touchable}
      >
        <LinearGradient
          colors={colors as any}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <View style={styles.buttonContent}>
              <MaterialIcons name={icon as any} size={20} color="#fff" style={styles.buttonIcon} />
              <Text style={[styles.text, textStyle]}>{title}</Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginVertical: 8,
    width: '100%',
  },
  touchable: {
    width: '100%',
  },
  gradient: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  text: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1,
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default CustomButton; 