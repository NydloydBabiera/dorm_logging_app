<template>
    <div>
        <SideBar />
        <div class="shadow p-3 mb-5 bg-white rounded" id="tableBody">
            <b-alert :show="alert.showAlert" dismissible :variant="alert.variant" @dismissed="alert.showAlert = null"
                id="alert-message">
                {{ alert.message }}
            </b-alert>
            <h1>Subject Schedule</h1>
            <b-input-group prepend="Search" class="mt-3">
                <b-form-input v-model="inputSearch" @keyup="fetchAllSchedules()" />
                <b-button @click="onAddSubject()" hover variant="outline-primary" class="ml-5">Add Schedule</b-button>
            </b-input-group>
            <!-- table body -->
            <div class="dataBody">
                <b-table hover bordered :items="scheduleList" :fields="tblHeaderCol" :per-page="perPage"
                    :current-page="currentPage" head-variant="light">
                </b-table>
                <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage"
                    aria-controls="my-table"></b-pagination>
            </div>
            <!-- subject modal -->
            <b-modal class="subjectModal" id="subjectModal" :title="modalTitle" no-close-on-backdrop hide-footer
                centered>
                <b-form @submit="onSaveSchedule">
                    <b-row class="mx-auto">
                        <!-- Input Field -->
                        <b-form-input v-model="query" placeholder="Type to search subject..." @input="searchSubjects"
                            aria-controls="dropdown-suggestions" autocomplete="off"></b-form-input>
                        <!-- Custom Dropdown for Search Suggestions -->
                        <b-list-group v-if="showDropdown && filterSubjects.length > 0"
                            style="max-height: 200px; overflow-y: 100;">
                            <b-list-group-item v-for="(item, index) in filterSubjects" :key="index"
                                @click="selectSuggestion(item)">
                                {{ item.sub_name }}
                            </b-list-group-item>
                        </b-list-group>
                    </b-row>
                    <b-row class="mx-auto mt-2">
                        <b-form-timepicker v-model="scheduleDetails.start_time" locale="en"
                            placeholder="Start Time"></b-form-timepicker>
                    </b-row>
                    <b-row class="mx-auto mt-2">
                        <b-form-timepicker v-model="scheduleDetails.end_time" locale="en"
                            placeholder="End Time"></b-form-timepicker>
                    </b-row>
                    <b-row class="mx-auto mt-2">
                        <b-form-select v-model="selectedDay" :options="dayList"
                            aria-placeholder="Select schedule day"></b-form-select>
                    </b-row>
                    <b-row class="mx-auto mt-2">
                        <b-form-input v-model="scheduleDetails.room" type="text" debounce="500"
                            placeholder="Room assignment" required></b-form-input>
                    </b-row>
                    
                    <hr class="mt-4" />
                    <div class="w-100">
                        <b-button variant="primary" class="float-right ml-1" type="submit">
                            SAVE
                        </b-button>
                        <b-button @click="$bvModal.hide('subjectModal')" class="float-right">
                            CANCEL
                        </b-button>
                    </div>
                </b-form>
            </b-modal>
            <!-- modal end -->
        </div>

    </div>
