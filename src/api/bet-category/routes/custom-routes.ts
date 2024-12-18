module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/betting-tips-today',
      handler: 'custom-controller.bettingTipsToday'
    },
  ]
}
