<template>
  <div class="dashboard mb-4">

    <v-container class="">
      <v-container class="">

        <v-row>
          <v-col cols="12" sm="6" md="5" lg="4">
            <v-card class="text-center ma-1 bg-grey-lighten-3" border>
              <v-card-item>
                <div class="text-h5 mt-5 font-weight-light">Tickets: 12</div>
              </v-card-item>
              <v-card-actions class="justify-center px-6 py-3">
                <router-link to="/account/tickets">
                <v-btn class="bg-grey-lighten-1">
                  <span class="text-white" >See all tickets</span>
                  <v-icon end size="large" color="white">mdi-menu-right-outline</v-icon>
                </v-btn>
                </router-link>
              </v-card-actions>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="5" lg="4">
            <v-card class="text-center ma-1 bg-grey-lighten-3" border>
              <v-card-item>
                <div>
                  <div class="text-h5 mt-5 font-weight-light">Invoices: 5</div>
                </div>
              </v-card-item>
              <v-card-actions class="justify-center px-6 py-3">
                <router-link to="/account/invoices">
                <v-btn class="bg-grey-lighten-1">
                  <span class="text-white" >See all invoices</span>
                  <v-icon end size="large" color="white">mdi-menu-right-outline</v-icon>
                </v-btn>
                </router-link>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>


      <v-card class="pa-3 ma-1" v-for="ticket in ticketData" :key="ticket.number" :class="`pa-3 ${ticket.status}`">
        <v-row cols="12"> <v-divider></v-divider> </v-row>

        <v-row class="pa-1">
          <v-col cols="12" md="2">
            <div class="caption text-grey-darken-1 mb-2">Ticket number</div>
            <div class="text-grey-darken-3">{{ ticket.number }}</div>
          </v-col>

          <v-col cols="12" md="2">
            <div class="caption text-grey-darken-1 mb-2">Title</div>
            <div class="text-grey-darken-3">{{ ticket.title }}</div>
          </v-col>

          <v-col cols="6" md="2">
            <div class="caption text-grey-darken-1 mb-2">Date</div>
            <div class="text-grey-darken-3">{{ ticket.date }}</div>
          </v-col>

          <v-col cols="6" md="2">
            <div class="caption text-grey-darken-1 mb-2">Type</div>
            <div class="text-grey-darken-3">{{ ticket.type }}</div>
          </v-col>

          <v-col cols="6" md="2">
            <div class="caption text-grey-darken-1 ">Priority</div>
<!--            <div class="text-grey-darken-3">{{ ticket.priority }}</div>-->
            <v-chip :class="`${ticket.priority} text-white`">{{ ticket.priority }}</v-chip>
          </v-col>

          <v-col cols="6" md="2" class="text-center">
             <div class="caption text-grey-darken-1">Status</div>
            <div>
              <v-chip :class="`${ticket.status} text-white `">{{ ticket.status }}</v-chip>
            </div>
          </v-col>

        </v-row>
        <v-row cols="12"> <v-divider></v-divider> </v-row>
      </v-card>
    </v-container>
  </div>
</template>


<script>
export default {
  data() {
    return {
      ticketData: [
        {
          number: 125,
          title: 'Tasks 1',
          date: '11/05/23',
          type: 'change',
          priority: 'High',
          status: 'To-Do'
        },
        {
          number: 124,
          title: 'Tasks 2',
          date: '09/08/22',
          type: 'change',
          priority: 'Low',
          status: 'In-Progress'
        },
        {
          number: 123,
          title: 'Tasks 3',
          date: '01/01/23',
          type: 'change',
          priority: 'Low',
          status: 'Done'
        },
        {
          number: 126,
          title: 'Tasks 4',
          date: '17/05/23',
          type: 'change',
          priority: 'High',
          status: 'In-Progress'
        },
        {
          number: 127,
          title: 'Tasks 5',
          date: '01/06/23',
          type: 'change',
          priority: 'High',
          status: 'To-Do'
        },
      ]
    };
  },
};
</script>


<style>
.Done {
  border-left: 5px solid rgb(31, 187, 31);
}
.To-Do {
  border-left: 5px solid rgb(33, 144, 242);
}
.In-Progress {
  border-left: 5px solid orange
}
.v-chip.Done {
  background: rgb(31, 187, 31)
}
.v-chip.In-Progress {
  background: orange
}
.v-chip.To-Do {
  background: rgb(33, 144, 242);
}
.v-chip.Low{
  background: green;
}
.v-chip.High{
  background: red;
}

</style>