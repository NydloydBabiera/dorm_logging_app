<template>
  <div>
    <SideBar />
    <div class="shadow p-3 mb-5 bg-white rounded" id="tableBody">
      <h1>Student Registration</h1>
      <div class="headerParam">
        <b-input-group prepend="Search" class="mt-3">
          <b-form-input v-model="inputSearch" @keyup="fetchAllTenants()" />
          <b-form-input v-model="curfewTime" disabled />
          <b-button @click="onAddUser()" hover variant="outline-primary" class="ml-5">Add Student</b-button>
        </b-input-group>
        <!-- modal -->
        <!-- User Modal -->
        <b-modal class="userModal" id="userModal" :title="userModalTitle" no-close-on-backdrop hide-footer centered>
          <b-form @submit="onSaveUser">
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
              <b-form-select id="select-role" v-model="userInfo.gender" :options="optionRole" required>
                <template #first>
                  <b-form-select-option :value="selected" disabled>-- Gender --</b-form-select-option>
                </template>
              </b-form-select>
            </b-row>
            <b-row class="mx-auto mt-2">
              <b-form-input v-model="userInfo.contact_no" type="text" debounce="500" placeholder="Contact no."
                required></b-form-input>
            </b-row>
            <b-row class="mx-auto mt-2">
              <b-form-input v-model="userInfo.course" type="text" debounce="500" placeholder="Course"
                required></b-form-input>
            </b-row>
            <b-row class="mx-auto mt-2">
              <b-form-input v-model="userInfo.year" type="text" debounce="500" placeholder="Year" required></b-form-input>
            </b-row>
            <b-row class="mx-auto mt-2">
              <b-form-input v-model="userInfo.address_line1" type="text" debounce="500"
                placeholder="Lot no., Blk, Barangay"></b-form-input>
            </b-row>
            <b-row class="mx-auto mt-2">
              <b-form-input v-model="userInfo.city_address" type="text" debounce="500" placeholder="City"></b-form-input>
            </b-row>
            <!-- <b-row class="mx-auto mt-2">
              <b-form-input v-model="userInfo.city_address" type="text" debounce="500" placeholder="Room no."
                required></b-form-input>
            </b-row> -->
            <!-- <b-row class="mx-auto mt-2">
              <b-form-input v-model="userInfo.provincial_address" type="text" debounce="500"
                placeholder="ID number"></b-form-input>
            </b-row> -->
            <b-row class="mx-auto mt-2">
              <b-form-select id="select-role" v-model="userInfo.userRole" :options="userRole" @change="onRoleChange"
                required>
                <template #first>
                  <b-form-select-option :value="selected" disabled>-- User Type --</b-form-select-option>
                </template>
              </b-form-select>
            </b-row>

            <b-row class="mx-auto mt-2">
              <b-form-input v-model="userInfo.rfid" type="text" debounce="500"
                :placeholder="dynamicPlaceholder"></b-form-input>
            </b-row>
            <hr class="mt-4" />
            <div class="w-100">
              <b-button variant="primary" class="float-right ml-1" type="submit">
                SAVE
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
        <!-- <b-button @click="viewLogs()" hover variant="outline-primary" class="ml-5">View Tenant Logs</b-button> -->
        <!-- <b-button @click="onSetCurfew()" hover variant="outline-primary" class="ml-5">Set Curfew Time</b-button> -->
        <b-modal class="scanFingerModal" id="scanFingerModal" :title="guardianModalTitle" no-close-on-backdrop
          hide-footer centered>
          {{ fingerPrintStatus }}
        </b-modal>

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
  </div>
