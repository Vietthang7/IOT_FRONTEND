import { defineConfig, presetAttributify, presetIcons, presetTypography, transformerDirectives, transformerVariantGroup } from "unocss"
import presetWind3 from "@unocss/preset-wind3"

export default defineConfig({
  shortcuts: [
    // Text utilities với responsive
    ["txt-xs", "text-[12px] leading-[14px] sm:text-[14px] sm:leading-[16px]"],
    ["txt-sm", "text-sm font-normal"],
    ["txt-base", "text-[14px] leading-[18px] sm:text-[16px] sm:leading-[20px]"],
    ["txt-md", "text-base"],
    ["txt-lg", "text-[16px] leading-[22px] sm:text-[18px] sm:leading-[24px] font-medium"],
    ["txt-xl", "text-lg leading-6 sm:text-xl sm:leading-7 font-medium"],
    ["txt-2xl", "text-xl leading-7 sm:text-[24px] sm:leading-[32px] font-semibold"],
    ["txt-3xl", "text-2xl leading-8 sm:text-[28px] sm:leading-[32px] font-semibold"],
    
    // Responsive containers
    ["container-responsive", "w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12"],
    ["card-responsive", "rounded-lg lg:rounded-xl p-4 lg:p-6 shadow-md hover:shadow-lg transition-shadow"],
    
    // Button responsive
    ["btn-responsive", "px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base rounded-lg transition-colors"],
    
    // Layout utilities
    ["sidebar-width", "w-64 lg:w-40 xl:w-48"],
    ["content-padding", "p-4 lg:p-6 xl:p-10"],
    
    // ...existing shortcuts...
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
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        l1360: "1360px",
        l1440: "1440px",
        "2xl": "1536px",
        // Thêm breakpoint cho 1920x1080
        "3xl": "1920px",
      },
    },
    colors: {
      primary: "#133D85",
      secondary: "#004DE8",
      base: {
        text: "#FFFFFF",
        text_2: "#000000",
      },
      extra: {
        2: "#000000",
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
      // Thêm breakpoint cho 1920x1080
      "3xl": "1920px",
    },
  },
  presets: [presetAttributify(), presetWind3(), presetIcons(), presetTypography()],
  transformers: [transformerDirectives(), transformerVariantGroup()],
})