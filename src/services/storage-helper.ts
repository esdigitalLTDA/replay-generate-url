const StorageHelper = {
  setItem(key: string, value: any) {
    try {
      const valueToStore = JSON.stringify(value)
      localStorage.setItem(key, valueToStore)
    } catch (error) {
      console.error('Error saving to Local Storage', error)
    }
  },
  getItem(key: string) {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error('Error getting item from Local Storage', error)
      return null
    }
  },
  removeItem(key: string) {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing item from Local Storage', error)
    }
  },
}

const STORAGE_KEYS = {
  USER_WALLET: 'user-wallet',
  USER_WALLET_SIGN: 'user-sign',
}

export { StorageHelper, STORAGE_KEYS }
