import "../global.css";

import { posthog } from "@/lib/posthog";
import { useLanguageStore } from "@/store/languageStore";
import { useUser, ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { useFonts } from "expo-font";
import { Stack, useGlobalSearchParams, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { PostHogProvider } from "posthog-react-native";
import { useEffect, useRef } from "react";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

SplashScreen.preventAutoHideAsync();

function ClerkIdentifier() {
  const { isSignedIn, user, isLoaded } = useUser();
  const { selectedLanguage } = useLanguageStore();

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;
    posthog.identify(user.id, {
      $set_once: { signup_date: new Date().toISOString() },
      $set: { preferred_language: selectedLanguage ?? null },
    });
  }, [isLoaded, isSignedIn, user, selectedLanguage]);

  return null;
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "Nunito-Regular": require("../assets/fonts/Nunito-Regular.ttf"),
    "Nunito-ExtraBold": require("../assets/fonts/Nunito-ExtraBold.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
  });

  const pathname = usePathname();
  const params = useGlobalSearchParams();
  const previousPathname = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      posthog.screen(pathname, {
        previous_screen: previousPathname.current ?? null,
        ...params,
      });
      previousPathname.current = pathname;
    }
  }, [pathname, params]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const screens = <Stack screenOptions={{headerShown:false}} />;
  if (!publishableKey) return screens;
  return <PostHogProvider client={posthog}><ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}><ClerkIdentifier />{screens}</ClerkProvider></PostHogProvider>;
}
