import earth from "@/assets/images/earth.png";
import mascotAuth from "@/assets/images/mascot-auth.png";
import mascotWelcome from "@/assets/images/mascot-welcome.png";
import mascotLogo from "@/assets/images/moscot-logo.png";
import palace from "@/assets/images/palace.png";
import streakFire from "@/assets/images/streak-fire.png";
import treasure from "@/assets/images/treasure.png";

export const images = {
  foxHelloAtlas: require("@/assets/animations/fox/hello-atlas.png"),
  foxFeedback: {
    success: require("@/assets/animations/fox/feedback/success-atlas.png"),
    retry: require("@/assets/animations/fox/feedback/retry-atlas.png"),
  },
  companions: {
    fox: {
      idle: require("@/assets/animations/fox/idle.png"),
      thinking: require("@/assets/animations/fox/thinking.png"),
      success: require("@/assets/animations/fox/feedback/success-hold.png"),
      retry: require("@/assets/animations/fox/feedback/retry-hold.png"),
    },
    nia: {
      idle: require("@/assets/characters/nia/registered/idle.png"),
      thinking: require("@/assets/characters/nia/registered/thinking.png"),
      success: require("@/assets/characters/nia/registered/success.png"),
      retry: require("@/assets/characters/nia/registered/retry.png"),
    },
    orbit: {
      idle: require("@/assets/characters/orbit/registered/idle.png"),
      thinking: require("@/assets/characters/orbit/registered/thinking.png"),
      success: require("@/assets/characters/orbit/registered/success.png"),
      retry: require("@/assets/characters/orbit/registered/retry.png"),
    },
  },

  dodoConcept: require("@/assets/images/dodo-concept.png"),
  duoPath: require("@/assets/images/duo-path.png"),
  earth,
  mascotAuth,
  mascotWelcome,
  mascotLogo,
  palace,
  streakFire,
  treasure,
} as const;
