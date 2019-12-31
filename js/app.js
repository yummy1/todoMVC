(function (Vue) {
	const items = []
	Vue.directive('app-focus',{
		inserted(el,binding){
			el.focus()
		}
	})
	var app = new Vue({
		el:'#app',
		data: {
			tittle:'hello',
			items,
			currentItem:null,
			filterStatus:'all'
		},
		methods: {
			removeItem (index) {
				console.log("remove",index)
				this.items.splice(index,1)
			},
			removeCompleted(){
				//把未完成数过滤掉
				this.items = this.items.filter(item => !item.completed)
			},
			addItem (event) {
				console.log('addItem', event.target.value)
				const content = event.target.value.trim()
				if(content.length == 0) {
					return
				}
				const id = this.items.length + 1
				this.items.push({
					id,
					content,
					completed:true
				})
				event.target.value = ''
			},
			toEdit(item){
				console.log("edit")
				this.currentItem = item
			},
			cancelEdit(){
				console.log("cancelEdit")
				this.currentItem = null
			},
			finishEdit(item,index, event){
				console.log("finishEdit")
				const content = event.target.value.trim()
				if(!content){
					this.removeItem(index)
				}else{
					item.content = content
				}
				this.currentItem = null
			}
		},
		computed:{
			//未完成的数
			remaining(){
				// 把已完成的过滤掉
				return this.items.filter(item => item.completed).length
			},
			toggleAll:{
				get () {
					return this.remaining === 0
				},
				set (newStatus) {
					this.items.forEach((item) => {
						this.completed = newStatus
					})
				}
			},
			filterItems(){
				switch (this.filterStatus) {
					case 'all':{
						return this.items
					}
					break
					case 'active':{
						return this.items.filter(item => !item.completed)
					}
					break
					case 'completed':{
						return this.items.filter(item => item.completed)
					}
					break
				}
			}
		},
		directives:{
			'todo-focus':{
				update(el, binding){
					if (binding.value){
						el.focus()
					}
				}
			}
		}
	})

})(Vue);
window.onhashchange = function () {
	console.log('hash改变了', window.location.hash)
	const hash = window.location.hash.substr(2) || 'all'
	console.log('hash', hash)
	app.filterStatus = hash
}
window.onhashchange()
