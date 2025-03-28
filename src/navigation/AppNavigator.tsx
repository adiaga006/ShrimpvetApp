import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from 'screens/RegisterScreen';
import ApiTestScreen from '../screens/ApiTestScreen';

// Định nghĩa các kiểu dữ liệu cho các tham số route
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  ApiTest: undefined;
  // Thêm các màn hình khác ở đây khi cần
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ 
            headerShown: true,
            title: 'Shrimpvet App',
            headerStyle: {
              backgroundColor: '#0047ab',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} 
        />
        <Stack.Screen 
          name="ApiTest" 
          component={ApiTestScreen} 
          options={{ 
            headerShown: true,
            title: 'API Test',
            headerStyle: {
              backgroundColor: '#0047ab',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} 
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 