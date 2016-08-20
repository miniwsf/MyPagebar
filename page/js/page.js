
(function($){
	
	function Paginations(param){     //构造函数
		this.curPage=validateInt(param.curPage),         //当前页数
		this.totalPage=validateInt(param.totalPage),     //总页数
		this.selector=param.selector,                                
		this.url=null,                        
		this.pageParam=null,             //分页参数名称
		this.condition={},             //查询条件
		this.param=false,				//url地址后面是否跟有查询参数
		this.jsonReader={               //后台返回参数格式 （默认格式）
			totalSize:"totalSize",
			totalPage:"totalPage",
			datas:"datas",
			curPage:"curPage"
		}; 
		
		var perPage=validateInt(param.perPage);         //页面显示的页码数
		this.perPage=perPage==0?11:perPage;
		
		var url=param.url,
		condition=param.condition,
		pageParam=param.pageParam,
		jsonReader=param.jsonReader;      //分页参数名称
		
		var urlRegExp=/'.*'/ ;
		if(condition){
			this.condition=condition;
		}
		if(pageParam){
			this.pageParam=pageParam;
		}
		
		if(url){    //null undefined "" NaN
			if(urlRegExp.test(url)){     //ur是否有''
				url=url.substring(1,url.length-1);
			}
			if(url.indexOf("?")>-1){   //url是否跟有查询参数
				this.param=true;
			}
			this.url=url;
		}
		
		if(jsonReader){
			this.jsonReader=jsonReader;
		}
	}
	
	//判断是不是整数
	function validateInt(data){
		var intRegExp=/^[1-9]\d*$/;
		var value=0;
		if(data&&intRegExp.test(data)){
			value=data;
		}
		return value;
	}
	
	Paginations.prototype ={
		constructor:Paginations,
		showPage:function(defineStyle){    
			var 
			selector=this.selector,
			perPage=this.perPage,
			reside=curPage-parseInt(perPage+1)/2,
			index=reside>0?reside:1,   //从哪一页开始
			page=this.totalPage,
			curPage=this.curPage;
			html="<ul class='pagination' id='pageList'>";
			for(var i=0 ;i<perPage && index<=page; i++,index++){
				if(index==1){
					html+="<li class='disabled'><a value=''>&laquo;</a></li>";
				}
				else{
					html+="<li><a id='previous' value='"+(index-1)+"'>&laquo;</a></li>";
					
				}
				
				if(i==curPage){
					html+="<li class='active'><a value=''>"+index+"</a></li>";
				}
				else{
					html+="<li><a value='"+index+"'>"+index+"</a></li>";
				}
				
				if(index==page){
					html+="<li class='disabled' value=''><a>&raquo;</a></li>";
				}
				else{
					html+="<li value='"+(index+1)+"'><a>&raquo;</a></li>";
				}
			}
			
			html+="</ul>";
			$(selector).append(html);
			var list=document.getElementById("pageList");
			list.addEventListener("click" ,function(event){
				var target=event.target;
				var value=$(target).attr("value");
			
				if(value){
					toPage(defineStyle,value);
				}
			},false);
		},
		//到第几页
		toPage:function(defineStyle,curPage){
			var url=this.url,
			totalSize=0,
			page=0,
			datas=null,
			condition=this.condition,
			pageParam=this.pageParam,
			jsonReader=this.jsonReader;
			if(!curPage){
				curPage=this.curPage;
			}
			
			if(this.param){
				url+="&"+pageParam+"="+curPage;
			}
			else{
				url+="?"+pageParam+"="+curPage;
			}
		 	$.ajax({
		        type:"get",
		        url:url,
		        dataType:"json",
		        data:condition,
		        async: false,  //同步方式
		        success:function(result){
		        	totalSize=result[jsonReader.totalSize];
		        	page=result[jsonReader.totalPage];
		        	datas=result[jsonReader.datas];
		        },
		        error:function(result){
		        	
		        }
		    });
		 	this.totalSize=totalSize;
		 	this.totalPage=page;
		 	this.datas=datas;
		 	
		 	//检测是不是函数
		 	if(defineStyle instanceof Function && datas){
		 		defineStyle(datas);    //显示数据
		 		this.showPage(defineStyle);
		 	}
		 	return this;
		}
	};

	$.fn.page=function(params){
		params.selector=$(this).selector;
		return new Paginations(params);
	};

})(jQuery);