// components/tab/tab.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
	 list: {
	   type: Array,
	   value: [],
	 },	
	 isShowNum:{
		type: Boolean,
		value:false,
	 },
	 tabIndex:{
		type: Number,
		value:0, 
	 },
	 thisIndex:{
		type: Number,
		value:0, 
	 }
  },

  /**
   * 组件的初始数据
   */
  data: {
	 thisIndex:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
	/**
	 * 组件点击事件
	 */
	tabClick:function(e){
		this.setData({
			thisIndex:e.currentTarget.id
		})
		this.triggerEvent("tabclick",{id:e.currentTarget.id});
	}
  },
  ready: function () {
	// console.log(this.data.thisIndex)
  },
  observers: {
    'tabIndex': function (params) {
  		  this.setData({
  			thisIndex:parseInt(params) 
  		  })
    }
  },
})
