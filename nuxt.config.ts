// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@unocss/nuxt"],
  css: ["@/assets/main.css", "@/assets/tailwind.css"],
  runtimeConfig: {
    public: {
      baseUrl: "http://127.0.0.1:3002/",
      adminUrl: "",
      propertyID: "",
    },
  },
  // Thêm cấu hình để expose server
  devServer: {
    host: '0.0.0.0'
  },
});
