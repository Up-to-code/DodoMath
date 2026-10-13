import earth from "@/assets/images/earth.png";
import mascotAuth from "@/assets/images/mascot-auth.png";
import mascotWelcome from "@/assets/images/mascot-welcome.png";
import mascotLogo from "@/assets/images/moscot-logo.png";
import palace from "@/assets/images/palace.png";
import streakFire from "@/assets/images/streak-fire.png";
import treasure from "@/assets/images/treasure.png";

export const images = {
  companions: {
    fox: {
      idle: require("@/assets/characters/fox/idle.png"),
      thinking: require("@/assets/characters/fox/thinking.png"),
      success: require("@/assets/characters/fox/success.png"),
      retry: require("@/assets/characters/fox/retry.png"),
    },
    nia: {
      idle: require("@/assets/characters/nia/idle.png"),
      thinking: require("@/assets/characters/nia/thinking.png"),
      success: require("@/assets/characters/nia/success.png"),
      retry: require("@/assets/characters/nia/retry.png"),
    },
    orbit: {
      idle: require("@/assets/characters/orbit/idle.png"),
      thinking: require("@/assets/characters/orbit/thinking.png"),
      success: require("@/assets/characters/orbit/success.png"),
      retry: require("@/assets/characters/orbit/retry.png"),
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
