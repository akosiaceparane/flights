<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12" sm="7" md="6" lg="6" >
        <Calendar/>
      </v-col>
      <v-col cols="12" sm="7" md="6" lg="6" >
        <Locations/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import Calendar from './Calendar'
  import Locations from './Locations'
  export default {
    name: 'Body',
    components: {
      Calendar,
      Locations,
    },

    data: () => ({

    }),
  }
</script>
