import React, { useCallback, useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Pressable,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

WebBrowser.maybeCompleteAuthSession();

export default function Component() {
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const [isLoading, setIsLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const translateYAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.5)),
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      }),
    ]).start();
  }, []);

  const onPress = useCallback(async () => {
    setIsLoading(true);
    try {
      const { createdSessionId } = await startOAuthFlow({
        redirectUrl: Linking.createURL("/(tabs)/home", { scheme: "rizeapp" }),
      });
      if (createdSessionId) {
        console.log("Welcome aboard! Your session is ready:", createdSessionId);
      }
    } catch (err) {
      console.error("OAuth error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [startOAuthFlow]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#121212", "#1e1e1e", "#2a0a2a"]} style={styles.gradient}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }, { translateY: translateYAnim }],
            },
          ]}
        >
          <View style={styles.topSection}>
            <View style={styles.logoContainer}>
              <MaterialIcons name="music-note" size={36} color="#ff1493" style={styles.icon} />
              <Text style={styles.logoText}>
                <Text style={styles.rizeText}>Rize</Text>
                <Text style={styles.playText}>PLAY</Text>
              </Text>
            </View>
            <Text style={styles.tagline}>Drop the beat, not the vibe</Text>
          </View>

          <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>Your Soundtrack,{`\n`}Your Rules</Text>
            <Text style={styles.heroSubtitle}>Unlimited bops. Zero cap</Text>
          </View>

          <View style={styles.buttonContainer}>
            <Pressable
              onPress={onPress}
              style={({ pressed }) => [styles.signUpButton, pressed && styles.signUpButtonPressed]}
              disabled={isLoading}
            >
              <Text style={styles.signUpButtonText}>
                {isLoading ? "Loading..." : "Get Started! 🚀"}
              </Text>
            </Pressable>
            <Text style={styles.termsText}>
              No 🧢, by tapping you're cool with our Terms and Privacy Policy
            </Text>
          </View>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
}

function Feature({ icon, text }) {
  return (
    <View style={styles.featureItem}>
      <Ionicons name={icon} size={24} color="#ff1493" />
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  topSection: {
    alignItems: "flex-start",
    marginTop: 40,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
  },
  logoText: {
    fontSize: 36,
    fontWeight: "bold",
  },
  rizeText: {
    color: "#ffffff",
  },
  playText: {
    color: "#ff1493",
  },
  tagline: {
    color: "#a0a0a0",
    fontSize: 16,
    marginTop: 8,
    fontWeight: "500",
  },
  heroSection: {
    alignItems: "flex-start",
    marginBottom: 40,
    marginTop: "auto",
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: "900",
    color: "#ffffff",
    marginBottom: 10,
    lineHeight: 52,
  },
  heroSubtitle: {
    fontSize: 20,
    color: "#ff1493",
    marginBottom: 20,
    fontWeight: "600",
  },
  // features: {
  //   marginTop: 20,
  // },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  featureText: {
    color: "#ffffff",
    marginLeft: 10,
    fontSize: 16,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  signUpButton: {
    backgroundColor: "#ff1493",
    paddingVertical: 16,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  signUpButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  signUpButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  termsText: {
    color: "#a0a0a0",
    fontSize: 12,
    textAlign: "center",
  },
});
