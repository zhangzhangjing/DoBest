var id = 1
export const mutations = {
  increment (state, n) {
    if(n*1){
      state.count += n * 1
      var date = new Date();
      var nowtime = date.getFullYear()+"/"+(date.getMonth()+1)*1+"/"+date.getDate()+"  "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()
      var record = {
        id: id ++,
        date: nowtime,
        wage: (n*1).toFixed(2),
        total: (state.count*1).toFixed(2)
      }
      state.tableData.push(record)
    }
  }
}
