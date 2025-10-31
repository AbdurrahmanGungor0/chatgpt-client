<template>
  <div class="app" :class="{'mobile-view' : isMobileView}">
    <div class="menu" :class="{'expanded' : isMenuExpanded}">
      <button class="menu-button btn btn-primary" @click="isMenuExpanded = !isMenuExpanded">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <path d="M4 6H20M4 12H20M4 18H20" stroke="#7D7461" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" data-darkreader-inline-stroke=""
                  style="--darkreader-inline-stroke: #e8e6e3;"></path>
          </g>
        </svg>
      </button>

      <router-link :to="{name: 'newChat'}" class="new-chat-link">
        <button class="btn btn-primary">
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
          <span v-show="isMenuExpanded" class="text">Yeni Sohbet</span>
        </button>
      </router-link>

      <div class="old-chat-title" v-show="isMenuExpanded">Önceki Sohbetler</div>

      <div class="chat-list-wrapper">
        <ul v-show="isMenuExpanded" class="chat-list">
          <li v-for="(item, index) in chatItems" :key="index" class="menu-item"
              @click="onClickDetail(item.id)" :class="{'active' : item.id === activeChatId}">
            {{ item.title }}
            <button class="delete-button" @click.stop="onDeleteChat(item.id)">
              <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none"
                   xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6"
                    stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round"></path>
                </g>
              </svg>
            </button>
          </li>
        </ul>
      </div>

      <router-link :to="{name: 'settings'}" class="settings-link">
        <button class="button btn btn-primary">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <rect width="24" height="24"></rect>
              <path
                d="M13.5 2L13.9961 1.93798C13.9649 1.68777 13.7522 1.5 13.5 1.5V2ZM10.5 2V1.5C10.2478 1.5 10.0351 1.68777 10.0039 1.93798L10.5 2ZM13.7747 4.19754L13.2786 4.25955C13.3047 4.46849 13.4589 4.63867 13.6642 4.68519L13.7747 4.19754ZM16.2617 5.22838L15.995 5.6513C16.1731 5.76362 16.4024 5.75233 16.5687 5.62306L16.2617 5.22838ZM18.0104 3.86826L18.364 3.51471C18.1857 3.3364 17.9025 3.31877 17.7034 3.47359L18.0104 3.86826ZM20.1317 5.98958L20.5264 6.29655C20.6812 6.09751 20.6636 5.81434 20.4853 5.63603L20.1317 5.98958ZM18.7716 7.73831L18.3769 7.43134C18.2477 7.59754 18.2364 7.82693 18.3487 8.00503L18.7716 7.73831ZM19.8025 10.2253L19.3148 10.3358C19.3613 10.5411 19.5315 10.6953 19.7404 10.7214L19.8025 10.2253ZM22 10.5H22.5C22.5 10.2478 22.3122 10.0351 22.062 10.0039L22 10.5ZM22 13.5L22.062 13.9961C22.3122 13.9649 22.5 13.7522 22.5 13.5H22ZM19.8025 13.7747L19.7404 13.2786C19.5315 13.3047 19.3613 13.4589 19.3148 13.6642L19.8025 13.7747ZM18.7716 16.2617L18.3487 15.995C18.2364 16.1731 18.2477 16.4025 18.3769 16.5687L18.7716 16.2617ZM20.1317 18.0104L20.4853 18.364C20.6636 18.1857 20.6812 17.9025 20.5264 17.7034L20.1317 18.0104ZM18.0104 20.1317L17.7034 20.5264C17.9025 20.6812 18.1857 20.6636 18.364 20.4853L18.0104 20.1317ZM16.2617 18.7716L16.5687 18.3769C16.4024 18.2477 16.1731 18.2364 15.995 18.3487L16.2617 18.7716ZM13.7747 19.8025L13.6642 19.3148C13.4589 19.3613 13.3047 19.5315 13.2786 19.7404L13.7747 19.8025ZM13.5 22V22.5C13.7522 22.5 13.9649 22.3122 13.9961 22.062L13.5 22ZM10.5 22L10.0039 22.062C10.0351 22.3122 10.2478 22.5 10.5 22.5V22ZM10.2253 19.8025L10.7214 19.7404C10.6953 19.5315 10.5411 19.3613 10.3358 19.3148L10.2253 19.8025ZM7.73832 18.7716L8.00504 18.3487C7.82694 18.2364 7.59756 18.2477 7.43135 18.3769L7.73832 18.7716ZM5.98959 20.1317L5.63604 20.4853C5.81435 20.6636 6.09752 20.6812 6.29656 20.5264L5.98959 20.1317ZM3.86827 18.0104L3.4736 17.7034C3.31878 17.9025 3.33641 18.1857 3.51472 18.364L3.86827 18.0104ZM5.22839 16.2617L5.62307 16.5687C5.75234 16.4025 5.76363 16.1731 5.65131 15.995L5.22839 16.2617ZM4.19754 13.7747L4.68519 13.6642C4.63867 13.4589 4.46849 13.3047 4.25955 13.2786L4.19754 13.7747ZM2 13.5H1.5C1.5 13.7522 1.68777 13.9649 1.93798 13.9961L2 13.5ZM2 10.5L1.93798 10.0039C1.68777 10.0351 1.5 10.2478 1.5 10.5H2ZM4.19754 10.2253L4.25955 10.7214C4.46849 10.6953 4.63867 10.5411 4.68519 10.3358L4.19754 10.2253ZM5.22839 7.73831L5.65131 8.00503C5.76363 7.82693 5.75234 7.59755 5.62307 7.43134L5.22839 7.73831ZM3.86827 5.98959L3.51472 5.63603C3.33641 5.81434 3.31878 6.09751 3.47359 6.29656L3.86827 5.98959ZM5.98959 3.86827L6.29656 3.47359C6.09752 3.31878 5.81434 3.33641 5.63604 3.51471L5.98959 3.86827ZM7.73832 5.22839L7.43135 5.62306C7.59755 5.75233 7.82694 5.76363 8.00504 5.6513L7.73832 5.22839ZM10.2253 4.19754L10.3358 4.68519C10.5411 4.63867 10.6953 4.46849 10.7214 4.25955L10.2253 4.19754ZM13.5 1.5H10.5V2.5H13.5V1.5ZM14.2708 4.13552L13.9961 1.93798L13.0039 2.06202L13.2786 4.25955L14.2708 4.13552ZM16.5284 4.80547C15.7279 4.30059 14.8369 3.92545 13.8851 3.70989L13.6642 4.68519C14.503 4.87517 15.2886 5.20583 15.995 5.6513L16.5284 4.80547ZM16.5687 5.62306L18.3174 4.26294L17.7034 3.47359L15.9547 4.83371L16.5687 5.62306ZM17.6569 4.22182L19.7782 6.34314L20.4853 5.63603L18.364 3.51471L17.6569 4.22182ZM19.7371 5.68261L18.3769 7.43134L19.1663 8.04528L20.5264 6.29655L19.7371 5.68261ZM20.2901 10.1149C20.0746 9.16313 19.6994 8.27213 19.1945 7.47158L18.3487 8.00503C18.7942 8.71138 19.1248 9.49695 19.3148 10.3358L20.2901 10.1149ZM22.062 10.0039L19.8645 9.72917L19.7404 10.7214L21.938 10.9961L22.062 10.0039ZM22.5 13.5V10.5H21.5V13.5H22.5ZM19.8645 14.2708L22.062 13.9961L21.938 13.0039L19.7404 13.2786L19.8645 14.2708ZM19.1945 16.5284C19.6994 15.7279 20.0746 14.8369 20.2901 13.8851L19.3148 13.6642C19.1248 14.503 18.7942 15.2886 18.3487 15.995L19.1945 16.5284ZM20.5264 17.7034L19.1663 15.9547L18.3769 16.5687L19.7371 18.3174L20.5264 17.7034ZM18.364 20.4853L20.4853 18.364L19.7782 17.6569L17.6569 19.7782L18.364 20.4853ZM15.9547 19.1663L17.7034 20.5264L18.3174 19.7371L16.5687 18.3769L15.9547 19.1663ZM13.8851 20.2901C14.8369 20.0746 15.7279 19.6994 16.5284 19.1945L15.995 18.3487C15.2886 18.7942 14.503 19.1248 13.6642 19.3148L13.8851 20.2901ZM13.9961 22.062L14.2708 19.8645L13.2786 19.7404L13.0039 21.938L13.9961 22.062ZM10.5 22.5H13.5V21.5H10.5V22.5ZM9.72917 19.8645L10.0039 22.062L10.9961 21.938L10.7214 19.7404L9.72917 19.8645ZM7.4716 19.1945C8.27214 19.6994 9.16314 20.0746 10.1149 20.2901L10.3358 19.3148C9.49696 19.1248 8.71139 18.7942 8.00504 18.3487L7.4716 19.1945ZM6.29656 20.5264L8.04529 19.1663L7.43135 18.3769L5.68262 19.7371L6.29656 20.5264ZM3.51472 18.364L5.63604 20.4853L6.34315 19.7782L4.22183 17.6569L3.51472 18.364ZM4.83372 15.9547L3.4736 17.7034L4.26295 18.3174L5.62307 16.5687L4.83372 15.9547ZM3.70989 13.8851C3.92545 14.8369 4.30059 15.7279 4.80547 16.5284L5.65131 15.995C5.20584 15.2886 4.87517 14.503 4.68519 13.6642L3.70989 13.8851ZM1.93798 13.9961L4.13552 14.2708L4.25955 13.2786L2.06202 13.0039L1.93798 13.9961ZM1.5 10.5V13.5H2.5V10.5H1.5ZM4.13552 9.72917L1.93798 10.0039L2.06202 10.9961L4.25955 10.7214L4.13552 9.72917ZM4.80547 7.47159C4.30059 8.27213 3.92545 9.16313 3.70989 10.1149L4.68519 10.3358C4.87517 9.49696 5.20583 8.71138 5.65131 8.00503L4.80547 7.47159ZM3.47359 6.29656L4.83371 8.04528L5.62307 7.43134L4.26295 5.68262L3.47359 6.29656ZM5.63604 3.51471L3.51472 5.63603L4.22182 6.34314L6.34314 4.22182L5.63604 3.51471ZM8.04529 4.83371L6.29656 3.47359L5.68262 4.26294L7.43135 5.62306L8.04529 4.83371ZM10.1149 3.70989C9.16313 3.92545 8.27214 4.30059 7.4716 4.80547L8.00504 5.6513C8.71139 5.20583 9.49696 4.87517 10.3358 4.68519L10.1149 3.70989ZM10.0039 1.93798L9.72917 4.13552L10.7214 4.25955L10.9961 2.06202L10.0039 1.93798Z"
                fill="#7D7461"></path>
              <circle cx="12" cy="12" r="4" stroke="#7D7461" stroke-linejoin="round"></circle>
            </g>
          </svg>
          <span v-show="isMenuExpanded">Ayarlar</span>
        </button>
      </router-link>
    </div>

    <div class="page">
      <RouterView v-slot="{ Component }">
        <component :is="Component" @updateList="getData" :isMobileView="isMobileView"
                   @promptFocus="onPromptFocus"/>
      </RouterView>
    </div>
  </div>
