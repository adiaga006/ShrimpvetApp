import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  Platform,
  StyleSheet
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { MaterialIcons, FontAwesome5, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import CustomButton from '../components/CustomButton';
import { addUser, testConnection } from '../services/api'; // Import API register

const { width, height } = Dimensions.get('window');

const RegisterScreen: React.FC = ({ navigation }: any) => {
  // State quản lý form đăng ký
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fullname,setFullname]=useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<string | null>(null);

  // Refs for animations
  const formRef = useRef(null);
  const logoRef = useRef(null);

  // Kiểm tra kết nối API khi màn hình tải
  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        const response = await testConnection();
        if (response && response.message) {
          setApiStatus('Connected to API');
        }
      } catch (error) {
        setApiStatus('API connection failed');
        console.error('API connection error:', error);
      }
    };

    checkApiConnection();
  }, []);

  const handleRegister = async () => {
    // Kiểm tra đầu vào
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const response = await addUser({username, email, fullname, password});
      setIsLoading(false);

      if (response && response.success) {
        Alert.alert('Success', 'Registration successful. You can now log in.');
        navigation.navigate('Login');
      }
    } catch (error: any) {
      setIsLoading(false);
      
      if (error.response) {
        Alert.alert('Registration Failed', error.response.data.error || 'Something went wrong');
      } else {
        Alert.alert('Connection Error', 'Could not connect to the server. Please check your internet connection.');
      }
      
      console.error('Registration error:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar backgroundColor="#0047ab" barStyle="light-content" />

      <LinearGradient
        colors={['#0047ab', '#00a2ff', '#87CEEB']}
        style={styles.gradientBackground}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Animatable.View 
            ref={logoRef}
            animation="bounceIn" 
            duration={1500} 
            style={styles.logoContainer}
          >
            <Image 
              source={require('../../assets/logo.png')} 
              style={styles.logo} 
              resizeMode="contain"
            />
            <Animatable.Text 
              animation="fadeIn" 
              delay={500} 
              style={styles.title}
            >
              SHRIMPVET
            </Animatable.Text>
          </Animatable.View>

          <Animatable.View 
            ref={formRef}
            animation="fadeInUpBig" 
            duration={800} 
            delay={300}
            style={styles.formContainer}
          >
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                <Ionicons name="person-outline" size={16} color="#444" style={styles.inputIcon} />
                Username
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                <MaterialIcons name="email" size={16} color="#444" style={styles.inputIcon} />
                Email
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                <MaterialIcons name="person" size={16} color="#444" style={styles.inputIcon} />
                Fullname
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={fullname}
                onChangeText={setFullname}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                <Ionicons name="lock-closed-outline" size={16} color="#444" style={styles.inputIcon} />
                Password
              </Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                <Ionicons name="lock-closed-outline" size={16} color="#444" style={styles.inputIcon} />
                Confirm Password
              </Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                />
              </View>
            </View>

            <CustomButton
              title="REGISTER"
              onPress={handleRegister}
              isLoading={isLoading}
              colors={['#f4511e', '#e67e22']}
              animation="pulse"
            />

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradientBackground: { flex: 1 },
  scrollViewContent: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 30 },
  logoContainer: { alignItems: 'center', marginBottom: 30 },
  logo: { width: width * 0.6, height: height * 0.15, marginBottom: 10 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginTop: 10 },
  formContainer: { width: width * 0.9, backgroundColor: '#fff', borderRadius: 15, padding: 20, elevation: 5 },
  inputContainer: { marginBottom: 20 },
  inputLabel: { fontSize: 16, fontWeight: '500', marginBottom: 8, color: '#333' },
  input: { backgroundColor: '#f5f5f5', borderRadius: 8, padding: 12, fontSize: 16, borderWidth: 1, borderColor: '#ddd' },
  loginContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  loginText: { color: '#333', fontSize: 16 },
  loginLink: { color: '#0047ab', fontWeight: 'bold', fontSize: 16 },
  inputIcon: {marginRight: 6},
  passwordContainer:{
    flexDirection: 'row',
    alignItems: 'center'
  },
  passwordInput:{
    flex: 1
  }
});

export default RegisterScreen;