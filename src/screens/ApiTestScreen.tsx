import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  TextInput,
} from 'react-native';
import { testConnection, getUsers, testMySQLLogin } from '../services/api';
import { COLORS, SPACING } from '../constants/theme';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const ApiTestScreen: React.FC = () => {
  const [testResult, setTestResult] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  
  // Login form state
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  useEffect(() => {
    // Test API connection on component mount
    testApiConnection();
  }, []);

  const testApiConnection = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const response = await testConnection();
      setTestResult(JSON.stringify(response, null, 2));
      setLoading(false);
    } catch (error) {
      console.error('API test error:', error);
      setApiError('Failed to connect to API.');
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const data = await getUsers();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error('Fetch users error:', error);
      setApiError('Failed to fetch users.');
      setLoading(false);
    }
  };
  
  // Test MySQL Login function
  const handleMySQLLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }
    
    setLoading(true);
    setApiError(null);
    
    try {
      console.log('Testing login with:', username);
      const response = await testMySQLLogin(username, password);
      console.log('Login test response:', response);
      
      setTestResult(JSON.stringify(response, null, 2));
      
      if (response && response.success) {
        Alert.alert('Success', 'Login successful!');
      } else {
        const errorMsg = response?.message || 'Unknown error';
        Alert.alert('Failed', errorMsg);
      }
    } catch (error: any) {
      console.error('Login test error:', error);
      setApiError('Failed to test login: ' + (error.message || 'Unknown error'));
      Alert.alert('Error', 'Login test failed: ' + (error.message || 'Connection error'));
    } finally {
      setLoading(false);
    }
  };

  const renderApiStatus = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      );
    }

    if (apiError) {
      return (
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="alert-circle" size={24} color="#F44336" />
          <Text style={styles.errorText}>{apiError}</Text>
        </View>
      );
    }

    return null;
  };

  const renderTestResult = () => {
    if (!testResult && !apiError) return null;

    return (
      <View style={styles.resultContainer}>
        <Text style={styles.resultTitle}>Test Result:</Text>
        <View style={styles.resultContent}>
          <Text style={styles.resultText}>{testResult}</Text>
        </View>
      </View>
    );
  };

  const renderUsers = () => {
    if (!users.length && !apiError) return null;

    return (
      <View style={styles.resultContainer}>
        <Text style={styles.resultTitle}>Users:</Text>
        <ScrollView style={styles.usersList}>
          {users.map((user, index) => (
            <View key={index} style={styles.userItem}>
              <Text style={styles.userName}>{user.username || user.name || 'Unknown'}</Text>
              <Text style={styles.userDetails}>
                {user.email ? `Email: ${user.email}` : ''}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };
  
  const renderLoginForm = () => {
    return (
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>MySQL Login Test</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>
            <Ionicons name="person-outline" size={16} color="#444" style={styles.inputIcon} />
            Username
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter username"
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
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        
        <TouchableOpacity
          style={[styles.button, styles.loginButton]}
          onPress={handleMySQLLogin}
          disabled={loading}
        >
          <Ionicons name="log-in-outline" size={20} color="white" />
          <Text style={styles.buttonText}>Test MySQL Login</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>API Connection Test</Text>
      
      {renderApiStatus()}
      
      <ScrollView style={styles.scrollContainer}>
        {renderLoginForm()}
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.testButton]}
            onPress={testApiConnection}
            disabled={loading}
          >
            <MaterialCommunityIcons name="access-point" size={20} color="white" />
            <Text style={styles.buttonText}>Test API Connection</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.fetchButton]}
            onPress={fetchUsers}
            disabled={loading}
          >
            <MaterialCommunityIcons name="account-group" size={20} color="white" />
            <Text style={styles.buttonText}>Fetch Users</Text>
          </TouchableOpacity>
        </View>
        
        {renderTestResult()}
        {renderUsers()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.m,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginVertical: SPACING.m,
    textAlign: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.m,
  },
  loadingText: {
    marginLeft: SPACING.s,
    color: COLORS.primary,
    fontSize: 16,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFEBEE',
    padding: SPACING.m,
    borderRadius: 8,
    marginVertical: SPACING.m,
  },
  errorText: {
    color: '#D32F2F',
    marginLeft: SPACING.s,
    fontSize: 16,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: SPACING.m,
    marginBottom: SPACING.m,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: SPACING.m,
    color: COLORS.primary,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: SPACING.m,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
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
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: SPACING.m,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.m,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
  loginButton: {
    backgroundColor: '#FF9800',
    marginTop: SPACING.s,
  },
  testButton: {
    backgroundColor: COLORS.primary,
  },
  fetchButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: SPACING.xs,
  },
  scrollContainer: {
    flex: 1,
  },
  resultContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: SPACING.m,
    marginBottom: SPACING.m,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: SPACING.s,
  },
  resultContent: {
    backgroundColor: '#f8f8f8',
    padding: SPACING.s,
    borderRadius: 4,
  },
  resultText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 14,
  },
  usersList: {
    maxHeight: 300,
  },
  userItem: {
    padding: SPACING.s,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userDetails: {
    fontSize: 14,
    color: '#666',
  },
});

export default ApiTestScreen; 