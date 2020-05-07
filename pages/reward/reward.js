Page({
  data: {
    current: 'tab1',
    tab1: true,
    current_scroll: 'tab1'
  },

  handleChange({
    detail
  }) {
    var index = detail.key
    console.log(index)
    this.setData({
      current: detail.key,

    });
    if (index == 'tab1') {
      this.setData({
        tab1: true,
        tab2: false,
      })
    } else if (index == 'tab2') {
      this.setData({
        tab1: false,
        tab2: true,
      })
    }
  },


});