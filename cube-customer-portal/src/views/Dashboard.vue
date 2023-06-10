<template>
  <div class="dashboard mb-4">
      <v-container class="">
        <v-row class="mb-2">
          <v-col cols="12" md="4">
            <v-card class="text-center bg-grey-lighten-3" border>
              <v-card-item class="b-solid-blue text-white">
                <div class="text-h5 mt-5 font-weight-light">Tickets: 12</div>
              </v-card-item>
              <v-card-actions class="b-solid-blue justify-center px-6 py-3">
                <router-link to="/account/tickets">
                    <v-btn class="b-solid-blue-2 text-white">
                        <span>{{$t('see_all_tickets')}}</span>
                        <v-icon end size="large">mdi-menu-right-outline</v-icon>
                    </v-btn>
                </router-link>
              </v-card-actions>
            </v-card>
          </v-col>

<!--          <v-col cols="12" sm="6" md="5" lg="4">-->
<!--            <v-card class="text-center ma-1 bg-grey-lighten-3" border>-->
<!--              <v-card-item>-->
<!--                <div>-->
<!--                  <div class="text-h5 mt-5 font-weight-light">Invoices: 5</div>-->
<!--                </div>-->
<!--              </v-card-item>-->
<!--              <v-card-actions class="justify-center px-6 py-3">-->
<!--                <router-link to="/account/invoices">-->
<!--                <v-btn class="bg-grey-lighten-1">-->
<!--                  <span class="text-white" >See all invoices</span>-->
<!--                  <v-icon end size="large" color="white">mdi-menu-right-outline</v-icon>-->
<!--                </v-btn>-->
<!--                </router-link>-->
<!--              </v-card-actions>-->
<!--            </v-card>-->
<!--          </v-col>-->
        </v-row>

  <v-card class="b-solid-blue-darken-2" max-width="700px" min-width="">
    <v-card-title class="w-100 b-solid-blue-darken-2">
      <v-row>
        <v-card-item class="ma-1">
          <v-icon color="white">mdi-comment-multiple-outline</v-icon>
          <span class="font-weight-regular text-white"> Recent tickets </span>
        </v-card-item>

        <v-spacer></v-spacer>

        <v-card-actions class="">
          <router-link to="/account/tickets">
            <v-btn class="text-white b-solid-blue-darken-2">
              <p>Show all</p>
              <v-icon end size="small">mdi-arrow-right</v-icon>
            </v-btn>
          </router-link>
        </v-card-actions>
      </v-row>
    </v-card-title>

    <v-table class="">
      <thead class="">
      <tr>
        <th class="text-left font-weight-bold text-grey-darken-4">Number</th>
        <th class="text-left font-weight-bold text-grey-darken-4">Title</th>
        <th class="text-left font-weight-bold text-grey-darken-4">Date</th>
        <th class="text-left font-weight-bold text-grey-darken-4">Priority</th>
        <th class="text-left font-weight-bold text-grey-darken-4">Status</th>
        <th class="text-left font-weight-bold text-grey-darken-4">Type</th>
      </tr>
      </thead>

      <tbody>
      <tr v-for="ticket in ticketData" :key="ticket.number">
        <td>{{ ticket.number }}</td>
        <td>{{ ticket.title }}</td>
        <td>{{ ticket.date }}</td>
        <td><v-chip :class="`${ticket.priority} text-white status-badge`">{{ ticket.priority }}</v-chip></td>
        <td><v-chip :class="`${ticket.status} text-white status-badge`">{{ ticket.status }}</v-chip></td>
        <td>{{ ticket.type }}</td>
      </tr>
      </tbody>
    </v-table>

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
          number: 127,
          title: 'Tasks 1',
          date: '11/05/23',
          type: 'change',
          priority: 'High',
          status: 'To-Do'
        },
        {
          number: 126,
          title: 'Tasks 2',
          date: '09/08/22',
          type: 'change',
          priority: 'Low',
          status: 'In-Progress'
        },
        {
          number: 125,
          title: 'Tasks 4',
          date: '17/05/23',
          type: 'change',
          priority: 'High',
          status: 'In-Progress'
        },
        {
          number: 124,
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
.v-list{
  width: 700px;
  overflow-x: auto;
}
.status-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 90px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
}
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

.solid-blue{
  color: #000161;
}
.b-solid-blue{
  background: #000161;
}
.b-solid-blue-darken{
  background: #000157;
}
.b-solid-blue-2{
  background: #262679;
}
.b-solid-blue-darken-2{
  background: #0057a6;
}

</style>
