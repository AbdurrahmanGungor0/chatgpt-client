<template>
  <header class="page-header">
    Ayarlar
  </header>
  <div class="card-wrapper">
    <div class="card">
      <label for="key">ChatGtp Api Key</label>
      <div class="input-wrapper">
        <input id="key" v-model="key" ref="keyInput"
               class="input" autocomplete="off" :disabled="isKeyDisabled"
               :placeholder="originalKey ? '****************': 'OpenAi api key\'inizi giriniz...'"
               @blur="onBlurKeyInput"/>
        <button class="btn btn-primary" @click="onClickEditKey" v-show="isKeyDisabled">
          <svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" class="icon">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <g fill="none" fill-rule="evenodd" stroke="#7D7461" stroke-linecap="round"
                 stroke-linejoin="round" transform="translate(3 3)">
                <path
                  d="m7 1.5h-4.5c-1.1045695 0-2 .8954305-2 2v9.0003682c0 1.1045695.8954305 2 2 2h10c1.1045695 0 2-.8954305 2-2v-4.5003682"></path>
                <path
                  d="m14.5.46667982c.5549155.5734054.5474396 1.48588056-.0167966 2.05011677l-6.9832034 6.98320341-3 1 1-3 6.9874295-7.04563515c.5136195-.5178979 1.3296676-.55351813 1.8848509-.1045243z"></path>
                <path d="m12.5 2.5.953 1"></path>
              </g>
            </g>
          </svg>
        </button>
      </div>

      <label class="instant-mode-label" for="instant-mode">Akış Modu</label>
      <div class="checkbox-wrapper">
        <input id="instant-mode" v-model="instantMode" type="checkbox" class="input"/>
      </div>
      <span
        class="instant-mode-warning">(OpenAI hesabınız biyometrik olarak onaylanmış olmalıdır)</span>
      <div class="save-button-wrapper">
        <button class="btn btn-sm btn-success" :disabled="isSaveButtonDisabled"
                :class="{'disabled': isSaveButtonDisabled}"
                @click="onClickSave">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M18.1716 1C18.702 1 19.2107 1.21071 19.5858 1.58579L22.4142 4.41421C22.7893 4.78929 23 5.29799 23 5.82843V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H18.1716ZM4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21L5 21L5 15C5 13.3431 6.34315 12 8 12L16 12C17.6569 12 19 13.3431 19 15V21H20C20.5523 21 21 20.5523 21 20V6.82843C21 6.29799 20.7893 5.78929 20.4142 5.41421L18.5858 3.58579C18.2107 3.21071 17.702 3 17.1716 3H17V5C17 6.65685 15.6569 8 14 8H10C8.34315 8 7 6.65685 7 5V3H4ZM17 21V15C17 14.4477 16.5523 14 16 14L8 14C7.44772 14 7 14.4477 7 15L7 21L17 21ZM9 3H15V5C15 5.55228 14.5523 6 14 6H10C9.44772 6 9 5.55228 9 5V3Z"
                    fill="white"></path>
            </g>
          </svg>
          <span class="text">Kaydet</span>
        </button>
      </div>

      <div class="result" v-if="resultMessage"
           :class="resultMessageIsSuccess ? 'success' : 'error'">{{ resultMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, nextTick, onMounted, ref, useTemplateRef} from "vue";
import {SecureStoragePlugin} from "capacitor-secure-storage-plugin";
import {initializeOpenAIClient} from "@/composables/useOpenAi.js";

const keyInput = useTemplateRef('keyInput')

let originalKey = ref('')
const key = ref('')
const instantMode = ref(false)
const isKeyDisabled = ref(false)
const resultMessage = ref('')
const resultMessageIsSuccess = ref()

const isSaveButtonDisabled = computed(() => {
  return !key.value && !originalKey.value
})

const onClickSave = async () => {
  const {value} = await SecureStoragePlugin.set({
    key: 'settings',
    value: JSON.stringify({key: key.value || originalKey.value, instantMode: instantMode.value})
  })

  if (value) {
    resultMessage.value = 'Ayarlar kaydedildi!'
    resultMessageIsSuccess.value = true
    await initializeOpenAIClient(key.value || originalKey.value, true)
    if (key.value) {
      originalKey.value = key.value
    }
    key.value = ''
    isKeyDisabled.value = true;
  } else {
    resultMessage.value = 'Hata oluştu! Ayarlar kaydedilemedi!'
    resultMessageIsSuccess.value = false
  }

  setTimeout(() => {
    resultMessage.value = ''
  }, 3000)
}

const onClickEditKey = async () => {
  isKeyDisabled.value = false;
  await nextTick()
  keyInput.value.focus();
}

const onBlurKeyInput = () => {
  if (originalKey.value && !key.value) {
    isKeyDisabled.value = true;
  }
}

onMounted(async () => {
  try {
    const {value} = await SecureStoragePlugin.get({key: 'settings'});
    if (value) {
      const parsedValue = JSON.parse(value);
      originalKey.value = parsedValue.key
      instantMode.value = parsedValue.instantMode
      isKeyDisabled.value = true;
    }
  } catch (e) {
  }
})
</script>

<style scoped>
header {
  font-size: 20px;
  font-weight: bold;
  color: #7D7461;
  flex-shrink: 0;
  margin-bottom: 10px;
}

.card-wrapper {
  display: flex;
  justify-content: center;

  .card {
    width: 100%;
    max-width: 500px;
    padding: 25px;
    border: 1px solid #e4e4e4;
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;

    .instant-mode-label {
      margin-top: 15px;
      padding-top: 10px;
      border-top: 1px solid #b8b8b8;
      display: block;
    }

    & label {
      margin-bottom: 10px;
      display: block;
    }

    & .input-wrapper {
      display: flex;
      position: relative;

      & button {
        position: absolute;
        right: 2px;
        top: 2px;
        height: calc(100% - 4px);
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;

        .icon {
          width: 20px;
        }
      }
    }

    & .checkbox-wrapper {
      display: flex;
      justify-content: start;

      & input {
        width: auto;
      }

      & span {
        font-size: 12px;
        color: #555;
        margin-top: 5px;
        display: block;
      }
    }

    .instant-mode-warning {
      font-size: 12px;
      color: #555;
      margin-top: 10px;
      display: block;
    }

    .save-button-wrapper {
      display: flex;
      justify-content: center;
      margin-top: 25px;
    }

    .result {
      text-align: center;
      margin-top: 20px;
      padding: 10px;
      border-radius: 5px;

      &.success {
        color: #0a3622;
        background: #d1e7dd;
      }

      &.error {
        color: #58151c;
        background: #f8d7da;
      }
    }
  }
}
</style>