</template>
<script>
import SideBar from '~/components/SideBar.vue';
import axios from 'axios'
export default {
    name: "ScheduleRegistration",
    components: {
        SideBar,
    },
    data() {
        return {
            selectedDay: null,
            subjectList: [],
            currentPage: 1,
            selectedId: "",
            action: "",
            perPage: 5,
            inputSearch: "",
            modalTitle: "",
            tblHeaderCol: [
                { key: "sub_name", label: "Subject Title" },
                { key: "time_schedule", label: "Time" },
                { key: "day_schedule", label: "Day" },
                { key: "room_number", label: "Room" },
            ],
            dayList: [
                { value: null, text: "Select a day for schedule" },
                { value: "Monday", text: "Monday" },
                { value: "Tuesday", text: "Tuesday" },
                { value: "Wednesday", text: "Wednesday" },
                { value: "Thursday", text: "Thursday" },
                { value: "Friday", text: "Friday" },
                { value: "Saturday", text: "Saturday" }
            ],
            scheduleDetails: {
                start_time: "",
                end_time: "",
                day: this.selectedDay,
                room: "",
            },
            alert: {
                showAlert: 0,
                dismissSecs: 0,
                variant: "success",
                message: "",
            },
            query: "",
            suggestions: [],
            showDropdown: false,

            scheduleList: [],
            filterSubjects: [],

            time_start: "",
            time_end: "",
        }
    },
    methods: {
        searchSubjects() {
            if (this.query.trim() === "") {
                this.filterSubjects = [];
                this.showDropdown = false;
                return;
            }
            this.filterSubjects = this.subjectList.filter((sub) => {
                return sub.sub_name.toLowerCase().includes(this.query.toLowerCase())
            })

            this.showDropdown = this.filterSubjects.length > 0;
        },
        selectSuggestion(item) {
            this.selectedId = item.subject_id
            this.query = item.sub_name; // Set the selected suggestion as input
            this.clearDropdown();
        },
        clearDropdown() {
            this.filterSubjects = [];
            this.showDropdown = false;
        },
        async fetchAllSchedules() {
            return await axios({
                method: "GET",
                url: `${this.$axios.defaults.baseURL}/subject/getAllSubjectScjedule`,
            }).then(
                (res) => {
                    this.scheduleList = res.data.filter(
                        function (val) {
                            return val.sub_name.includes(this.inputSearch)
                        }.bind(this)
                    )
                },
                (err) => {
                    console.log('ERROR:', err)
                }
            )
        },
        async fetchAllSubjects() {
            return await axios({
                method: "GET",
                url: `${this.$axios.defaults.baseURL}/subject/getAllSubjects`,
            }).then(
                (res) => {
                    this.subjectList = res.data
                },
                (err) => {
                    console.log('ERROR:', err)
                }
            )
        },
        onAddSubject() {
            this.subjectDetails = {
                name: "",
                description: "",
                units: "",
            }
            this.modalTitle = "Schedule setup"
            this.action = "add",
                this.$bvModal.show("subjectModal");
        },
        onSaveSchedule(e) {
            e.preventDefault();
            this.$bvModal
                .msgBoxConfirm("Add subject schedule?", {
                    title: "Please Confirm",
                    size: "sm",
                    buttonSize: "sm",
                    okVariant: "primary",
                    okTitle: "YES",
                    cancelTitle: "NO",
                    footerClass: "p-2",
                    centered: true,
                }).then((value) => {
                    if (value) this.doSaveSchedule();
                })
                .catch((err) => {
                    console.log(err)
                });
        },
        async doSaveSchedule() {
            const isAdd = this.action == "add";
            this.scheduleDetails.day = this.selectedDay
            const data = {
                subject_id: this.selectedId,
                start_time: this.scheduleDetails.start_time,
                end_time: this.scheduleDetails.end_time,
                day: this.selectedDay,
                room: this.scheduleDetails.room,
            }
            await axios({
                method: `${isAdd ? "POST" : "PUT"}`,
                url: `${this.$axios.defaults.baseURL}/subject/${isAdd ? "addSubjectSchedule" : "update/"}`,
                data
            }).then(
                (res) => {
                    console.log('res:', res)

                    this.showAlert(`${res?.data.message}`, "success");

                    this.fetchAllSchedules();
                },
                (err) => {
                    this.showAlert(`${err}`, "danger");
                    console.log(err)
                }
            )

        },
        showAlert(message, variant) {
            this.alert = {
                showAlert: 5,
                dismissSecs: 2,

                variant,
                message,
            };
        },
    },
    created() {
        this.fetchAllSchedules();
        this.fetchAllSubjects();
    },
    computed: {
        rows() {
            return this.scheduleList.length
        }
    }
}
</script>

<style>
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

.b-list-group-item {
    cursor: pointer;
}

.b-list-group-item:hover {
    background-color: #f8f9fa;
}
</style>