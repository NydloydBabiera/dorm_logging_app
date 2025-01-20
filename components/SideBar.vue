<template>
  <div class="sideBar">
    <ul>
      <li>Student Logging <br /><sub>1.0.0</sub></li>
      <hr />

      <li v-for="(item, index) in modules" :key="index"  @click="onClickItem(item)">
        <div>{{ item.moduleName }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "SideBar",
  data() {
    return {
      modules: [
        {
          id: 1,
          moduleName: "Registration",
          path: "/TenantRegistration",
          title: "Students",
          code: "students"
        },
        {
          id: 2,
          moduleName: "Subjects",
          path: "/SubjectRegistration",
          title: "Subjects",
           code: "Subjects"
        },
        {
          id: 3,
          moduleName: "Schedule",
          path: "/ScheduleRegistration",
          title: "Schedule",
           code: "Schedule"
          
        },
        {
          id: 4,
          moduleName: "StudentSchedule",
          path: "/StudentSchedule",
          title: "Student Schedule",
           code: "StudentSchedule"
          
        },
        {
          id: 4,
          moduleName: "Attendance",
          path: "/Attendance",
          title: "Student Attendance",
           code: "Attendance"
          
        }
      ]
    }
  },
  methods:{
    onClickItem(item) {
      // this.setActiveModule(item.code);
      if (item.code != "logout") {
        this.$router.push({ path: item.path });
        return;
      }

      // this.showMsgBoxConfirmation();
    },
  }
};
</script>

<style>
.sideBar {
  position: fixed;
  background: whitesmoke;
  left: 0;
  top: 0;
  bottom: 0;
  transition: 0.1s ease;
  width: 200px;
}

ul {
  list-style-type: none;
}

li {
  text-align: center;
  align-items: center;
  margin-bottom: 30px;
  transition: 0.1s ease;
  padding: 20px 0px;
  cursor: pointer;
}
</style>