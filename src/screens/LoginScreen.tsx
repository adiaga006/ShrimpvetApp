import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONT_SIZE, SPACING } from '../constants/theme';
import CustomButton from '../components/CustomButton';
import { MaterialIcons, FontAwesome5, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { login, testConnection } from '../services/api';

const { width, height } = Dimensions.get('window');

const LoginScreen: React.FC = ({ navigation }: any) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<string | null>(null);

  // Refs for animations
  const formRef = useRef(null);
  const logoRef = useRef(null);

  // Test API connection on component mount
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

  const handleLogin = async () => {
    // Validate inputs
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setIsLoading(true);

    try {
      const response = await login(username, password);
      setIsLoading(false);
      
      // Handle successful login
      if (response && response.user) {
        Alert.alert('Success', 'Login successful');
        if (navigation) {
          navigation.navigate('Home');
        }
      }
    } catch (error: any) {
      setIsLoading(false);
      
      // Handle different errors
      if (error.response) {
        // Server responded with error
        if (error.response.status === 401) {
          Alert.alert('Login Failed', 'Invalid username or password');
        } else {
          Alert.alert('Error', error.response.data.error || 'Something went wrong');
        }
      } else {
        // Network error or other issues
        Alert.alert('Connection Error', 'Could not connect to the server. Please check your internet connection.');
      }
      
      console.error('Login error:', error);
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
            <Animatable.Text 
              animation="fadeIn" 
              delay={700} 
              style={styles.subtitle}
            >
              Aquatic Pathology Research Expert
            </Animatable.Text>
            
            {/* API Status Indicator */}
            {apiStatus && (
              <Animatable.View animation="fadeIn" style={styles.apiStatusContainer}>
                <Text style={[
                  styles.apiStatusText, 
                  { color: apiStatus.includes('Connected') ? '#4CAF50' : '#F44336' }
                ]}>
                  {apiStatus}
                </Text>
              </Animatable.View>
            )}
          </Animatable.View>

          <Animatable.View 
            ref={formRef}
            animation="fadeInUpBig" 
            duration={800} 
            delay={300}
            style={styles.formContainer}
          >
            <View style={styles.header}>
              <MaterialCommunityIcons name="microscope" size={24} color="#0047ab" style={styles.headerIcon} />
              <FontAwesome5 name="flask" size={20} color="#f4511e" style={styles.headerIcon} />
              <FontAwesome5 name="fish" size={20} color="#0047ab" style={styles.headerIcon} />
              <MaterialCommunityIcons name="bacteria" size={24} color="#f4511e" style={styles.headerIcon} />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                <Ionicons name="person-outline" size={16} color="#444" style={styles.inputIcon} />
                Username
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Email or phone number"
                value={username}
                onChangeText={setUsername}
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
                  placeholder="Your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity 
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <MaterialIcons 
                    name={showPassword ? "visibility-off" : "visibility"} 
                    size={22} 
                    color="#555"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <CustomButton
              title="LOGIN"
              onPress={handleLogin}
              isLoading={isLoading}
              colors={['#f4511e', '#e67e22']}
              animation="pulse"
            />

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity>
                <Text style={styles.registerLink}>Register Now</Text>
              </TouchableOpacity>
            </View>
            
            {/* API Test Button */}
            <TouchableOpacity 
              style={styles.apiTestButton}
              onPress={() => navigation.navigate('ApiTest')}
            >
              <MaterialCommunityIcons name="api" size={18} color="#0047ab" />
              <Text style={styles.apiTestText}>Test API Connection</Text>
            </TouchableOpacity>
          </Animatable.View>

          <View style={styles.footer}>
            <Animatable.View animation="pulse" iterationCount="infinite" duration={2000}>
              <MaterialCommunityIcons name="molecule" size={24} color="white" />
            </Animatable.View>
            <Text style={styles.footerText}>Advanced Aquaculture Solutions</Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: width * 0.6,
    height: height * 0.15,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
    opacity: 0.9,
  },
  apiStatusContainer: {
    marginTop: 10,
    padding: 5,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  apiStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  formContainer: {
    width: width * 0.9,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: SPACING.l,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xl,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  headerIcon: {
    marginHorizontal: 8,
  },
  inputContainer: {
    marginBottom: SPACING.m,
  },
  inputLabel: {
    fontSize: FONT_SIZE.medium,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    marginRight: 6,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: FONT_SIZE.medium,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    height: '100%',
    justifyContent: 'center',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.m,
  },
  forgotPasswordText: {
    color: '#0047ab',
    fontSize: FONT_SIZE.medium,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.xl,
  },
  registerText: {
    color: '#333',
    fontSize: FONT_SIZE.medium,
  },
  registerLink: {
    color: '#0047ab',
    fontWeight: 'bold',
    fontSize: FONT_SIZE.medium,
  },
  apiTestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.m,
    padding: SPACING.s,
    borderWidth: 1,
    borderColor: '#0047ab',
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  apiTestText: {
    color: '#0047ab',
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },
  footerText: {
    color: 'white',
    marginLeft: 8,
    fontStyle: 'italic',
  },
});

export default LoginScreen; 