<template>
  <div class="new-chat">
    <header class="page-header">
      Yeni Sohbet
    </header>
    <MessageList :messages="list"/>
    <div class="prompt-container">
      <Prompt @submit="onSubmit" :isProcessing="isProcessing" @inputFocus="$emit('promptFocus')"/>
    </div>
  </div>
</template>

<script setup>
import {SecureStoragePlugin} from "capacitor-secure-storage-plugin";
import Prompt from "@/components/Prompt.vue";
import MessageList from "@/components/MessageList.vue";

import {database} from "@/composables/database.js";
import {useOpenAi} from "@/composables/useOpenAi.js";
import {ref} from "vue";
import {useRouter} from "vue-router";

const emits = defineEmits(['updateList', 'promptFocus'])

const api = useOpenAi();
const router = useRouter();

const list = ref([])
const isProcessing = ref(false)

const onSubmit = async (options) => {
  isProcessing.value = true

  const {value} = await SecureStoragePlugin.get({key: 'settings'})
  const parsedValue = JSON.parse(value)
  const instantMode = parsedValue.instantMode

  const promptList = [{
    content: 'Tam markdown desteğine sahip çekilde cevabı formatla.',
    role: 'system'
  }, {
    content: options.text, role: 'user'
  }]

  try {
    if (instantMode) {
      list.value.push({message: options.text, role: 'user'})

      const stream = await api.responses.create({
        model: options.model,
        input: promptList,
        reasoning: {
          effort: options.reasoning
        },
        stream: true
      });

      list.value.push({message: options.text, role: 'assistant'})

      for await (const streamEvent of stream) {
        if (streamEvent.type === "response.output_text.delta") {
          list.value[1].message = list.value[1].message += streamEvent.delta
        }

        if (streamEvent.type === "response.completed") {
          await saveData({
            userMessage: options.text,
            assistantMessage: list.value[1].message,
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
        input: promptList,
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
    console.error(error);
    if (instantMode) {
      list.value[1] = {message: error, role: 'assistant'}
    } else {
      list.value.push({message: error, role: 'assistant'})
    }
  } finally {
    isProcessing.value = false
  }
}

const saveData = async (options) => {
  const chatId = await database.chats.add({
    title: options.userMessage.slice(0, 30),
    updatedDate: new Date()
  })

  await database.chatDetails.add({
    chatId,
    role: 'user',
    message: options.userMessage,
    createdDate: new Date(),
    token: options.inputToken,
  })

  await database.chatDetails.add({
    chatId,
    role: 'assistant',
    message: options.assistantMessage,
    createdDate: new Date(),
    model: {model: options.model, reasoning: options.reasoning},
    token: options.outputToken
  })

  emits('updateList')

  await router.push({name: 'chat', params: {id: chatId}})
}
</script>

<style scoped>
.new-chat {
  height: 100dvh;
  display: flex;
  flex-direction: column;
}

.prompt-container {
  display: flex;
  justify-content: center;
  flex-shrink: 0;
}
</style>
