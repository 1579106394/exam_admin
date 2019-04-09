const question = {
  state: {
    bankId: '',
    typeId: ''
  },
  mutations: {
    setBank(state, bankId) {
      state.bankId = bankId
    },
    setType(state, typeId) {
      state.typeId = typeId
    }
  }
}
export default question
