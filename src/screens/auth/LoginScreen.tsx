import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useKeyboardAnimation } from 'react-native-keyboard-controller';

// New Imports (Points to your local UI components) 

import { Image, Link, LinkText, ButtonSpinner, Center, ScrollView, Box, VStack, Input, InputField, Button, ButtonText, Text, FormControl, FormControlError, FormControlErrorText, FormControlLabel, FormControlLabelText, HStack, Checkbox, CheckboxIndicator, CheckboxIcon, CheckboxLabel } from '@/src/components/common/GluestackUI';

import authService from '@/src/services/authService';
import { useAuth } from '@/src/context/AuthContext';
import { CheckIcon } from '@/src/components/common/IconUI';
import { AnimateError } from '../common/AnimateError';

export default function LoginScreen({ navigation }: any) {
  const { progress } = useKeyboardAnimation();
  const { login } = useAuth(); // Get login from context

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const validateForm = () => {
    const newErrors: any = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // 
  const handleLogin = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      // Ensure key names match your PHP (PhoneNumber vs email)
      const response = await login({
        phoneNumber: email,
        password: password,
        rememberMe: rememberMe
      });

      // Based on our optimized PHP code, we check for access_token
      if (response.success) {
        // Save both tokens to AsyncStorage
        console.log("Login successful");

        // navigation.replace('Home');
      } else {
        setErrors((pre: any) => ({
          ...pre,
          password: "Invalid phone number/email or password"
        }));

      }
    } catch (error: any) {
      console.log(error);
      const errorMsg = error.response?.message || 'Network error.';
      Alert.alert('Error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      {/* 1. bg="$background" becomes className="bg-background-0" */}
      <ScrollView className="flex-1 bg-background-0">
        <Center className="flex-1 px-4 py-8">
          <Box className="w-full max-w-[384px]">

            {/* Logo Section */}
            <Box className="items-center mb-10 mt-4">
              <Image
                source={require('../../assets/images/aglogo.png')}
                alt="App Logo"
                className="mb-4 h-32 w-32" // Using Tailwind for size
              />
              <Text className="text-4xl font-bold mb-2">Welcome Back</Text>
              <Text className="text-center">
                Sign in to continue to your account
              </Text>
            </Box>

            {/* Form Section */}
            <VStack className="gap-4">
              {/* Email */}
              <FormControl isInvalid={!!errors.email}>
                <FormControlLabel className="mb-1">
                  <FormControlLabelText size='lg'>Email</FormControlLabelText>
                </FormControlLabel>
                <Input className="h-16" size='lg'>
                  <InputField
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </Input>
                <AnimateError isVisible={errors.email}>
                  {errors.email}
                </AnimateError>

              </FormControl>

              {/* Password */}
              <FormControl isInvalid={!!errors.password}>
                <FormControlLabel className="mb-1">
                  <FormControlLabelText size='lg'>Password</FormControlLabelText>
                </FormControlLabel>
                <Input className="h-16" size='lg'>
                  <InputField
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </Input>
                <AnimateError isVisible={errors.password}>
                  {errors.password}
                </AnimateError>

              </FormControl>

              {/* Remember Me & Forgot Password Row */}
              <HStack className="justify-between items-center mt-2">
                <Checkbox
                  size="md"
                  value="remember"
                  isChecked={rememberMe}
                  onChange={(val) => setRememberMe(val)}
                  aria-label="Remember me"
                >
                  <CheckboxIndicator className="mr-2">
                    <CheckboxIcon as={CheckIcon} />
                  </CheckboxIndicator>
                  <CheckboxLabel className="text-sm text-typography-500">Remember Me</CheckboxLabel>
                </Checkbox>

                <Link onPress={() => navigation.navigate('forgotpwd', {
                  identifier: email
                })}>
                  <LinkText size='md' className="text-primary-500 text-sm no-underline">
                    Forgot Password?
                  </LinkText>
                </Link>
              </HStack>


              {/* Login Button */}
              <Button
                size='xl'
                className="mt-4 bg-primary-700"
                onPress={handleLogin}
                isDisabled={loading}
              >
                {loading && <ButtonSpinner className="mr-2" />}
                <ButtonText>{loading ? 'Signing in...' : 'Sign In'}</ButtonText>
              </Button>

              {/* Sign Up Link */}
              <Box className="flex-row justify-center mt-6">
                <Text className="text-typography-500 mr-2">Don't have an account?</Text>
                <Link onPress={() => navigation.navigate('Signup')}>
                  <LinkText className="text-primary-500 font-semibold no-underline">
                    Sign Up
                  </LinkText>
                </Link>
              </Box>
              <Link onPress={() => navigation.navigate('ThemeSettings')}>
                <LinkText className="text-primary-500 font-semibold no-underline">
                  Theme Settings
                </LinkText>
              </Link>

              <Link onPress={() => navigation.navigate('profilepwdupdate', {
                userid: "",
                mobile: "",
                email: "",
                name: "",
              })}>
                <LinkText className="text-primary-500 font-semibold no-underline">
                  Update Profile Password
                </LinkText>
              </Link>

              <Link onPress={() => navigation.navigate('updatepwd', {
                identifier: ""
              })}>
                <LinkText className="text-primary-500 font-semibold no-underline">
                  Reset Password
                </LinkText>
              </Link>

            </VStack>
          </Box>
        </Center>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}