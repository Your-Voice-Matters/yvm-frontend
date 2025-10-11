import { ref } from 'vue'
import { defineStore } from 'pinia'

export const usernameStore = defineStore('username', () => {
  const username = ref("")
  function get() {
    return username.value;
  }
  function set(uname: string) {
    username.value = uname;
  }

  return { get, set }
})
