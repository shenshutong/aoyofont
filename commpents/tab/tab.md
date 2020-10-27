##### Tab 标签页
##引入  
{
	"usingComponents":{
		"tab": "/components/tab/tab"
	}
}
 <tab list="{{tablist}}" isShowNum="{{true}}" bind:tabclick="tabClick"></tab>
##属性

#isShowNum 是否显示数量 Boolean

#list 数组

**isShowNum=true
list=[
	{
	   name:'柴油',
	   num:2
	}
]

**isShowNum=false
list=[
	{
	   name:'柴油'
	}
]

##返回值
tabClick:function(e){
  console.log(e.detail);
}

