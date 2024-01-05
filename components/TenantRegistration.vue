<template>
  <div class="shadow p-3 mb-5 bg-white rounded" id="tableBody">
    <h1>Registration</h1>
    <div class="headerParam">
      <b-input-group prepend="Search" class="mt-3">
        <b-form-input
          v-model="inputSearch"
          @keyup.enter="fetchAllTenants()"
        ></b-form-input>
        <b-button
          @click="onAddUser()"
          hover
          variant="outline-primary"
          class="ml-5"
          >Add Tenant</b-button
        >
      </b-input-group>
      <!-- modal -->
      <b-modal
        class="userModal"
        id="userModal"
        :title="userModalTitle"
        no-close-on-backdrop
        hide-footer
        centered
      >
        <b-form @submit="onSaveUser">
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
            <b-form-select
              id="select-role"
              v-model="selected"
              :options="optionRole"
              required
            >
              <template #first>
                <b-form-select-option :value="null" disabled
                  >-- Gender --</b-form-select-option
                >
              </template>
            </b-form-select>
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
          <hr class="mt-4" />
          <div class="w-100">
            <b-button variant="primary" class="float-right ml-1" type="submit">
              <font-awesome-icon :icon="['fas', 'floppy-disk']" /> Save User
              <!-- <b-spinner small v-show="loadingOnSave" /> -->
            </b-button>
            <b-button @click="$bvModal.hide('userModal')" class="float-right">
              <font-awesome-icon :icon="['fas', 'xmark']" /> Cancel
            </b-button>
          </div>
        </b-form>
      </b-modal>
    </div>
    <div class="dataBody">
      <!-- data table start -->
      <b-table
        hover
        bordered
        :items="tenantList"
        :fields="tblHeaderCol"
        head-variant="light"
      >
        <template #cell(action)="">
          <b-button size="sm">
            EDIT
            <!-- <font-awesome-icon :icon="['fas', 'pen-to-square']" /> -->
          </b-button>

          <b-button size="sm">
            DELETE
            <!-- <font-awesome-icon :icon="['fas', 'arrow-rotate-right']" /> -->
          </b-button>
        </template>
      </b-table>

      <!-- data table end -->
    </div>
  </div>
</template>
  <script>
import axios from "axios";
import { log } from "console";
export default {
  name: "TenantRegistration",
  data() {
    return {
      items: [],
      inputSearch: "",
      show: false,
      tenantList: [],
      userModalTitle: "",
      tblHeaderCol: [
        { key: "first_name", label: "First Name" },
        { key: "middle_name", label: "Middle Name" },
        { key: "last_name", label: "Last Name" },
        { key: "city_address", label: "Address" },
        { key: "gender", label: "Gender" },
        { key: "action", label: "Actions" },
      ],
      userInfo: {
        first_name: "",
        middle_name: "",
        last_name: "",
        address_line1: " ",
        address_line2: "",
        city_address: "",
        provincial_address: "",
        regional_address: "",
        country: "",
        gender: "",
      },
      selected: null,
      optionRole: [
        { value: "M", text: "Male" },
        { value: "F", text: "Female" },
      ],
    };
  },
  methods: {
    onAddUser() {
      this.userInfo = {
        first_name: "",
        middle_name: "",
        last_name: "",
        address_line1: " ",
        address_line2: "",
        city_address: "",
        provincial_address: "",
        regional_address: "",
        country: "",
        gender: "",
      };
      this.userModalTitle = "Add Tenant";
      this.$bvModal.show("userModal");
    },
    onSaveUser(e) {
      e.preventDefault();

      this.$bvModal
        .msgBoxConfirm("Are you sure you want to Save user details?", {
          title: "Please Confirm",
          size: "sm",
          buttonSize: "sm",
          okVariant: "primary",
          okTitle: "YES",
          cancelTitle: "NO",
          footerClass: "p-2",
          centered: true,
        })
        .then((value) => {
          if (value) this.doSaveUser();
          this.loadingOnSave = false;
        })
        .catch((err) => {
          this.loadingOnSave = false;
          this.showAlert(err, "danger");
        });
    },
    async fetchAllTenants() {
      return await axios({
        method: "GET",
        url: `${this.$axios.defaults.baseURL}/user/getAllUser`,
      }).then(
        (res) => {
          this.tenantList = res.data.filter(
            function (val) {
              return (
                val.first_name.includes(this.inputSearch) ||
                val.middle_name.includes(this.inputSearch) ||
                val.last_name.includes(this.inputSearch)
              );
            }.bind(this)
          );
        },
        (err) => {
          console.log("ERROR:", err);
        }
      );
    },
  },
  created() {
    this.fetchAllTenants();
  },
  onSaveUser(e) {},
};
</script>

<style scoped>
#tableBody {
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