</template>

<script setup>
import {RouterView, useRoute, useRouter} from 'vue-router'
import {computed, onMounted, onUnmounted, ref} from "vue";
import {database} from "@/composables/database.js";

const route = useRoute()
const router = useRouter()

const isMenuExpanded = ref(true)
const chatItems = ref([])
const isMobileView = ref(false)

const activeChatId = computed(() => {
  if (route.params.id) {
    return parseInt(route.params.id)
  }
  return null
})

const onClickDetail = (id) => {
  router.push({name: 'chat', params: {id}})
}

const getData = async () => {
  chatItems.value = await database.chats.orderBy('updatedDate').reverse().toArray()
}

const onDeleteChat = async (id) => {
  await database.transaction('rw', 'chats', 'chatDetails', async () => {
    await database.chats.delete(id)
    await database.chatDetails.where('chatId').equals(id).delete();
  })

  await getData()
  if (activeChatId.value === id) {
    await router.push({name: 'newChat'})
  }
}

const setMobileView = () => {
  if (window.innerWidth <= 767) {
    isMobileView.value = true
    isMenuExpanded.value = false
  } else {
    isMobileView.value = false
    isMenuExpanded.value = true
  }
}

const onPromptFocus = () => {
  if (isMobileView.value) {
    isMenuExpanded.value = false
  }
}

