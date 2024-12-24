export default {
  isEmpty (value) {
    return value === undefined || value === null || value === '' || value.length === 0
  },
  isNotEmpty (value) {
    return !this.isEmpty(value)
  }
}
