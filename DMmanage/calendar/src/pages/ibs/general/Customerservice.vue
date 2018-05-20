<template>
	<section style="background-color: #f1f2f7">

        <div class="main-box">
            <div class="main-img">
                <div class="imgmain">
                    <img  src="../../../assets/Yomi.jpg">
                    <span style="margin-left:10px;">客服：优米Yomi</span>
                </div>
                <div class="imgmain">
                   <img  src="../../../assets/Ace.jpg">
                    <span style="margin-left:10px;">客服：艾斯Ace</span>
                </div>       
                <div class="textmain2">
                    <p style="margin: 0px;">工作时间：</p> 
                    <p style="margin: 0px;">小周——周一至周六（10:00~19:00）</p>
                    <p style="margin: 0px;">大周——周一至周五（10:00~19:00）</p>
               </div>    
            </div>
        </div>

	</section>
</template>

<script>
	

	export default {
		data() {
			return {
           

			}
		},
		methods: {
			//获取用户列表
					
		},
		mounted() {
		
		}
	}

</script>

<style scoped>
.main-box{
    width:100%;
    background: #fff;
}
.main-img{
   width:500px;
   margin: 0 auto;
}
.imgmain{
    width:250px;
    float: left;
}
.textmain2{
    width: 500px;
    float: left;
    margin-left: 10px;
    margin-top: 20px;
    font-size: 18px;
}    
.imgmain img{
    width:100%;
}
</style>
