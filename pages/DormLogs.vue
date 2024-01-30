<template>
    <div class="shadow p-3 mb-5 bg-white rounded" id="tableBody">
      <b-table hover bordered :items="tenantLogs" :fields="tblHeaderCol"></b-table>
    </div>
</template>
<script>
export default{
    name: "DormLogs",
    data(){
      return{
        tblHeaderCol:[
          {key: "full_name", label: "Name"},
          {key: "time_in", label: "IN"},
          {key: "time_out", label: "OUT"}
        ],
        tenantLogs: [],
      }
    }
}
</script>

<style scoped>
#tableBody {
  text-align: center;
  margin: 40px 50px 50px;
  /* border: 1px solid black; */
}
</style>