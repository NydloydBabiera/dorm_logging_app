<template>
    <div>
        <SideBar />
        <div class="shadow p-3 bg-white rounded" id="tableBody">
            <h1>Attendance Logs</h1>
            <div id="displayStudent">
                <b-row>
                    <b-col cols="6"> <!-- Adjust the column size as needed -->
                        <b-form-input v-model="studentInfo.full_name" type="text" debounce="500" placeholder="Full Name"
                            aria-required="true" required></b-form-input>
                    </b-col>
                    <b-col cols="3">
                        <b-form-input v-model="studentInfo.course" type="text" debounce="500" placeholder="Course"
                            aria-required="true" required></b-form-input>
                    </b-col>
                    <b-col cols="3">
                        <b-form-input v-model="studentInfo.year" type="text" debounce="500" placeholder="Year"
                            aria-required="true" required></b-form-input>
                    </b-col>
                    <b-col cols="4" class="mt-2">
                        <b-form-input v-model="studentInfo.address" type="text" debounce="500" placeholder="Address"
                            aria-required="true"></b-form-input>
                    </b-col>
                    <b-col cols="3" class="mt-2">
                        <b-form-input v-model="studentInfo.contacno" type="text" debounce="500" placeholder="Contact"
                            aria-required="true"></b-form-input>
                    </b-col>
                    <b-col cols="3" class="mt-2">
                        <b-form-input v-model="studentInfo.gender" type="text" debounce="500" placeholder="Gender"
                            aria-required="true"></b-form-input>
                    </b-col>
                    <b-col class="mt-2">
                        <b-button block @click="openStudentModal()" hover variant="outline-primary">Add
                            Student</b-button>
                    </b-col>
                </b-row>
            </div>
            <!-- table body -->
            <div class="dataBody">
                <b-table hover bordered :items="studentSchedule" :fields="tblHeaderCol" :per-page="perPage"
                    :current-page="currentPage" head-variant="light">
                </b-table>
                <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage"
                    aria-controls="my-table"></b-pagination>
            </div>
            <b-button @click="onSubjectScheduleModal()" v-show="selectedStudent !== null" variant="primary">
                ADD SUBJECTS
            </b-button>


        </div>
        <!-- Student List Modal -->
        <b-modal class="studentModal" id="studentModal" :title="modalTitle" no-close-on-backdrop hide-footer>
            <b-form-input v-model="studentSearch" @keyup="fetchAllStudents()" placeholder="Search student name" />

            <b-table hover bordered :items="studentList" :fields="tblStudentHeader" :per-page="perPage"
                :current-page="currentPage" head-variant="light" class="mt-2" selectable select-mode="single"
                @row-selected="onStudentRowSelected">
            </b-table>
            <b-pagination v-model="currentPage" :total-rows="studentRows" :per-page="perPage"
                aria-controls="my-table"></b-pagination>
            <hr class="mt-2" />
            <b-button @click="onSelectStudent()" variant="primary" class="float-right ml-1" type="submit">
                Select
            </b-button>
            <b-button @click="onCancelStudentModal()" class="float-right">
                CANCEL
            </b-button>
        </b-modal>
        <!-- Subject schedule modal -->
        <b-modal class="subjectSchedule" id="subjectSchedule" :title="modalTitle" no-close-on-backdrop hide-footer>
            <b-form-input v-model="subjectScheduleSearch" @keyup="fetchAllSubjectSchedule()"
                placeholder="Search student name" />

            <b-table hover bordered :items="subjectScheduleList" :fields="tblHeaderCol" :per-page="perPage"
                :current-page="currentPage" head-variant="light" class="mt-2" selectable
                @row-selected="onSelectSubjects">
            </b-table>
            <b-pagination v-model="currentPage" :total-rows="studentRows" :per-page="perPage"
                aria-controls="my-table"></b-pagination>
            <hr class="mt-2" />
            <b-button @click="addSubjectSchedule()" variant="primary" class="float-right ml-1" type="submit">
                SAVE SUBJECT SCHEDULE
            </b-button>
            <b-button @click="onCancelStudentModal()" class="float-right">
                CANCEL
            </b-button>
        </b-modal>
    </div>
