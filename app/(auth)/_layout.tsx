import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";

function ConfiguredAuthLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (isSignedIn) {
    return <Redirect href="/" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function AuthLayout() {
  return process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ? <ConfiguredAuthLayout /> : <Redirect href="/(tabs)" />;
}
