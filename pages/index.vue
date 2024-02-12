<template>
  <!-- <dorm-logs /><tenant-registration/>  <dorm-logs/>-->
  <login/>
</template>

<script>
import TenantRegistration from './TenantRegistration.vue'
import DormLogs from './DormLogs.vue'
import Login from '~/components/Login.vue'
export default {
  components: { Login },
  name: 'IndexPage',
}
</script>
