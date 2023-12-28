<template>
  <div class="tableBody">
    <h1>Registration</h1>
    <div class="headerParam">
      <b-input-group prepend="Search" class="mt-3">
        <b-form-input></b-form-input>
        <b-button
          @click="show = true"
          hover
          variant="outline-primary"
          class="ml-5"
          >Add Tenant</b-button
        >
      </b-input-group>

      <b-modal v-model="show" title="Add Tenant">
        <b-row class="mx-auto">
          <b-form-input
            type="text"
            debounce="500"
            placeholder="First name"
          ></b-form-input>
        </b-row>
        <b-row class="mx-auto mt-2">
          <b-form-input
            type="text"
            debounce="500"
            placeholder="Middle name"
          ></b-form-input>
        </b-row>
        <b-row class="mx-auto mt-2">
          <b-form-input
            type="text"
            debounce="500"
            placeholder="Last name"
          ></b-form-input>
        </b-row>
        <b-row class="mx-auto mt-2">
          <b-form-input
            type="text"
            debounce="500"
            placeholder="Address line 1"
          ></b-form-input>
        </b-row>
        <b-row class="mx-auto mt-2">
          <b-form-input
            type="text"
            debounce="500"
            placeholder="Address line 2"
          ></b-form-input>
        </b-row>
        <b-row class="mx-auto mt-2">
          <b-form-input
            type="text"
            debounce="500"
            placeholder="Province"
          ></b-form-input>
        </b-row>
        <b-row class="mx-auto mt-2">
          <b-form-input
            type="text"
            debounce="500"
            placeholder="Region"
          ></b-form-input>
        </b-row>
        <template #modal-footer>
          <div class="w-100">
            <b-button
              variant="primary"
              size="sm"
              class="float-right"
              @click="show = false"
            >
              Close
            </b-button>
          </div>
        </template>
      </b-modal>
    </div>
    <div class="dataBody">
      <b-table
        hover
        bordered
        :items="tenantList"
        :fields="tblHeaderCol"
        head-variant="light"
      ></b-table>
    </div>
  </div>
</template>
  <script>
import axios from "axios";
export default {
  name: "TenantRegistration",
  data() {
    return {
      items: [
        // {
        //   age: 40,
        //   first_name: "Dickerson",
        //   last_name: "Macdonald",
        //   course: "BSCpE",
        // },
        // { age: 21, first_name: "Larsen", last_name: "Shaw", course: "BSCpE" },
        // { age: 89, first_name: "Geneva", last_name: "Wilson", course: "BSCpE" },
        // { age: 38, first_name: "Jami", last_name: "Carney", course: "BSCpE" },
      ],
      show: false,
      tblHeaderCol: [
        { key: "firstname", label: "First Name" },
        { key: "middlename", label: "Middle Name" },
        { key: "lastname", label: "Last Name" },
        { key: "username", label: "Username" },
        { key: "user_role", label: "Role" },
      ],

      tenantList: [],
    };
  },
  methods: {
    async fetchAllTenants() {
      return await axios({
        method: "GET",
        url: `${this.$axios.defaults.baseURL}/user/getAllUser`,
      }).then((res) => {
        this.tenantList = res.data.filter(
          function (val) {
            return (
              (val.firstname.includes(this.inputSearch) ||
                val.middlename.includes(this.inputSearch) ||
                val.username.includes(this.inputSearch) ||
                val.lastname.includes(this.inputSearch)) &&
              val.user_role.includes(this.selectedRole)
            );
          }.bind(this)
        );
      }, (err) => {
        console.log("ERROR:",err);
      });

    },
  },
  created(){
    this.fetchAllTenants();
    console.log("tenantList:",tenantList)
  }
};
</script>

<style scoped>
.tableBody {
  text-align: center;
  margin: 100px 50px 50px;
  /* border: 1px solid black; */
}
.dataBody {
  text-align: center;
  margin-top: 10px;
}
.headerParam {
  text-align: left;
  flex-wrap: wrap;
}
</style>