<template>
	<el-row class="container">
		<el-col :span="24" class="header">
			<el-col :span="20" class="logo">
				<img src="../assets/logo4.png" /> <span>咿呀管理后台</span>
			</el-col>
			<el-col :span="4" class="userinfo">
				<el-dropdown trigger="click">
					<img :src=" userAvatar || require('../assets/default-avatar.png')" />
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item >{{userName}}</el-dropdown-item>
						<el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-col>
		</el-col>
		<el-col :span="24" class="main">
			<aside>
				<el-menu :default-active="$route.path" class="el-menu-vertical" @open="handleopen" @close="handleclose" @select="handleselect"
					theme="dark" unique-opened router>
					<template v-for="(item,index) in $router.options.routes" v-if="(!item.hidden) && Role.permitted(identity,item.privileges || 0)">
						<el-submenu :index="index+''" v-if="!item.leaf">
							<template slot="title"><i :class="item.iconCls"></i>{{item.label}}</template>
							<el-menu-item v-for="child in item.children" :index="child.path" v-if="(!child.hidden) && Role.permitted(identity,child.privileges || 0)">{{child.meta.label}}</el-menu-item>
						</el-submenu>
						<el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path"><i :class="item.iconCls"></i>{{item.children[0].meta.label}}</el-menu-item>
					</template>
					</el-menu>
			</aside>
			<section class="content-container">
				<div class="grid-content bg-purple-light">
					<el-col :span="24" class="breadcrumb-container">
						<div class="title">{{$route.meta.label}}</div>
						<el-button v-if="$route.path.split('/').length > 2" icon="arrow-left" @click="close">返回</el-button>
					</el-col>
					<el-col :span="24" class="content-wrapper">
						<!-- <transition> -->
							<!-- <template v-if="$route.meta.keepAlive">
								<keep-alive>
								    <router-view ></router-view>
								</keep-alive>
							</template>
							<template v-else>
								<router-view></router-view>
							</template> -->



							<!-- <router-view></router-view> -->

						<!-- </transition> -->
							<keep-alive>
							    <router-view v-if="($route.meta.keepAlive || false)"></router-view>
							</keep-alive>
							<router-view v-if="(!($route.meta.keepAlive || false))"></router-view>
					</el-col>
				</div>
			</section>
		</el-col>
	</el-row>
</template>

<script>
	import Role from 'common/js/role.js';
	export default {
		data() {
			return {
				identity:0,
				userName: '',
				userAvatar: '',
				Role:Role,
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				}
			}
		},
		methods: {
			onSubmit() {
				console.log('submit!');
			},
			handleopen() {
				//console.log('handleopen');
			},
			handleclose() {
				//console.log('handleclose');
			},
			handleselect: function (a, b) {
			},
			close:function(){
				window.history.go(-1);
			},
			//退出登录
			logout: function () {
				var _this = this;
				this.$confirm('确认退出吗?', '提示', {
					//type: 'warning'
				}).then(() => {
					sessionStorage.removeItem('user');
					this.$router.push('/login');
				}).catch(() => {

				});


			},
			navMessage:function(){
				this.$router.push('/notification');
			}
		},
		mounted() {
			//console.log(this.$route);
			this.identity = parseInt(sessionStorage.getItem('identity'));
			var userInfo = sessionStorage.getItem('user');
			if(userInfo){
				userInfo = JSON.parse(userInfo);
				this.userName = userInfo.nickName || "";
				this.userAvatar = userInfo.headImg || "";
			}
		}
	}

</script>

<style scoped lang="scss">
	.container {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
		.header {
			height: 60px;
			line-height: 60px;
			background: #1F2D3D;
			color: #c0ccda;
			.userinfo {
				text-align: right;
				padding-right: 35px;
				img {
					width: 40px;
					height: 40px;
					border-radius: 20px;
					margin: 10px 0px 10px 10px;
					float: right;
				}
			}
			.logo {
				font-size: 22px;
				img {
					width: 40px;
					float: left;
					margin: 10px 10px 10px 18px;
				}
				.txt {
					color: #20a0ff
				}
			}
		}
		.main {
			background: #324057;
			position: absolute;
			top: 60px;
			bottom: 0px;
			overflow: hidden;
			aside {
				width: 230px;
				height: 100%;
				overflow: auto;
			}
			.content-container {
				background: #f1f2f7;
				position: absolute;
				right: 0px;
				top: 0px;
				bottom: 0px;
				left: 230px;
				overflow-y: scroll;
				padding: 20px;
				.breadcrumb-container {
					height: 24px;
					margin-bottom: 20px;
					.title {
						position: absolute;
						margin-left: -170px;
						left: 50%;
						width: 340px;
						text-align: center;
						color: #475669;
						font-size: 20px;
					}
					.breadcrumb-inner {
						margin-top: 5px;
						float: right;
					}
				}
				.content-wrapper {
					background-color: #fff;
					box-sizing: border-box;
				}
			}
		}
	}
</style>
