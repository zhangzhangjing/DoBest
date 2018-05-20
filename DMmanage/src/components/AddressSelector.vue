<template>
    <div >
        <el-select v-model="i_province" placeholder="请选择" style="width: 30%;" @change="provinceSelectorChanged">
            <el-option v-for="item in provinces" :label="item.province" :value="item.code"></el-option>
        </el-select>
        <el-select v-model="i_city" placeholder="请选择" style="width: 30%;" @change="citySelectorChanged">
            <el-option v-for="item in cities" :label="item.city" :value="item.code"></el-option>
        </el-select>
        <el-select v-model="i_district" placeholder="请选择" style="width: 30%;" @change="districtSelectorChanged">
            <el-option v-for="item in districts" :label="item.area" :value="item.code"></el-option>
        </el-select>
    </div>

</template>

<script>
import yiya from 'src/api/yiya';

export default {
  props: {
    province: {
      type: Number,
      default: 0
    },
    city: {
      type: Number,
      default: 0
    },
    district: {
      type: Number,
      default: 0
    }
  },
  data:function() {
    return {
      provinces:[],
      cities:[],
      districts:[],
      i_province:this.province || '',
      i_city:this.city || '',
      i_district:this.district || ''
    }
  },
  async created () {

      await this.provinceFetch();
      if (this.province){
          await this.cityFetch(this.province);
      }
      if (this.city){
          await this.districtFetch(this.city);
      }

      console.log("AddressSelector created", this.province);




  },
  methods: {
      async provinceFetch(){
        const list = await yiya.provinceFetch();
        this.provinces = list;
        return Promise.resolve(list)
      },
      async cityFetch(province){
          const list = await yiya.cityFetch(province);
          this.cities = list;
          //console.log("result:", list);
          return Promise.resolve(list)
      },
      async districtFetch(city){
          const list = await yiya.districtFetch(city);
          this.districts = list;
          return Promise.resolve(list)
      },
      provinceSelectorChanged:function(){
          var code = this.i_province;
          console.log("provinceSelectorChanged:", code);
          this.cities = [];
          this.districts = [];
          this.i_city = "";
          this.i_district = "";
          if (code)
          {
              this.cityFetch(code);
          }
          this.selectorChanged();
      },
      citySelectorChanged:function(){
          var code = this.i_city;
          console.log("citySelectorChanged", code)
          this.districts = [];
          this.i_district = '';
          if (code)
          {
              this.districtFetch(code);
          }
          this.selectorChanged();
      },
      districtSelectorChanged:function(){
          this.selectorChanged();
      },
      selectorChanged:function(){
          console.log("selectorChanged")
          this.$nextTick(() => {
              console.log("selectorChanged nextTick")
            this.$emit('change', this.i_province, this.i_city, this.i_district)
          })
      }
  },
  beforeDestroy () {
      console.log("AddressSelector beforeDestroy");
  }
}
</script>

<style lang="scss" scoped>

</style>