onMounted(() => {
  getData()
  setMobileView()
  window.addEventListener('resize', setMobileView)
})

onUnmounted(() => {
  window.removeEventListener('resize', setMobileView)
})

</script>

<style scoped>
.app {
  display: flex;
  height: 100dvh;
  position: relative;

  .menu {
    display: flex;
    flex-direction: column;
    width: 60px;
    padding: 10px;
    border-right: 1px solid #f0f0f0;
    transition: all 0.2s;
    flex-shrink: 0;

    .menu-button {
      width: 40px;
      margin-bottom: 10px;
      flex-shrink: 0;
    }

    .new-chat-link {
      flex-shrink: 0;
      margin-bottom: 10px;
      width: 100%;
      text-decoration: none;

      & button {
        width: 100%;
      }
    }

    .old-chat-title {
      margin-top: 10px;
      margin-bottom: 5px;
      font-size: 12px;
      color: #c9c9c9;
      flex-shrink: 0;
    }

    &.expanded {
      width: 300px;
    }

    .chat-list-wrapper {
      overflow: auto;
      margin-bottom: 15px;
      flex-grow: 1;
      padding-right: 10px;
      margin-right: -10px;

      .chat-list {
        list-style: none;
        padding-left: 0;
        margin: 0;

        .menu-item {
          padding: 10px;
          border-radius: 5px;
          cursor: pointer;
          color: #7D7461;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 5px;

          &:hover {
            background: #f0f0f0;

            .delete-button {
              visibility: visible;

              & svg {
                stroke: #7D7461;

                &:hover {
                  stroke: #1b1815;
                }
              }
            }
          }

          &.active {
            background: #b4b3b3 !important;
            color: white !important;
            cursor: default !important;

            &:hover {
              .delete-button svg {
                stroke: white;

                &:hover {
                  stroke: #e4e4e4;
                }
              }
            }
          }

          .delete-button {
            visibility: hidden;
            border: none;
            background: none;
            outline: none;
            cursor: pointer;
          }
        }
      }
    }

    .settings-link {
      text-decoration: none;

      .button {
        width: 100%;
      }
    }
  }

  .page {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100dvh;
    padding: 25px;
    width: 100%;
    min-width: 0;
    flex-grow: 1;
  }

  &.mobile-view .menu.expanded {
    position: absolute;
    z-index: 10;
    height: 100dvh;
    background: white;
  }
}
</style>
