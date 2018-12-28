/* 加载头部和尾部 */
// 定义模块，复用
define(["jquery", "cookie","bootstrap"], function($) {
	// 构造函数
	function HeaderAndFooter() {
		this.init();

		$.cookie.json = true;
	}
	// 扩展原型
	$.extend(HeaderAndFooter.prototype, {
		// 初始化
		init() {
			this.loadHeader();			
		},
		// 加载头部
		loadHeader() {
			$.get("/html/home/header.html", (data)=>{
				$("header").html(data);
				// 头部内容加载完毕并渲染完成后，还需要添加交互
				this.headerHandler();
				this.addListener();
			});
        },
       headerHandler(){
			$(".nav-l a").each(function(){ 
				$this = $(this); 
				if($this[0].href==String(window.location)){//判断url地址是否与a标签href属性值一致
					$("li").removeClass("active");
				  $this.parent().addClass("active");				  
				} 
			  });
			this.genCode();
			this.showLoginUser();
			this.logout();
		},
		genCode() {
			$.getJSON("/api/captcha/gen", (data)=>{
				$("div.validate-code").html(data.res_body.ret.data.image);
			});
		},
		addListener(){
			$(".posi a").on("click",this.setPosin)
			$("div.validate-code").on("click",this.genCode);
			$("#loginValidateCode").on("blur",function(){
				$.getJSON("/api/captcha/verify",{code:$(this).val()},(data)=>{
					if(data.res_body.ret.data.valid)
						  alert("通过")
					else
						alert("验证码有误");
				})
			});
			$(".btn-login").on("click", this.loginHandler);
			$(".btn-register").on("click", this.register);		
		},
		setPosin(){			
			const user = sessionStorage.loginUser;
			if(!user){
				$("#loginModal").modal("show");
				return false;
			}			
		},
			// 登录处理
		loginHandler(){
			// 获取登录表单中用户名与密码（待传递到服务器的数据)
			const data = $(".form-login").serialize();				
			// API接口
			$.post("/api/users/login.do", data, (data)=>{
				if (data.res_body.ret.code === -1) { // 用户名或密码错误
					$(".login-error").removeClass("hidden");
				} else { // 登录成功
					// 保存登录成功的用户信息
					//console.log(data);
					sessionStorage.loginUser = data.res_body.ret.data.username;
					// 刷新页面
					location.reload();
				}
			}, "json")
		},
		//注册处理
		register(){			
			// 获取注册表单中用户名与密码（待传递到服务器的数据）
			const data = $(".form-register").serialize();
			console.log(data);		
			// API接口
			$.post("/api/users/register.do", data, (data)=>{
				if (data.res_body.ret.code === 1) { // 注册成功
					sessionStorage.loginUser = data.res_body.ret.data.username;
					location.reload();
				} else { // 注册失败					
					$(".register-error").removeClass("hidden");
				}
			}, "json")
		},
		// 登录信息显示
		showLoginUser() {
			const user = sessionStorage.loginUser;
			if (user) {
				$(".loged-in").removeClass("hidden").siblings(".not-loged-in").remove();
				$(".loged-in a:first").text("欢迎 "+user);
			}
		},
		//退出
		logout(){
			$(".link-logout").click(()=>{
				sessionStorage.removeItem("loginUser");
				location.href="/";
			})
		}
	});
	return new HeaderAndFooter();
});
