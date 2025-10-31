<template>
  <div class="prompt-wrapper" @click="onClickPage">
    <div class="text-wrapper" :class="{'loading': isProcessing}">
    <textarea v-model="text" class="input" autocomplete="off"
              placeholder="Sorunuzu giriniz..." @keydown="onKeyDownText"
              :rows="isInputFocused ? 3 : 1" ref="input" :class="{'processing' : isProcessing}"/>
      <div class="loader-wrapper" v-show="isProcessing">
        <div class="loader-line">
          <div class="ln1"></div>
          <div class="ln2"></div>
          <div class="ln3"></div>
          <div class="ln4"></div>
          <div class="ln5"></div>
          <div class="ln6"></div>
          <div class="ln7"></div>
          <div class="ln8"></div>
          <div class="ln9"></div>
          <div class="ln10"></div>
        </div>

        <span>Cevap alınıyor...</span>
      </div>
    </div>

    <div class="tools" v-show="isInputFocused && !isProcessing">
      <div class="selectors">
        <div class="selector-item">
          <label for="model-select">Model</label>
          <select v-model="model" id="model-select">
            <option v-for="(item,index) in models" :value="item.value" :key="index">{{
                item.label
              }}
            </option>
          </select>
        </div>
        <div class="selector-item">
          <label for="reasoning-select">Düşünme</label>
          <select v-model="reasoning" id="reasoning-select">
            <option v-for="(item,index) in reasonings" :value="item.value" :key="index">{{
                item.label
              }}
            </option>
          </select>
        </div>
      </div>
      <button class="btn btn-primary send-button" @click="submit">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <path
              d="M10.3009 13.6949L20.102 3.89742M10.5795 14.1355L12.8019 18.5804C13.339 19.6545 13.6075 20.1916 13.9458 20.3356C14.2394 20.4606 14.575 20.4379 14.8492 20.2747C15.1651 20.0866 15.3591 19.5183 15.7472 18.3818L19.9463 6.08434C20.2845 5.09409 20.4535 4.59896 20.3378 4.27142C20.2371 3.98648 20.013 3.76234 19.7281 3.66167C19.4005 3.54595 18.9054 3.71502 17.9151 4.05315L5.61763 8.2523C4.48114 8.64037 3.91289 8.83441 3.72478 9.15032C3.56153 9.42447 3.53891 9.76007 3.66389 10.0536C3.80791 10.3919 4.34498 10.6605 5.41912 11.1975L9.86397 13.42C10.041 13.5085 10.1295 13.5527 10.2061 13.6118C10.2742 13.6643 10.3352 13.7253 10.3876 13.7933C10.4468 13.87 10.491 13.9585 10.5795 14.1355Z"
              stroke="#7D7461" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round"></path>
          </g>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import {onMounted, onUnmounted, ref, useTemplateRef, watch} from "vue";

const emits = defineEmits(['submit', 'inputFocus'])
const props = defineProps({
  isProcessing: {
    type: Boolean,
    default: false
  }
})

const input = useTemplateRef('input')
const text = ref('');
const model = ref('gpt-5-nano');
const reasoning = ref('minimal');
const models = ref([
  {value: 'gpt-5-mini', label: 'GPT-5 Mini'},
  {value: 'gpt-5-nano', label: 'GPT-5 Nano'},
  {value: 'gpt-5', label: 'GPT-5'},
])
const reasonings = ref([
  {value: 'minimal', label: 'Minimum'},
  {value: 'low', label: 'Düşük'},
  {value: 'medium', label: 'Orta'},
  {value: 'high', label: 'Yüksek'},
])
const isInputFocused = ref(false);

watch(isInputFocused, (value) => {
  if (value) {
    emits('inputFocus')

  }
})

const onKeyDownText = (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    submit()
    event.preventDefault();
  }
}

const submit = () => {
  isInputFocused.value = false;
  emits('submit', {
    text: text.value,
    model: model.value,
    reasoning: reasoning.value
  })
  text.value = '';
}

const onClickPage = (event) => {
  if (event.target.classList.contains('prompt-wrapper') || event.target.closest('.prompt-wrapper') && !props.isProcessing) {
    isInputFocused.value = true;
  } else {
    isInputFocused.value = false;
  }

  if (event.target.classList.contains('text-wrapper')) {
    input.value.focus();
  }
}

onMounted(() => {
  document.addEventListener('click', onClickPage)
})

onUnmounted(() => {
  document.removeEventListener('click', onClickPage)
})
</script>


<style scoped>
.prompt-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 500px;
  background: white;
  border: 1px solid #f0f0f0;
  border-radius: 10px;

  .text-wrapper {
    padding-top: 10px;
    padding-bottom: 10px;
    position: relative;

    & textarea {
      display: block;
      background: none;
      border: none;
      padding-left: 15px;
      padding-right: 15px;
      resize: none;
      line-height: 18px;
      position: relative;

      &.processing {
        visibility: hidden;
      }

      &:focus-visible {
        box-shadow: none;
      }
    }

    .loader-wrapper {
      position: absolute;
      top: 15px;
      left: calc(50% - 28px);
      display: flex;
      align-items: center;

      @media (min-width: 576px) {
        left: calc(50% - 95px);
      }

      & span {
        margin-left: 25px;
        color: #959595;
        display: none;

        @media (min-width: 576px) {
          display: inline-block;
        }
      }

      .loader-line {
        width: 60px;
        height: 30px;
        display: flex;
      }

      .loader-line > div {
        background: #6c3d52;
        height: 100%;
        width: 5px;
        margin-right: 1px;
        display: inline-block;
      }

      .loader-line > div {
        background-color: #5f686a;
        animation: anm-LL-2-move 1.5s infinite ease-in-out;
        transform: scaleY(0.05) translateX(-5px);
      }

      .loader-line .ln1 {
        animation-delay: 0.05s;
      }

      .loader-line .ln2 {
        animation-delay: 0.1s;
      }

      .loader-line .ln3 {
        animation-delay: 0.15s;
      }

      .loader-line .ln4 {
        animation-delay: 0.2s;
      }

      .loader-line .ln5 {
        animation-delay: 0.25s;
      }

      .loader-line .ln6 {
        animation-delay: 0.3s;
      }

      .loader-line .ln7 {
        animation-delay: 0.35s;
      }

      .loader-line .ln8 {
        animation-delay: 0.4s;
      }

      .loader-line .ln9 {
        animation-delay: 0.45s;
      }

      .loader-line .ln10 {
        animation-delay: 0.5s;
      }
    }
  }

  .tools {
    display: flex;
    justify-content: space-between;
    padding: 10px;

    .selectors {
      display: flex;
      gap: 10px;

      .selector-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        outline: 1px solid #e4e2e2;
        padding: 5px;
        border-radius: 10px;

        & label {
          font-size: 12px;
          color: #757575;
        }

        & select {
          padding: 5px;
          border-radius: 10px;
          border: none;
          margin-top: 5px;
        }

        & input[type="checkbox"] {
          margin-top: 13px;
        }
      }
    }

    .send-button {
      border: 1px solid #BDBDBD;

      & svg {
        height: 20px;
      }
    }
  }
}

@keyframes anm-LL-2-move {
  10% {
    background: #bbb;
  }
  15% {
    transform: scaleY(1.2) translateX(10px);
    background: #bbb;
  }
  90%,
  100% {
    transform: scaleY(0.05) translateX(-5px);
  }
}
</style>