</template>
<script>
import SideBar from '~/components/SideBar.vue';
import axios from 'axios'
export default {
    name: "Attendance",
    components: {
        SideBar
    },
    data() {
        return {
            studentSchedule: [],
            studentList: [],
            subjectScheduleList: [],
            currentPage: 1,
            studentSearch: "",
            subjectScheduleSearch: "",
            modalTitle: "",
            perPage: 5,
            selectedStudent: null,
            selectedSubjects: [],
            subjectScheduleIds: [],
            selectedStudentId: "",
            existngSchedules: [],
            studentInfo: {
                fullName: "",
                course: "",
                year: "",
                address: "",
                contact: "",
                gender: ""
            },
            tblHeaderCol: [
                { key: "sub_name", label: "Subject Title" },
                { key: "description", label: "Description" },
                { key: "time_schedule", label: "Time" },
                { key: "day_schedule", label: "Day" },
                { key: "room_number", label: "Room" },
            ],
            tblStudentHeader: [
                { key: "full_name", label: "Name" },
                { key: "course", label: "Course" },
                { key: "year", label: "Year" },
            ],
            alert: {
                showAlert: 0,
                dismissSecs: 0,
                variant: "success",
                message: "",
            },
        }

    },
    methods: {
        async fetchAllStudents() {
            return await axios({
                method: "GET",
                url: `${this.$axios.defaults.baseURL}/user/getAllUser/student`,
            }).then(
                (res) => {
                    this.studentList = res.data.data.filter(
                        function (val) {
                            return val.full_name.includes(this.studentSearch)
                        }.bind(this)
                    )
                },
                (err) => {
                    console.log('ERROR:', err)
                }
            )
        },
        async fetchAllStudentSchedule(studentId) {
            return await axios({
                method: "GET",
                url: `${this.$axios.defaults.baseURL}/subject/getStudentSubjectSchedule/${studentId}`,
            }).then(
                (res) => {
                    this.studentSchedule = res.data
                },
                (err) => {
                    console.log('ERROR:', err)
                }
            )
        },
        async fetchAllSubjectSchedule() {

            return await axios({
                method: "GET",
                url: `${this.$axios.defaults.baseURL}/subject/getAllSubjectScjedule`,
            }).then(
                (res) => {
                    this.subjectScheduleList = res.data.filter(
                        function (val) {
                            return val.sub_name.includes(this.subjectScheduleSearch)
                        }.bind(this)
                    )
                },
                (err) => {
                    console.log('ERROR:', err)
                }
            )
        },
        async addSubjectSchedule() {
            const data = {
                student_id: this.selectedStudentId,
                subject_schedule_id: this.subjectScheduleIds
            }
            return await axios({
                method: "POST",
                url: `${this.$axios.defaults.baseURL}/subject/addStudentSubjectSchedule`, data
            }).then(
                (res) => {
                    this.showAlert(`${res?.data.message}`, "success");
                    this.fetchAllStudentSchedule(this.selectedStudent.user_id);
                    this.$bvModal.hide('subjectSchedule')
                },
                (err) => {
                    console.log('ERROR:', err)
                }
            )
        },
        onStudentRowSelected(selectedRows) {
            if (selectedRows !== null) {
                this.selectedStudent = selectedRows[0] || null
                this.selectedStudentId = this.selectedStudent.user_id
                this.studentInfo.full_name = this.selectedStudent.full_name,
                    this.studentInfo.course = this.selectedStudent.course,
                    this.studentInfo.year = this.selectedStudent.year,
                    this.studentInfo.address = this.selectedStudent.address_line1 + ',' + this.selectedStudent.address_line2, "," + this.selectedStudent.city_address,
                    this.studentInfo.contact = this.selectedStudent.contacno,
                    this.studentInfo.gender = this.selectedStudent.gender
            }

        },
        openStudentModal() {
            this.modalTitle = "Student List"
            this.$bvModal.show('studentModal')
        },
        onSelectStudent() {
            this.fetchAllStudentSchedule(this.selectedStudent.user_id);

            this.$bvModal.hide('studentModal');

        },
        onCancelStudentModal() {
            this.selectedStudent = null
            this.studentInfo.full_name = "",
                this.studentInfo.course = "",
                this.studentInfo.year = "",
                this.studentInfo.address = "",
                this.studentInfo.contact = "",
                this.studentInfo.gender = ""

            this.$bvModal.hide('studentModal')
        },
        onSubjectScheduleModal() {
            this.modalTitle = "Subject Schedule List"
            this.$bvModal.show('subjectSchedule')
        },
        onSelectSubjects(selectedSubjects) {
            this.subjectScheduleIds = selectedSubjects.map((sub) => sub.subject_schedule_id)

        },
        filterLists(arr1, arr2, key) {
            return arr1.filter(
                (obj1) => !arr2.some((obj2) => obj1[key] === obj2[key])
            );
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
        // this.fetchAllStudentSchedule();
        this.fetchAllStudents();
        this.fetchAllSubjectSchedule();
    },
    computed: {
        studentRows() {
            return this.studentList.length
        },
        rows() {
            return this.studentSchedule.length
        },
        subjectScheduleRows() {
            return this.subjectScheduleList.length
        }
    },

}
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
</style>