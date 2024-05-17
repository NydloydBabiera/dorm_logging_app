<template>
  <div class="shadow p-3 mb-5 bg-white rounded" id="tableBody">
    <h1>Tenant Registration</h1>
    <div class="headerParam">
      <b-input-group prepend="Search" class="mt-3">
        <b-form-input v-model="inputSearch" @keyup="fetchAllTenants()" />
        <b-form-input v-model="curfewTime" disabled/>
        <b-button @click="onAddUser()" hover variant="outline-primary" class="ml-5">Add Tenant</b-button>
      </b-input-group>
      <!-- modal -->
      <!-- User Modal -->
      <b-modal class="userModal" id="userModal" :title="userModalTitle" no-close-on-backdrop hide-footer centered>
        <b-form @submit="addGuardianDetails">
          <b-row class="mx-auto">
            <b-form-input v-model="userInfo.first_name" type="text" debounce="500" placeholder="First name"
              aria-required="true" required></b-form-input>
          </b-row>
          <b-row class="mx-auto mt-2">
            <b-form-input v-model="userInfo.middle_name" type="text" debounce="500" placeholder="Middle name"
              required></b-form-input>
          </b-row>
          <b-row class="mx-auto mt-2">
            <b-form-input v-model="userInfo.last_name" type="text" debounce="500" placeholder="Last name"
              required></b-form-input>
          </b-row>
          <b-row class="mx-auto mt-2">
            <b-form-input v-model="userInfo.contact_no" type="text" debounce="500" placeholder="Contact no."
              required></b-form-input>
          </b-row>
          <b-row class="mx-auto mt-2">
            <b-form-select id="select-role" v-model="userInfo.gender" :options="optionRole" required>
              <template #first>
                <b-form-select-option :value="selected" disabled>-- Gender --</b-form-select-option>
              </template>
            </b-form-select>
          </b-row>

          <b-row class="mx-auto mt-2">
            <b-form-input v-model="userInfo.address_line1" type="text" debounce="500"
              placeholder="Address line 1"></b-form-input>
          </b-row>
          <b-row class="mx-auto mt-2">
            <b-form-input v-model="userInfo.address_line2" type="text" debounce="500"
              placeholder="Address line 2"></b-form-input>
          </b-row>
          <b-row class="mx-auto mt-2">
            <b-form-input v-model="userInfo.city_address" type="text" debounce="500" placeholder="City Address"
              required></b-form-input>
          </b-row>
          <b-row class="mx-auto mt-2">
            <b-form-input v-model="userInfo.provincial_address" type="text" debounce="500"
              placeholder="Province"></b-form-input>
          </b-row>
          <b-row class="mx-auto mt-2">
            <b-form-input v-model="userInfo.regional_address" type="text" debounce="500"
              placeholder="Region"></b-form-input>
          </b-row>
          <hr class="mt-4" />
          <div class="w-100">
            <b-button variant="primary" class="float-right ml-1" type="submit">
              <!-- <font-awesome-icon :icon="['fas', 'floppy-disk']" /> Save User -->
              NEXT
            </b-button>
            <b-button @click="$bvModal.hide('userModal')" class="float-right">
              CANCEL
              <!-- <font-awesome-icon :icon="['fas', 'xmark']" /> Cancel -->
            </b-button>
          </div>
        </b-form>
      </b-modal>
      <!-- user modal end -->
      <!-- guardian modal start -->
      <b-modal class="guardianModal" id="guardianModal" :title="guardianModalTitle" no-close-on-backdrop hide-footer
        centered>
        <b-overlay :show="loadingOnSave" rounded="sm">
          <b-form @submit="onSaveUser">
            <b-row class="mx-auto mt-2">
              <b-form-input v-model="guardianInfo.first_name" type="text" debounce="500" placeholder="First name"
                required></b-form-input>
            </b-row>
            <b-row class="mx-auto mt-2">
              <b-form-input v-model="guardianInfo.middle_name" type="text" debounce="500" placeholder="Middle name"
                required></b-form-input>
            </b-row>
            <b-row class="mx-auto mt-2">
              <b-form-input v-model="guardianInfo.last_name" type="text" debounce="500" placeholder="Last name"
                required></b-form-input>
            </b-row>
            <b-row class="mx-auto mt-2">
              <b-form-input v-model="guardianInfo.contact_no" type="text" debounce="500" placeholder="Contact No."
                required></b-form-input>
            </b-row>
            <hr class="mt-4" />
            <div class="w-100">
              <b-button variant="primary" class="float-right ml-1" type="submit">
                <!-- <font-awesome-icon :icon="['fas', 'floppy-disk']" /> Save User -->
                SAVE
              </b-button>
              <b-button @click="$bvModal.hide('guardianModal')" class="float-right">
                CANCEL
                <!-- <font-awesome-icon :icon="['fas', 'xmark']" /> Cancel -->
              </b-button>
            </div>
          </b-form>
        </b-overlay>
      </b-modal>

      <!-- modal end -->
    </div>
    <div class="dataBody">
      <!-- data table start -->
      <b-table hover bordered :items="tenantList" :fields="tblHeaderCol" :per-page="perPage" :current-page="currentPage"
        head-variant="light">
        <template #cell(action)="row">
          <b-button @click="onUpdateUser(row.item)" size="sm" class="admin__action_btn" variant="success"
            title="Edit user details">
            EDIT
            <!-- <font-awesome-icon :icon="['fas', 'pen-to-square']" /> -->
          </b-button>

          <b-button size="sm" class="admin__action_btn" variant="danger" title="Edit user details"
            @click="onDeleteUser(row.item)">
            DELETE
            <!-- <font-awesome-icon :icon="['fas', 'arrow-rotate-right']" /> -->
          </b-button>
        </template>
      </b-table>

      <!-- data table end -->
      <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage"
        aria-controls="my-table"></b-pagination>
      <b-button @click="viewLogs()" hover variant="outline-primary" class="ml-5">View Tenant Logs</b-button>
      <b-button @click="onSetCurfew()" hover variant="outline-primary" class="ml-5">Set Curfew Time</b-button>

      <!-- curfew modal start -->
      <b-modal class="setCurfewModal" id="curfewModal" :title="curfewModalTitle" no-close-on-backdrop hide-footer
        centered>
        <b-overlay :show="loadingOnSave" rounded="sm">
          <b-form @submit="onSaveCurfew">
            <b-row class="mx-auto mt-2">
              <!-- <b-form-input
                v-model="curfewDetails.curfewTime"
                type="text"
                debounce="500"
                placeholder="Curfew Time"
                required
              ></b-form-input> -->
              <b-form-timepicker v-model="curfewDetails.curfewTime" placeholder="Choose a time"
                locale="en"></b-form-timepicker>
            </b-row>
            <hr class="mt-4" />
            <div class="w-100">
              <b-button variant="primary" class="float-right ml-1" type="submit">
                SAVE
              </b-button>
              <b-button @click="$bvModal.hide('curfewModal')" class="float-right">
                CANCEL
              </b-button>
            </div>
          </b-form>
        </b-overlay>
      </b-modal>

      <!-- modal end -->
    </div>

    <b-alert :show="alert.showAlert" dismissible :variant="alert.variant" @dismissed="alert.showAlert = null"
      id="alert-message">
      {{ alert.message }}
    </b-alert>
    <!-- <b-spinner small v-show="loadingOnSave" /> -->
  </div>
