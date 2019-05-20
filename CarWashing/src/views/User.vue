<template>
  <div>
    <user-header></user-header>
    <user-list></user-list>
  </div>
</template>

<script>
  import UserHeader from '@/components/Userheader'
  import UserList from '@/components/UserList'

  export default {
    name: 'User',
    components: {
      UserHeader,
      UserList
    }, mounted () {


    }
  }
</script>

<style scoped>

</style>
