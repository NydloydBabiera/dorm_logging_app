<template>
  <div class="shadow p-3 mb-5 bg-white rounded" id="tableBody">
    <h1>Tenant Logs</h1>
    <b-table hover bordered :items="tenantLogs" :fields="tblHeaderCol"></b-table>
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
      role: "",
      user_id: ""
    };
  },
  mounted() {
    this.role = localStorage.role;
    this.user_id = localStorage.user_id

    setTimeout(() => {
      this.fetchAllLogs();
    }, 1000);
  },
  methods: {
    async fetchAllLogs() {
      return await axios({
        method: "GET",
        url: `${this.$axios.defaults.baseURL}/activityLogs/getAllLogs`,
      }).then(
        (res) => {
          // const role = localStorage.role;
          if (this.role != "admin") {
            console.log("user_id", this.user_id)
            this.tenantLogs = res.data.filter(val => val.user_id == this.user_id);
          }
          else {
            console.log("role", this.role)
            this.tenantLogs = res.data
          }
        },
        (err) => {
          console.log("ERROR:", err);
        }
      );
    },
  },
  created() {

  },
};
</script>

<style scoped> run 
#tableBody {
  text-align: center;
  margin: 40px 50px 50px;
  /* border: 1px solid black; */
}
</style>