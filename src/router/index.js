import {createRouter, createWebHistory} from 'vue-router'
import Chat from '@/views/Chat.vue'
import Settings from "@/views/Settings.vue";
import NewChat from "@/views/NewChat.vue";
import {SecureStoragePlugin} from "capacitor-secure-storage-plugin";
import {initializeOpenAIClient} from "@/composables/useOpenAi.js";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'newChat',
      component: NewChat,
    },
    {
      path: '/chat/:id',
      name: 'chat',
      component: Chat,
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
    }
  ],
})

router.beforeEach(async (to, from) => {
  if (to.name !== 'settings') {
    try {
      const {value} = await SecureStoragePlugin.get({key: 'settings'})
      if (value) {
        const parsedValue = JSON.parse(value)
        if (parsedValue.key) {
          await initializeOpenAIClient(parsedValue.key);
        } else {
          return {name: 'settings'}
        }
      } else {
        return {name: 'settings'}
      }
    } catch (error) {
      return {name: 'settings'}
    }
  }
})

export default router
