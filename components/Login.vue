<template>
    <div id="root">
        <div class="shadow p-3 mb-5 bg-white rounded" id="login">

            <h4>MONITORING SYSTEM FOR USM DORMITORY STUDENTS</h4>
            <h5>LOGIN</h5>
            <b-form @submit="userLogin">
                <b-row class="mx-auto">
                    <b-form-input v-model="userName" type="text" debounce="500" placeholder="Username/Student's last name"
                        aria-required="true" required></b-form-input>
                </b-row>
                <b-row class="mx-auto mt-2">
                    <b-form-input v-model="userPassword" type="text" debounce="500" placeholder="Password/Guardian's Contact No."
                        aria-required="true" required></b-form-input>
                </b-row>
                <hr class="mt-4">
                <b-row class="mx-auto mt-2">
                    <b-button block variant="outline-primary" type="submit">Login</b-button>
                </b-row>

            </b-form>
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
        }
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
            await axios({
                method: "POST",
                url: `${this.$axios.defaults.baseURL}/user/authenticate`,
                data: {
                    userName: this.userName,
                    userPassword: this.userPassword,
                    projectCode: "DORM"
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

            console.log("results",results.role_user)
            let role = results.role_user;
            this.$nextTick(() => {
                if (role.toLowerCase() == "admin") {
                    this.$router.push({ path: "/TenantRegistration" });
                }else{
                    this.$router.push({ path: "/DormLogs" });
                }
            })
        }
    }
}

</script>

<style scoped>
#root {
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