<template>
  <div class="list-wrapper">
    <ul class="list">
      <li v-for="(item, index) in messages" :key="index"
          :class="{'incoming' : item.role === 'assistant'}">
        <div class="card">
          <div v-html="item.message" class="message markdown-body"/>
          <div class="detail" v-if="item.model || item.reasoning || item.token || item.createdDate">
            <div class="model-detail">
              <template v-if="item.model || item.reasoning">
                <table>
                  <tbody>
                  <tr v-if="item.model">
                    <td>{{ item.model }}</td>
                  </tr>
                  <tr v-if="item.reasoning">
                    <td>{{ item.reasoning }} Düşünme</td>
                  </tr>
                  </tbody>
                </table>
              </template>
            </div>
            <div class="token-detail" v-if="item.token || item.createdDate">
              <table>
                <tbody>
                <tr v-if="item.token">
                  <td>{{ item.token }} Token</td>
                </tr>
                <tr v-if="item.createdDate">
                  <td>{{ item.createdDate }}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import {nextTick, watch} from "vue";

const props = defineProps({
  messages: {
    type: Array,
    required: true
  }
})

watch(() => props.messages, async () => {
  await nextTick();
  scrollToListBottom()
}, {deep: true, immediate: true})

const scrollToListBottom = () => {
  const listWrapper = document.querySelector('.list-wrapper');
  listWrapper.scrollTop = listWrapper.scrollHeight;
}
</script>

<style scoped>
.list-wrapper {
  flex-grow: 1;
  overflow-y: auto;
  scroll-behavior: smooth;
  padding-top: 25px;
  padding-bottom: 25px;

  @media (min-width: 576px) {
    padding-left: 25px;
    padding-right: 25px;
  }

  & ul {
    list-style: none;
    padding: 0;
    margin: 0;

    & li {
      margin-bottom: 15px;
      display: flex;

      .card {
        padding: 15px 20px;
        border-radius: 15px;
        cursor: pointer;
        max-width: 75%;

        .message {
          background: none;
        }

        .detail {
          margin-top: 10px;
          display: none;
          justify-content: space-between;
          padding-top: 10px;
          color: #9E9E9E;
          font-size: 12px;

          .model-detail {
            display: flex;
            flex-direction: column;
          }

          .token-detail {
            text-align: right;
          }
        }

        &:hover {
          .detail {
            display: flex;
          }
        }
      }

      &.incoming {
        justify-content: start;

        .card {
          background-color: #F5F5F5;

          .detail {
            color: #9E9E9E;
            border-top: 1px solid #9E9E9E;
          }
        }
      }

      &:not(.incoming) {
        justify-content: end;

        & .card {
          background-color: #039BE5;
          color: white;

          .message {
            color: white;
          }

          .detail {
            color: #E0E0E0;
            border-top: 1px solid #E0E0E0;
          }
        }
      }
    }
  }
}
</style>
