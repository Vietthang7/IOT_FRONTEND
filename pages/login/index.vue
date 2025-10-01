<!-- filepath: c:\IOT\Frontend\pages\login\index.vue -->
<template>
  <div class="login-container bg-liner-1 min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Login Card with Glassmorphism -->
    <div class="glass-card w-full max-w-md mx-auto p-10 rounded-2xl shadow-mb backdrop-blur relative z-10 animateZoomIn">
      <!-- Header Section -->
      <div class="text-center mb-8 animateTop">
        <!-- Logo Container -->
        <div class="icon-container w-20 h-20 bg-liner-1 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg hover:scale-105 transition-transform duration-300">
          <IconHome class="w-12 h-12 text-white" />
        </div>
        
        <h1 class="txt-3xl text-primary mb-2 font-bold">Welcome Obito</h1>
        <p class="txt-base text-gray-600">Sign in to your Smart Home account</p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-6">
        <!-- Username Field -->
        <div class="form-group animateLeft">
          <label for="username" class="flex items-center gap-2 txt-sm font-semibold text-primary mb-2">
            Username
          </label>
          <input
            id="username"
            v-model="loginForm.username"
            type="text"
            placeholder="Enter your username"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl txt-base text-gray-900 transition-all duration-300 focus:border-primary focus:ring-4 focus:ring-primary/20 focus:outline-none hover:border-gray-300"
            :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500/20': errors.username }"
            :disabled="isLoading"
            required
          />
          <span v-if="errors.username" class="txt-xs text-red-500 mt-1 block">{{ errors.username }}</span>
        </div>

        <!-- Password Field -->
        <div class="form-group animateRight">
          <label for="password" class="flex items-center gap-2 txt-sm font-semibold text-primary mb-2">
            Password
          </label>
          <div class="relative">
            <input
              id="password"
              v-model="loginForm.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter your password"
              class="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl txt-base  text-gray-900 transition-all  duration-300 focus:border-primary focus:ring-4 focus:ring-primary/20 focus:outline-none hover:border-gray-300"
              :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500/20': errors.password }"
              :disabled="isLoading"
              required
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-colors p-1 rounded"
              :disabled="isLoading"
            >
              <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
            </button>
          </div>
          <span v-if="errors.password" class="txt-xs text-red-500 mt-1 block">{{ errors.password }}</span>
        </div>
        <!-- Error Message -->
        <div v-if="errors.general" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 animateZoomIn">
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span class="txt-sm">{{ errors.general }}</span>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full bg-liner-1 text-white py-3 px-6 rounded-xl txt-base font-semibold transition-all duration-300 hover:scale-102 hover:shadow-lg active:scale-98 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 animateZoomInBottom"
          :disabled="isLoading"
        >
          <div v-if="isLoading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>{{ isLoading ? 'Signing in...' : 'Sign In' }}</span>
        </button>
      </form>

      <!-- Footer -->
      <div class="text-center mt-8 pt-6 border-t border-gray-200 animateZoomIn">
        <p class="txt-sm text-gray-600">
          Don't have an account? 
          <a href="#" class="text-primary hover:text-secondary font-semibold transition-colors">Contact Admin</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import IconHome from '@/components/global/IconHome.vue'

// Prevent access if already logged in
definePageMeta({
  layout: false,
  middleware: 'guest'
})

const router = useRouter()
const { restAPI } = useAPI()

// Form state
const loginForm = reactive({
  username: '',
  password: '',
})

const showPassword = ref(false)
const isLoading = ref(false)

// Error handling
const errors = reactive({
  username: '',
  password: '',
  general: ''
})

// Clear errors
const clearErrors = () => {
  errors.username = ''
  errors.password = ''
  errors.general = ''
}

// Validate form
const validateForm = () => {
  clearErrors()
  let isValid = true

  if (!loginForm.username.trim()) {
    errors.username = 'Username is required'
    isValid = false
  }

  if (!loginForm.password.trim()) {
    errors.password = 'Password is required'
    isValid = false
  } else if (loginForm.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
    isValid = false
  }

  return isValid
}

// Handle login
const handleLogin = async () => {
  if (!validateForm()) return

  isLoading.value = true
  clearErrors()

  try {
    const response = await restAPI.stores.login({
      body: {
        username: loginForm.username,
        password: loginForm.password
      }
    })
    // Handle successful login
    if (response.code == 200) {
      console.log("chay vao day")
      // Store token
      const token = useCookie('auth-token', {
        default: () => null,
        maxAge: loginForm.rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24, // 30 days or 1 day
        secure: true,
        sameSite: 'strict'
      })
      
      token.value = response.data.token
      // Redirect to dashboard
      await router.push('/')
      
    } else {
      errors.general = response.message || 'Login failed. Please try again.'
    }
  } catch (error) {
    console.error('❌ Login error:', error)
    
    if (error.statusCode === 401) {
      errors.general = 'Invalid username or password'
    } else if (error.statusCode === 429) {
      errors.general = 'Too many login attempts. Please try again later.'
    } else {
      errors.general = 'Network error. Please check your connection.'
    }
  } finally {
    isLoading.value = false
  }
}

// Auto-focus on username field
onMounted(() => {
  const usernameField = document.getElementById('username')
  if (usernameField) {
    usernameField.focus()
  }
})
</script>

<style scoped>
/* Custom animations using existing classes */
.floating-circle {
  animation: float 6s ease-in-out infinite;
}

.circle-1 {
  animation-delay: 0s;
}

.circle-2 {
  animation-delay: 2s;
}

.circle-3 {
  animation-delay: 4s;
}

/* Hover effects for form elements */
.form-group input:focus {
  transform: translateY(-1px);
}

.form-group input:disabled {
  background-color: #f9fafb;
  cursor: not-allowed;
}

/* Enhanced button effects */
button[type="submit"]:hover:not(:disabled) {
  background: linear-gradient(135deg, #004DE8 0%, #133D85 100%);
}

/* Icon container glow effect */
.icon-container {
  position: relative;
}

.icon-container::before {
  content: '';
  position: absolute;
  inset: -2px;
  background: linear-gradient(45deg, #133D85, #004DE8, #133D85);
  border-radius: inherit;
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.icon-container:hover::before {
  opacity: 0.3;
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .glass-card {
    margin: 1rem;
    padding: 2rem 1.5rem;
  }
  
  .icon-container {
    width: 4rem;
    height: 4rem;
  }
  
  .icon-container svg {
    width: 2rem;
    height: 2rem;
  }
}

/* Enhanced glassmorphism */
.glass-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 8px 32px 0 rgba(31, 38, 135, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/* Form input enhancements */
input:focus {
  box-shadow: 0 0 0 3px rgba(19, 61, 133, 0.1);
}

/* Loading spinner enhancement */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>