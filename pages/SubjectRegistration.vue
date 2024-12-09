<template>
    <div>
        <SideBar />
        <div class="shadow p-3 mb-5 bg-white rounded" id="tableBody">
            <b-alert :show="alert.showAlert" dismissible :variant="alert.variant" @dismissed="alert.showAlert = null"
            id="alert-message">
            {{ alert.message }}
        </b-alert>
            <h1>Subject Registration</h1>
            <b-input-group prepend="Search" class="mt-3">
                <b-form-input v-model="inputSearch" @keyup="fetchAllSubjects()" />
                <b-button @click="onAddSubject()" hover variant="outline-primary" class="ml-5">Add Subject</b-button>
            </b-input-group>
            <!-- table body -->
            <div class="dataBody">
                <b-table hover bordered :items="subjectList" :fields="tblHeaderCol" :per-page="perPage"
                    :current-page="currentPage" head-variant="light">
                </b-table>
                <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage"
                    aria-controls="my-table"></b-pagination>
            </div>
            <!-- subject modal -->
            <b-modal class="subjectModal" id="subjectModal" :title="modalTitle" no-close-on-backdrop hide-footer
                centered>
                <b-form @submit="onSaveSubject">
                    <b-row class="mx-auto">
                        <b-form-input v-model="subjectDetails.name" type="text" debounce="500"
                            placeholder="Subject Title" aria-required="true" required></b-form-input>
                    </b-row>
                    <b-row class="mx-auto mt-2">
                        <b-form-input v-model="subjectDetails.description" type="text" debounce="500"
                            placeholder="Description" aria-required="true" required></b-form-input>
                    </b-row>
                    <b-row class="mx-auto mt-2">
                        <b-form-input v-model="subjectDetails.units" type="number" debounce="500"
                            placeholder="Number of units" aria-required="true" required></b-form-input>
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
    name: "TenantRegistration",
    components: {
        SideBar,
    },
    data() {
        return {
            subjectList: [],
            currentPage: 1,
            action: "",
            perPage: 5,
            inputSearch: "",
            modalTitle: "",
            tblHeaderCol: [
                { key: "sub_name", label: "Subject Title" },
                { key: "description", label: "Description" },
                { key: "units", label: "Units" },
            ],
            subjectDetails: {
                name: "",
                description: "",
                units: "",
            },
            alert: {
                showAlert: 0,
                dismissSecs: 0,
                variant: "success",
                message: "",
            },
        }
    },
    methods: {
        async fetchAllSubjects() {
            return await axios({
                method: "GET",
                url: `${this.$axios.defaults.baseURL}/subject/getAllSubjects`,
            }).then(
                (res) => {
                    this.subjectList = res.data.filter(
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
        onAddSubject() {
            this.subjectDetails = {
                name: "",
                description: "",
                units: "",
            }
            this.modalTitle = "Add Subject"
            this.action = "add",
                this.$bvModal.show("subjectModal");
        },
        onSaveSubject(e) {
            e.preventDefault();
            this.$bvModal
                .msgBoxConfirm("Are you sure you want to SAVE subject details?", {
                    title: "Please Confirm",
                    size: "sm",
                    buttonSize: "sm",
                    okVariant: "primary",
                    okTitle: "YES",
                    cancelTitle: "NO",
                    footerClass: "p-2",
                    centered: true,
                }).then((value) => {
                    if (value) this.doSaveSubject();
                })
                .catch((err) => {
                    console.log(err)
                });
        },
        async doSaveSubject() {
            const isAdd = this.action == "add";
            const data = this.subjectDetails
            await axios({
                method: `${isAdd ? "POST" : "PUT"}`,
                url: `${this.$axios.defaults.baseURL}/subject/${isAdd ? "addSubject" : "update/"}`,
                data
            }).then(
                (res) => {
                    console.log('res:', res)
                    this.$bvModal.hide("subjectModal");
                    this.showAlert(`${res?.data.message}`, "success");

                    this.fetchAllSubjects();
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
        this.fetchAllSubjects();
    },
    computed: {
        rows() {
            return this.subjectList.length
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
</style>