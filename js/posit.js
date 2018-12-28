require(["config"], function() {
	require(["jquery", "header","bootstrap"], function($) {
		function Position() {
			this.addListener();
			this.findPosition();
			this.tr = null;						
		}

		$.extend(Position.prototype, {
			// 注册事件监听
			addListener() {							
				$(".btn-add").on("click",this.addPositionHandler);
				$(".tab").on("click",".update",$.proxy(this.updatePosition,this));
				$(".tab").on("click",".del",this.delPosition);
				$(".page").on("click","a",$.proxy(this.findPage,this));
				$("#btn-update").on("click",$.proxy(this.updateSave,this));

			},
			// 添加职位处理
			addPositionHandler() {				
				// 获取表单中待提交数据，将其包装在 FormData 对象中
				const formData = new FormData($(".form-add")[0]);
				let index = $("tr").length;																					
				// 使用 ajax 提交				
				$.ajax({
					type: "post",
					url: "/api/positions/add.do",
					data: formData,
					contentType: false,
					processData: false,
					dataType: "json",
					success: function(data) {
						console.log(data)
						const curr = data.res_body.ret.data;																						
						const html = `
								<tr>
									<td>${index}</td>
									<td class="id">${curr._id}</td>
									<td><img src="${curr.logo}"></td>
									<td>${curr.position}</td>
									<td>${curr.company}</td>
									<td>${curr.address}</td>
									<td>${curr.salary}</td>
									<td><a href="#" class="update" data-toggle="modal" data-target="#updateModal">修改</a><a href="javascript:;" class="del">删除</a></td>
								</tr>
									`;				
						$("tbody.tab").append(html);
						$("#addModal").modal("hide");
						$("#add-form")[0].reset();					
					}
				});
			},
			/* 查找 */
			findPosition(page){													
				// 使用 ajax 提交
				page = 	page || 0;			
				$.ajax({
					type: "get",
					url: "/api/positions/find.do",
					data: {page},				
					dataType: "json",
					success: function(data) {
						console.log(data)
						let html = "";
						const arr = data.res_body.ret.data;				   
						$.each(arr,(index,curr)=>{
							html += `
								<tr>
									<td>${index+1}</td>
									<td class="id">${curr._id}</td>
									<td><img src="${curr.logo}"></td>
									<td>${curr.position}</td>
									<td>${curr.company}</td>
									<td>${curr.address}</td>
									<td>${curr.salary}</td>
									<td><a href="#" class="update" data-toggle="modal" data-target="#updateModal">修改</a><a href="javascript:;" class="del">删除</a></td>
								</tr>`;	
						});																																						
						$("tbody.tab").html(html);																					
					}
				});			
			},
			/* 翻页 */
			findPage(event){
				//console.log("in")
				$src = $(event.target);
				const pages = $src.text();
				let   page = pages - 1;	
				//console.log(pages)			
				this.findPosition(page);
				$src.parents("li").addClass("active").siblings().removeClass("active");
			},

			/* 修改 */
			updatePosition(event){
				const $src = $(event.target),
					   tr = this.tr = $src.parents("tr");
				const   _id = tr.children().eq(1).text(),
						position = tr.children().eq(3).text(),
						company = tr.children().eq(4).text(),
						address = tr.children().eq(5).text(),
						salary = tr.children().eq(6).text();																		
				
				$("#updateId").val(_id);				
				$("#updateCompany").val(company);
				$("#updatePosition").val(position);
				$("#updateSalary").val(salary);
				$("#updateAddress").val(address);				
			},
			updateSave(){
				const tr = this.tr;
				const img = tr.children().eq(2).children().attr("src");		
				const formData = new FormData($(".form-update")[0]);
				formData.append("img",img)										
				let index = tr.index();																	
				// 使用 ajax 提交				
				$.ajax({
					type: "post",
					url: "/api/positions/update.do",
					data: formData,
					contentType: false,
					processData: false,
					dataType: "json",
					success: function(data) {
						console.log(data)
						const curr = data.res_body.ret.data;																							
						const html = `									
									<td>${index+1}</td>
									<td class="id">${curr._id}</td>
									<td><img src="${curr.logo}"></td>
									<td>${curr.position}</td>
									<td>${curr.company}</td>
									<td>${curr.address}</td>
									<td>${curr.salary}</td>
									<td><a href="#" class="update" data-toggle="modal" data-target="#updateModal">修改</a><a href="javascript:;" class="del">删除</a></td>
									`;				
						tr.html(html);
						console.log(this);							
						$("#updateModal").modal("hide");
						$(".form-update")[0].reset();					
					}
				});				
			},
			/* 删除 */
			delPosition(){
				let $src = $(event.target);
				let $tr = $src.parents("tr");
				console.log($src.parents("tr"));
				let id = $tr.children(".id").text();
				console.log(id)
				$.ajax({
					type: "get",
					url: "/api/positions/delete.do",
					data: {_id:id},
					dataType: "json",
					success: function(data) {
						$tr.remove();
					}
				});
			}
		});
		new Position();		
	});
});