import { defineConfig, presetAttributify, presetIcons, presetTypography, transformerDirectives, transformerVariantGroup } from "unocss"
import presetWind3 from "@unocss/preset-wind3"
export default defineConfig({
  shortcuts: [
    ["txt-xs", "text-[14px] leading-[16px]"],
    ["txt-sm", "text-sm font-normal"],
    ["txt-base", "text-[16px] leading-[20px]"],
    ["txt-md", "text-base"],
    ["txt-lg", "text-[18px] leading-[24px] font-medium"],
    ["txt-xl", "text-5 leading-7 font-medium"],
    ["txt-2xl", "text-[24px] leading-[32px] font-semibold"],
    ["txt-3xl", "text-[28px] leading-[32px] font-semibold"],
    ["bg-liner-1", "bg-gradient-to-r from-primary to-secondary text-white"],
    ["bg-liner-2", "bg-white bg-gradient-to-t from-[#E1EDF1]/80 to-[#E1EDF1]/80"],
  ],
  theme: {
    container: {
      center: true,
      maxWidth: {
        xs: "320px",
        "2xs": "390px",
        s350: "350px",
        s400: "400px",
        psm: "500px",
        sm: "570px",
        md: "700px",
        lg: "970px",
        xl: "1200px",
        l1360: "1300px",
        l1440: "1380px",
        "2xl": "1440px",
      },
    },
    colors: {
      primary: "#133D85",
      secondary: "#004DE8",
      base: {
        text: "#4C5262",
        text_2: "#999999",
      },
      extra: {
        2: "#B1B5C3",
      },
      bg: {
        primary: "#E1EDF1CC",
        secondary: "#FCFCFC",
        terriary: "#F7DCCA",
        gray: {
          1: "#E3E3E3",
        },
      },
    },

    breakpoints: {
      xs: "320px",
      "2xs": "390px",
      s350: "350px",
      s400: "400px",
      psm: "576px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      l1360: "1360px",
      l1440: "1440px",
      "2xl": "1536px",
    },
  },
  presets: [presetAttributify(), presetWind3(), presetIcons(), presetTypography()],
  transformers: [transformerDirectives(), transformerVariantGroup()],
})