</template>
<script>
import { throws } from "assert";
import axios from "axios";
import { log } from "console";
import io from "socket.io-client";
import SideBar from "~/components/SideBar.vue";
export default {
  name: "TenantRegistration",
  components: {
    SideBar,
  },
  data() {
    return {
      items: [],
      fingerPrintStatus: "",
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
        { key: "course", label: "Course" },
        { key: "year", label: "Year" },
        { key: "role_user", label: "User Type" },
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
        userRole: "",
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
      userRole: [
        { value: "ADMIN", text: "ADMIN" },
        { value: "STUDENT", text: "STUDENT" },
        { value: "TEACHER", text: "TEACHER" },
      ],
      socket: null, ws: null, // WebSocket instance
      messages: [], // Array to store messages
      placeholders: {   // Placeholders for each role
        STUDENT: 'Tap RFID...',
        TEACHER: 'Place finger to register...',
      },
    };
  },
  methods: {
    connectWebSocket() {
      const esp32WebSocketURL = `ws://192.168.68.103/ws`; // ESP32 IP
      this.ws = new WebSocket(esp32WebSocketURL);

      // WebSocket connection opened
      this.ws.onopen = () => {
        console.log("WebSocket connected to ESP32");
        this.messages.push("WebSocket connected to ESP32");
      };

      // Receiving messages from ESP32
      this.ws.onmessage = (event) => {
        console.log("Message received from ESP32:", event.data);
        this.userInfo.rfid = event.data
        // if (this.userInfo.roleUser == "STUDENT") {
        //   console.log("reached here")
        //   this.userInfo.rfid = event.data
          
        // } else {
        //   this.fingerPrintStatus = event.data
        //   this.$bvModal.hide("scanFingerModal")
        // }

        this.fingerPrintStatus = event.data
        this.messages.push(event.data); // Add message to the array
      };

      // WebSocket connection closed
      this.ws.onclose = () => {
        console.log("WebSocket disconnected");
        this.messages.push("WebSocket disconnected");
      };

      // WebSocket error
      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        this.messages.push("WebSocket error");
      };
    },
    sendCommand(command) {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        console.log("Sending command to ESP32:", command);
        this.ws.send(command);
      } else {
        console.error("WebSocket is not connected.");
      }
    },
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
        contactNo: "",
        gender: "",
        roleUser: "",
        course: "",
        year: "",
        rfid: "",
      };
      this.guardianInfo = {
        first_name: "",
        middle_name: "",  
        last_name: "",
        contact_no: "",
      };
      this.userModalTitle = "Add Student";
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
      const data = {
        projCode: "STUDENT"
      }
      await axios({
        method: `DELETE`,
        url: `${this.$axios.defaults.baseURL}/user/deleteUser/${this.selectedUserId}`,
        data
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
        projCode: "STUDENT",
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
          contacno: this.userInfo.contact_no,
          course: this.userInfo.course,
          year: this.userInfo.year,
          roleUser: this.userInfo.userRole,
          rfid: this.userInfo.rfid
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
        url: `${this.$axios.defaults.baseURL}/user/getAllUser/student`,
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

    // Send command to ESP32 when role changes
    onRoleChange() {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        const command = JSON.stringify({
          command: "ROLE_SELECTED",
          payload: this.userInfo.userRole,
        });
        console.log("Sending command to ESP32:", command);
        this.ws.send(command);
        this.messages.push(`Command sent: ROLE_SELECTED -> ${this.selectedRole}`);
      } else {
        console.error("WebSocket is not connected.");
        this.messages.push("Failed to send command: WebSocket not connected.");
      }
    },
  },
  created() {
    this.fetchAllTenants();
    // this.getCurfewTime();
  },
  mounted() {
    this.connectWebSocket(); // Establish WebSocket connection when the component is mounted
  },
  computed: {
    rows() {
      return this.tenantList.length;
    },
    dynamicPlaceholder() {
      if(this.userInfo.userRole === "TEACHER"){
       this.guardianModalTitle = "Scan finger print"
       
      // this.$bvModal.show("scanFingerModal")
      }
      if(this.userInfo.userRole === "STUDENT"){
       this.guardianModalTitle = "Tap RFID"
       
      // this.$bvModal.show("scanFingerModal")
      }
      return this.placeholders[this.userInfo.userRole] || 'Enter value...';
    },
  },
};
</script>

<style scoped>
#tableBody {
  text-align: center;
  padding: 32px 56px;
  margin: 64px 44px 64px 254px;
  border: 1px solid black;
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
