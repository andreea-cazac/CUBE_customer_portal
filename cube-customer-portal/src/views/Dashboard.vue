<template>
  <div class="dashboard mb-4">
      <v-container fluid>
        <v-row class="mb-2">
          <v-col cols="12" md="4">
            <v-card class="text-center bg-grey-lighten-3" border>
              <v-card-item class="b-solid-blue text-white">
                <div class="text-h5 mt-5 font-weight-light">{{$t('tickets')}}: {{ tickets.length }}</div>
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

  <v-card class="b-solid-blue-darken-2" max-width="900px" min-width="">
    <v-card-title class="w-100 b-solid-blue-darken-2">
      <v-row>
        <v-card-item class="ma-1">
          <v-icon color="white">mdi-comment-multiple-outline</v-icon>
          <span class="font-weight-regular text-white">{{ $t('recent_tickets') }}</span>
        </v-card-item>

        <v-spacer></v-spacer>

        <v-card-actions class="">
          <router-link to="/account/tickets">
            <v-btn class="text-white b-solid-blue-darken-2">
              <span> {{ $t('show_all') }}</span>
              <v-icon end size="small">mdi-arrow-right</v-icon>
            </v-btn>
          </router-link>
        </v-card-actions>
      </v-row>
    </v-card-title>

    <v-table class="">
      <thead class="">
      <tr>
        <th class="text-left font-weight-bold text-grey-darken-4">{{$t('ticket_number')}}</th>
        <th class="text-left font-weight-bold text-grey-darken-4">{{$t('title')}}</th>
        <th class="text-left font-weight-bold text-grey-darken-4">{{$t('date')}}</th>
        <th class="text-left font-weight-bold text-grey-darken-4">{{$t('priority')}}</th>
        <th class="text-left font-weight-bold text-grey-darken-4">{{$t('status')}}</th>
        <th class="text-left font-weight-bold text-grey-darken-4">{{$t('type')}}</th>
      </tr>
      </thead>

      <tbody>
      <tr v-for="ticket in ticketData" :key="ticket.number" @click="goToTicket(ticket)" class="clickable">
        <td>{{ ticket.code }}</td>
        <td>{{ ticket.title }}</td>
        <td>{{ ticket.created_at }}</td>
        <td><v-chip :class="{'Low': getPriority(ticket.priority_index) === 'Low', 'High': getPriority(ticket.priority_index) === 'High',
        'Medium': getPriority(ticket.priority_index) === 'Medium', 'TBD': getPriority(ticket.priority_index) === 'TBD'}"
             class="status-badge text-white">{{ getPriority(ticket.priority_index) }}</v-chip></td>
        <td><v-chip :class="`${ticket.status} text-white status-badge`">{{ getStatus(ticket.status) }}</v-chip></td>
        <td>{{ ticket.type_label }}</td>
      </tr>
      </tbody>
    </v-table>

  </v-card>
</v-container>
  </div>
</template>


<script>
import {useActiveRelationStore} from "@/stores/activeRelation";
import {computed, ref} from "vue";
import {useUserStore} from "@/stores/userStore";
import {getTickets} from "@/cube-api-calls";

export default {
  setup() {
    const activeRelationStore = useActiveRelationStore();
    const activeRelationStoreRef = ref(activeRelationStore);

    const activeRelation = computed(() => activeRelationStoreRef.value.getActiveRelation);
    const relationId = computed(() => activeRelation.value.id);
    const relationName = computed(() => activeRelation.value.name);

    return {
      relationId,
      relationName
    }
  },
  data() {
    return {
      tickets: []
    };
  },

  async created() {
    const response = await getTickets(this.relationId, useUserStore().token);
    this.tickets = response.data;
  },

  methods: {
    goToTicket(ticket) {
      // this.$router.push(`/account/tickets/${ticket}`);
      this.$router.push({ name: 'ticketDetails', params: { id: `${ticket.id}`} });
    }
  },
  computed: {
    getPriority() {
      return function(priorityIndex) {
        return priorityIndex === 0 ? 'Low' : priorityIndex &&
        priorityIndex === 1 ? 'Medium' : priorityIndex &&
        priorityIndex === 10 ? 'High' : priorityIndex &&
        priorityIndex === 34 ? 'TBD' : priorityIndex;
      }
    },
    getStatus() {
      return function(statusName) {
        return statusName === "finished" ? 'Finished' : statusName &&
        statusName === "todo" ? 'To-Do' : statusName &&
        statusName === "in_progress" ? 'In-Progress' : statusName
      }
    },
    ticketData() {
      return this.tickets.slice(0, 4);
    }
  }
};
</script>


<style>
.v-list{
  width: 700px;
  overflow-x: auto;
}
.clickable{
  cursor: pointer;
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
.finished {
  border-left: 5px solid rgb(31, 187, 31);
}
.todo {
  border-left: 5px solid rgb(33, 144, 242);
}
.in_progress {
  border-left: #ffc400;
}
.v-chip.finished {
  background: rgb(31, 187, 31)
}
.v-chip.in_progress {
  background: #ffc400;
}
.v-chip.todo {
  background: rgb(33, 144, 242);
}
.Low{
  background: green;
}
.High{
  background: red;
}
.Medium{
  background: orange;
}
.TBD{
  background: #b7b7b7;
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
