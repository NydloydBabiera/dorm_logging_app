<template>
  <div class="shadow p-3 mb-5 bg-white rounded" id="tableBody">
    <h1>Tenant Logs</h1>
    <b-table
      hover
      bordered
      :items="tenantLogs"
      :fields="tblHeaderCol"
    ></b-table>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "DormLogs",
  data() {
    return {
      tblHeaderCol: [
        { key: "fullname", lasheeeel: "Name" },
        { key: "time_in", label: "OUT" },
        { key: "time_out", label: "IN" },
        { key: "activity_date", label: "DATE" },
      ],
      tenantLogs: [],
    };
  },
  methods: {
    async fetchAllLogs() {
      return await axios({
        method: "GET",
        url: `${this.$axios.defaults.baseURL}/activityLogs/getAllLogs`,
      }).then(
        (res) => {
          this.tenantLogs = res.data;
        },
        (err) => {
          console.log("ERROR:", err);
        }
      );
    },
    // socketEvents() {
    //   // this.$_socket.on('logs', (data) => {
    //   //   console.log(data)
    //   // });
    // },
  },
  created() {
    this.fetchAllLogs();
    
  },
};
</script>

<style scoped>
#tableBody {
  text-align: center;
  margin: 40px 50px 50px;
  /* border: 1px solid black; */
}
</style> 