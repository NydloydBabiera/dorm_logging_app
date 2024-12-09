<template>
    <div id="root">
        <div class="shadow p-3 mb-5 bg-white rounded" id="login">

            <h4>STUDENT ATTENDANCE MONITORING</h4>
            <h5>LOGIN</h5>
            <b-form @submit="userLogin">
                <b-row class="mx-auto">
                    <b-form-input v-model="userName" type="text" debounce="500"
                        placeholder="Username" aria-required="true" required></b-form-input>
                </b-row>
                <b-row class="mx-auto mt-2">
                    <b-form-input v-model="userPassword" type="password" debounce="500"
                        placeholder="Password" aria-required="true" required></b-form-input>
                </b-row>
                <hr class="mt-4">
                <b-row class="mx-auto mt-2">
                    <b-button block variant="outline-primary" type="submit">Login</b-button>
                </b-row>

            </b-form>
            <b-spinner v-show="loadingOnSave" variant="success" label="Spinning"></b-spinner>
        </div>


    </div>

</template>

<script>
import axios from "axios";
export default {
    name: "Login",
    data() {
        return {
            userName: "",
            userPassword: "",
            projectCode: "",
            loadingOnSave: false,
        }
    },
    mounted() {
        localStorage.role = "";
        localStorage.user_id = 0;
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
        async userLogin(e) {
            e.preventDefault();
            this.loadingOnSave = true;
            await axios({
                method: "POST",
                url: `${this.$axios.defaults.baseURL}/user/authenticate`,
                data: {
                    userName: this.userName,
                    userPassword: this.userPassword,
                    projectCode: "STUDENT"
                },
            }).then(
                (res) => {
                    const results = res.data.authData;
                    this.loginActions(results)
                },
                (err) => {
                    this.isLoading = false;
                    if (err.response) {
                        this.showAlert(err.response.data.errorMsg, "danger");
                    } else {
                        this.showAlert(err, "danger");
                    }
                }
            )
        },

        loginActions(results) {
            console.log("results", results.role_user)
            localStorage.role = results.role_user;
            localStorage.setItem('role', results.role_user)
            let role = results.role_user;
            this.$nextTick(() => {
                if (role.toLowerCase() == "admin") {
                    this.$router.push({ path: "/TenantRegistration" });
                } else {
                    localStorage.user_id = results.user_id;
                    this.$router.push({ path: "/DormLogs" });
                }
            })
        }
    }
}

</script>

<style scoped>
#root {

    background-color: #6ff55b;
    text-align: center;
    margin: auto;
}

#login {
    min-width: 500px;
    position: absolute;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2.5rem;
}
</style>