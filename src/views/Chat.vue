<template>
  <header class="page-header">
    {{ chatTitle }}
  </header>
  <MessageList :messages="list"/>
  <div class="footer">
    <Prompt @submit="onSubmit" :isProcessing="isProcessing" @inputFocus="$emit('promptFocus')"/>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import Prompt from "@/components/Prompt.vue";
import {database} from "@/composables/database.js";
import {onBeforeRouteUpdate, useRoute, useRouter} from "vue-router";
import {useOpenAi} from "@/composables/useOpenAi.js";
import MessageList from "@/components/MessageList.vue";
import {SecureStoragePlugin} from "capacitor-secure-storage-plugin";
import {marked} from 'marked';

defineEmits(['promptFocus'])

const route = useRoute()
const router = useRouter()
const api = useOpenAi();
const chatId = ref(parseInt(route.params.id));

const list = ref([])
const chatTitle = ref('')
const isProcessing = ref(false)

const onSubmit = async (options) => {
  isProcessing.value = true
  const {value} = await SecureStoragePlugin.get({key: 'settings'})
  const parsedValue = JSON.parse(value)
  const instantMode = parsedValue.instantMode
  try {
    const messageList = list.value.map((item) => ({content: item.message, role: item.role}))
    messageList.push({
      content: 'Tam markdown desteğine sahip çekilde cevabı formatla.',
      role: 'system'
    })
    messageList.push({content: options.text, role: 'user'})

    if (instantMode) {
      list.value.push({message: options.text, role: 'user'})

      const stream = await api.responses.create({
        model: options.model,
        input: messageList,
        reasoning: {
          effort: options.reasoning
        },
        stream: true
      });

      list.value.push({message: options.text, role: 'assistant'})

      for await (const streamEvent of stream) {
        if (streamEvent.type === "response.output_text.delta") {
          list.value[list.value.length - 1].message = list.value[list.value.length - 1].message += streamEvent.delta
        }

        if (streamEvent.type === "response.completed") {
          await saveData({
            userMessage: options.text,
            assistantMessage: list.value[list.value.length - 1].message,
            model: options.model,
            reasoning: options.reasoning,
            inputToken: streamEvent.response.usage.input_tokens,
            outputToken: streamEvent.response.usage.output_tokens
          })
        }
      }
    } else {
      const response = await api.responses.create({
        model: options.model,
        input: messageList,
        reasoning: {
          effort: options.reasoning
        }
      });
      await saveData({
        userMessage: options.text,
        assistantMessage: response.output_text,
        model: options.model,
        reasoning: options.reasoning,
        inputToken: response.usage.input_tokens,
        outputToken: response.usage.output_tokens
      })
    }
  } catch (error) {
    console.error(error)
    if (instantMode) {
      list.value[list.value.length - 1] = {message: error, role: 'assistant'}
    } else {
      list.value.push({message: error, role: 'assistant'})
    }
  } finally {
    isProcessing.value = false
  }
}

const saveData = async (options) => {
  await database.chatDetails.add({
    chatId: chatId.value,
    role: 'user',
    message: options.userMessage,
    createdDate: new Date(),
    token: options.inputToken,
  })

  await database.chatDetails.add({
    chatId: chatId.value,
    role: 'assistant',
    message: options.assistantMessage,
    createdDate: new Date(),
    model: {model: options.model, reasoning: options.reasoning},
    token: options.outputToken
  })

  await getData()
}

const getData = async () => {
  const chat = await database.chats.get(chatId.value)
  if (!chat) {
    await router.push({name: 'newChat'});
    return
  }

  chatTitle.value = chat.title

  const messages = await database.chatDetails.where('chatId').equals(chatId.value).sortBy('messageId')
  if (messages.length > 0) {
    list.value = messages.map(item => {
        const chatItem = {
          createdDate: new Intl.DateTimeFormat("tr-TR", {
            dateStyle: "short",
            timeStyle: "short",
          }).format(item.createdDate),
          role: item.role,
          message: marked(item.message),
          token: item.token
        }

        if (item.model) {
          switch (item.model.model) {
            case 'gpt-5':
              chatItem.model = 'GPT-5'
              break;
            case 'gpt-5-mini':
              chatItem.model = 'GPT-5 Mini'
              break;
            case 'gpt-5-nano':
              chatItem.model = 'GPT-5 Nano'
              break;
          }

          switch (item.model.reasoning) {
            case 'minimal':
              chatItem.reasoning = 'Minimum'
              break;
            case 'low':
              chatItem.reasoning = 'Düşük'
              break;
            case 'medium':
              chatItem.reasoning = 'Orta'
              break;
            case 'high':
              chatItem.reasoning = 'Yüksek'
              break;
          }
        }
        return chatItem
      }
    )
  }
}

onMounted(() => {
  getData()
})

onBeforeRouteUpdate((to, from) => {
  chatId.value = parseInt(to.params.id);
  getData()
})

</script>

<style scoped>
.footer {
  flex-shrink: 0;
  padding: 25px;
  display: flex;
  justify-content: center;
}
</style>