</template>
<script>
import axios from "axios";
import { log } from "console";
import io from "socket.io-client";
export default {
  name: "TenantRegistration",
  data() {
    return {
      items: [],
      action: "",
      inputSearch: "",
      curfewTime: "",
      show: false,
      tenantList: [],
      userModalTitle: "",
      guardianModalTitle: "",
      curfewModalTitle: "",
      selectedUserId: "",
      currentPage: 1,
      perPage: 5,
      loadingOnSave: false,
      newTenantId: "",
      tblHeaderCol: [
        // { key: "first_name", label: "First Name" },
        // { key: "middle_name", label: "Middle Name" },
        // { key: "last_name", label: "Last Name" },
        { key: "full_name", label: "Name" },
        { key: "city_address", label: "Address" },
        { key: "gender", label: "Gender" },
        { key: "guardian_full_name", label: "Guardian" },
        { key: "contactno", label: "Contact" },
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
        contact_no: "",
      },
      curfewDetails: {
        curfewTime: "",
        description: "",
      },
      alert: {
        showAlert: 0,
        dismissSecs: 0,
        variant: "success",
        message: "",
      },
      guardianInfo: {
        first_name: "",
        middle_name: "",
        last_name: "",
        contact_no: "",
      },
      selected: null,
      optionRole: [
        { value: "M", text: "Male" },
        { value: "F", text: "Female" },
      ],
      socket: null,
    };
  },
  methods: {
    showAlert(message, variant) {
      this.alert = {
        showAlert: 5,
        dismissSecs: 2,

        variant,
        message,
      };
    },
    viewLogs() {
      this.$router.push({ path: "/DormLogs" });
    },
    onSetCurfew() {
      this.curfewModalTitle = "Set Curfew Time";
      this.userModalTitle = "Set Curfew";
      this.$bvModal.show("curfewModal");
    },
    onAddUser() {
      this.userInfo = {
        first_name: "",
        middle_name: "",
        last_name: "",
        address_line1: "",
        address_line2: "",
        city_address: "",
        provincial_address: "",
        regional_address: "",
        country: "",
        gender: "",
      };
      this.guardianInfo = {
        first_name: "",
        middle_name: "",
        last_name: "",
        contact_no: "",
      };
      this.userModalTitle = "Add Tenant";
      this.$bvModal.show("userModal");
      this.action = "add";
    },
    onUpdateUser(item) {
      this.selectedUserId = item.user_id;
      let userGender;
      if (item.gender == "M" || item.gender == "MALE") {
        userGender = "M";
      } else {
        userGender = "F";
      }

      this.userInfo = {
        first_name: item.first_name,
        middle_name: item.middle_name,
        last_name: item.last_name,
        address_line1: item.address_line1,
        address_line2: item.address_line2,
        city_address: item.city_address,
        provincial_address: item.provincial_address,
        regional_address: item.regional_address,
        country: item.country,
        gender: userGender,
      };
      this.guardianInfo = {
        first_name: item.guardian_first_name,
        middle_name: item.guardian_middle_name,
        last_name: item.guardian_last_name,
        contact_no: item.contactno,
      };

      this.userModalTitle = "Edit Details";
      this.$bvModal.show("userModal");
      this.action = "edit";
    },
    onDeleteUser(item) {
      this.selectedUserId = item.user_id;
      console.log("selectedUserId:", this.selectedUserId);
      this.loadingOnSave = true;
      this.$bvModal
        .msgBoxConfirm("Are you sure you want to DELETE user details?", {
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
          if (value) this.doDeleteUser();
          this.loadingOnSave = false;
        })
        .catch((err) => {
          this.loadingOnSave = false;
          this.showAlert(err, "danger");
        });
    },

    async doDeleteUser() {
      await axios({
        method: `DELETE`,
        url: `${this.$axios.defaults.baseURL}/user/deleteUser/${this.selectedUserId}`,
      }).then(
        (res) => {
          this.fetchAllTenants();
          return res.data;
        },
        (err) => {
          console.log("ERROR:", err);
        }
      );
    },

    addGuardianDetails(e) {
      e.preventDefault();
      this.guardianModalTitle =
        this.userInfo.first_name + "'s guardian information";
      this.$bvModal.show("guardianModal");
      this.$bvModal.hide("userModal");
    },
    onSaveCurfew(e) {
      e.preventDefault();
      this.loadingOnSave = true;
      this.$bvModal
        .msgBoxConfirm("Are you sure you want to set new curfew time?", {
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
          if (value) this.doSaveCurfew();
          this.loadingOnSave = false;
          this.$bvModal.hide("guardianModal");

        })
        .catch((err) => {
          this.loadingOnSave = false;
          this.showAlert(err, "danger");
        });
    },
    onSaveUser(e) {
      e.preventDefault();
      this.loadingOnSave = true;
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
          this.$bvModal.hide("curfewModal");
        })
        .catch((err) => {
          this.loadingOnSave = false;
          this.showAlert(err, "curfewModal");
        });
    },
    async doSaveCurfew() {
      const data = {
        curfewTime: this.curfewDetails.curfewTime,
        description: "DORM",

      };
      await axios({
        method: "POST",
        url: `${this.$axios.defaults.baseURL}/activityLogs/curfewSched`,
        data,
      }).then(
        (res) => {
          this.$bvModal.hide("curfewModal");
          this.getCurfewTime();
          console.log(res);
        },
        (err) => {
          this.showAlert(err.response.data.errorMsg, "danger");
        }
      );
    },
    async doSaveUser() {
      const isAdd = this.action == "add";
      const data = {
        projCode: "DORM",
        userDetails: {
          firstName: this.userInfo.first_name,
          middleName: this.userInfo.middle_name,
          lastName: this.userInfo.last_name,
          addressLine1: this.userInfo.address_line1,
          addressLine2: this.userInfo.address_line2,
          cityAddress: this.userInfo.city_address,
          provincialAddress: this.userInfo.provincial_address,
          regionalAddress: this.userInfo.regional_address,
          country: this.userInfo.country,
          gender: this.userInfo.gender,
          contactno: this.userInfo.contact_no,
        },
        guardianDetails: {
          firstName: this.guardianInfo.first_name,
          middleName: this.guardianInfo.middle_name,
          lastName: this.guardianInfo.last_name,
          contactNo: this.guardianInfo.contact_no,
        },
      };
      await axios({
        method: `${isAdd ? "POST" : "PUT"}`,
        url: `${this.$axios.defaults.baseURL}/user/${isAdd ? "addUser" : `updateUser/${this.selectedUserId}`
          }`,
        data,
      }).then(
        (res) => {
          this.$bvModal.hide("guardian");
          this.newTenantId = res.data.newUserDetails.user_id;
          console.log("res:", res.data.newUserDetails.user_id);
          this.showAlert(
            `Successfully ${this.action == "add" ? "added" : "updated"} user.`,
            "success"
          );
          this.fetchAllTenants();

          this.sendDataToESP8266();
        },
        (err) => {
          this.showAlert(err.response.data.errorMsg, "danger");
        }
      );
    },
    async fetchAllTenants() {
      return await axios({
        method: "GET",
        url: `${this.$axios.defaults.baseURL}/user/getAllUser/dorm`,
      }).then(
        (res) => {
          // return this.tenantList = res.data.data
          this.tenantList = res.data.data.filter(
            function (val) {
              return val.full_name.includes(this.inputSearch);
            }.bind(this)
          );
        },
        (err) => {
          console.log("ERROR:", err);
        }
      );
    },
    async getCurfewTime() {
      return await axios({
        method: "GET",
        url: `${this.$axios.defaults.baseURL}/activityLogs/getCurfewSched`,
      }).then(
        (res) => {
          // return this.tenantList = res.data.data
          this.curfewTime = `Curfew: ${res.data[0].curfew_time}`
          console.log(res.data[0].curfew_time)
        },
        (err) => {
          console.log("ERROR:", err);
        }
      );
    },
    async sendDataToESP8266() {
      const data = {
        // Your data payload
        id: this.newTenantId,
      };

      // Make a POST request to the ESP8266 server
      await fetch(`${this.$axios.defaults.HARDWARE_URL}/data`, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          // Handle response if needed
          console.log("Data sent successfully");
        })
        .catch((error) => {
          // Handle error if any
          console.error("Error sending data:", error);
        });
    },
  },
  created() {
    this.fetchAllTenants();
    this.getCurfewTime();
  },
  computed: {
    rows() {
      return this.tenantList.length;
    },
  },
};
</script>

<style scoped>
#tableBody {
  text-align: center;
  margin: 40px 50px 50px;
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
