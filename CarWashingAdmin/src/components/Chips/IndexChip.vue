<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8"><index-branch-business-volume></index-branch-business-volume></el-col>
      <el-col :span="16"><index-table-one></index-table-one></el-col>
    </el-row>
    <index-table-two></index-table-two>
  </div>
</template>

<script>
  import IndexBranchBusinessVolume from '@/components/IndexBranchBusinessVolume';
  import IndexTableOne from '@/components/Chips/IndexTableOne';
  import IndexTableTwo from '@/components/Chips/IndexTableTwo';

  export default {
    name: "IndexChip",
    components: {
      IndexBranchBusinessVolume,
      IndexTableOne,
      IndexTableTwo
    },
  }
</script>

<style scoped>

</style>
