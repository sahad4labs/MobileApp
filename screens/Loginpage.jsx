import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';
import api from '../services/api';

function Loginpage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

const navigation = useNavigation();

const handleLogin = async () => {
  if (!email || !password) {
    Alert.alert("Error", "Please enter both email and password");
    return;
  }

console.log(email,password)

  setLoading(true);
 try {
  const response = await api.post("/login/", { email, password });
  console.log(response);

  if (response.data?.token) {
    await EncryptedStorage.setItem("authToken", response.data.token);
    navigation.reset({ index: 0, routes: [{ name: "Ticket" }] });
  } else {
    Alert.alert("Login Failed", "Invalid response from server");
  }
} catch (error) {
    console.log(error)

  if (error.response?.status === 401) {
    Alert.alert("Login Failed", "Invalid email or password");
  } 
  
} finally {
  setLoading(false);
}

};

  return (
    <SafeAreaView style={styles.safearea}>
      <View style={styles.container}>
        
        <View style={styles.logoContainer}>
          <Image
            style={styles.image}
            source={require('../assets/4labs_logo.png')}
          />
          <Text style={styles.subtitle}>RMS Call App</Text>
        </View>

        {/* Welcome text */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcome}>Welcome back,</Text>
          <Text style={styles.signinText}>Sign in to your account</Text>
        </View>

        {/* Inputs */}
        <View style={styles.cont}>
          {/* Email */}
          <View>
            <Text style={styles.inputHeading}>Email</Text>
            <View style={styles.inputContainer}>
              <Mail size={20} color="#B3E5FC" style={styles.icon} />
              <TextInput
                placeholder="Please enter your email address"
                placeholderTextColor="#B3E5FC"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          {/* Password */}
          <View>
            <Text style={styles.inputHeading}>Password</Text>
            <View style={styles.inputContainer}>
              <Lock size={20} color="#B3E5FC" style={styles.icon} />
              <TextInput
                placeholder="**********"
                placeholderTextColor="#B3E5FC"
                secureTextEntry={!showPassword}
                style={styles.input}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#B3E5FC" />
                ) : (
                  <Eye size={20} color="#B3E5FC" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Login button */}
        <View style={styles.logincont}>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="black" />
            ) : (
              <>
                <Text style={styles.loginText}>Login</Text>
                <LogIn size={20} color="black" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default Loginpage;

// 💅 styles remain the same as your original
const styles = StyleSheet.create({
  safearea: { flex: 1, backgroundColor: '#0380C7', padding: 5 },
  container: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  logoContainer: { alignItems: 'center' },
  subtitle: {
    color: '#E0F2F1',
    fontFamily: 'Satoshi-Regular',
    fontSize: 16,
    marginTop: 8,
  },
  welcomeContainer: { marginTop: 50 },
  welcome: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 33,
    color: '#fff',
    fontWeight: '600',
  },
  signinText: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 17,
    color: '#E0F2F1',
    marginTop: 5,
  },
  inputContainer: {
    backgroundColor: 'transparent',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: '#B3E5FC',
    paddingVertical: 8,
  },
  inputHeading: {
    fontFamily: 'Satoshi-Medium',
    fontSize: 16,
    color: '#fff',
  },
  input: {
    flex: 1,
    height: 40,
    color: '#fff',
    paddingLeft: 8,
    fontFamily: 'Satoshi-Regular',
    fontSize: 14,
  },
  icon: { marginRight: 8 },
  loginBtn: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 0,
    fontFamily: 'Satoshi-Regular',
  },
  loginText: {
    fontSize: 16,
    color: 'black',
    fontWeight: '600',
    fontFamily: 'Satoshi-Medium',
  },
  cont: { marginTop: 70, marginBottom: 100, gap: 24 },
});
