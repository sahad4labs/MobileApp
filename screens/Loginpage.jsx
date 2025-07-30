import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image
} from 'react-native';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react-native'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

function Loginpage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safearea}>
      <View style={styles.container}>

        <View style={styles.logoContainer}>
          <Image style={styles.image} source={require('../assets/4labs_logo.png')} />
          <Text style={styles.subtitle}>RMS Call App</Text>
        </View>

        <View style={styles.welcomeContainer}>
          <Text style={styles.welcome}>Welcome back,</Text>
          <Text style={styles.signinText}>Sign in to your account</Text>
        </View>

        <View style={styles.cont}>
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
              />
            </View>
          </View>

          <View>
            <Text style={styles.inputHeading}>Password</Text>
            <View style={styles.inputContainer}>
              <Lock size={20} color="#B3E5FC" style={styles.icon} />
              <TextInput
                placeholder="**********"
                placeholderTextColor="#B3E5FC"
                secureTextEntry={!showPassword}
                style={styles.input}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff size={20} color="#B3E5FC" />
                ) : (
                  <Eye size={20} color="#B3E5FC" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.logincont}>
          <TouchableOpacity style={styles.loginBtn} onPress={()=>navigation.navigate("Ticket")}>
            <Text style={styles.loginText}>Login</Text>
            <LogIn size={20} color="black"/>
          </TouchableOpacity> 
        </View>

      </View>
    </SafeAreaView>
  );
}

export default Loginpage;

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: '#0380C7',
    padding:5
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center'
  },

  logoContainer: {
    alignItems: 'center',
  
  },
 
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Satoshi-Bold',
    letterSpacing: 2,
  },
  subtitle: {
    color: '#E0F2F1',
    fontFamily: 'Satoshi-Regular',
    fontSize: 16,
    marginTop: 8,
  },
  welcomeContainer: {
    marginTop: 50,
  },
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
  icon: {
    marginRight: 8,
  },
  loginBtn: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 0,
    fontFamily:'Satoshi-Regular'

  },
  loginText: {
    fontSize: 16,
    color: 'black',
    fontWeight: '600',
    fontFamily: 'Satoshi-Medium',
  },
  cont: {
    marginTop: 70,
    marginBottom: 100,
    gap: 24
  },
});