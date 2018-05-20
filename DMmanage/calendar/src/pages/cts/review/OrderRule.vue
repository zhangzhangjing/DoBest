<template>
    <section>
        <el-col :span="24" class="toolbar">
            <el-form :inline="true">
                <el-form-item>
                    <el-select v-model="product" placeholder="请选择">
                        <el-option v-for="item in allProduct" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
				</el-form-item>
            </el-form>
        </el-col>
    </section>
</template>

<script>
  import NProgress from 'nprogress'
  import api from 'src/api/api';
  import {EntityType,ApplicationReviewStatus} from 'common/js/BaseModel';
  import Formatter from 'common/js/Formatter';
  import AddressSelector from 'src/components/AddressSelector';

  export default {
    data() {
      return {
            product: '',
            allProduct: []
      }
    },
    watch: {
    },
    created(){
    },
    methods: {
      
    },
    mounted() {
    }
  }

</script>

<style scoped>
</style>
