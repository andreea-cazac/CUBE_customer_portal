<template>
  <div>
    <v-row>
      <!-- Search bar -->
      <v-col cols="12" md="8">
        <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            :label="$t('search')"
            single-line
            hide-details
        ></v-text-field>
      </v-col>
      <!-- Show all button -->
      <v-col cols="6" md="2" class="text-md-right text-center">
        <v-btn @click="showAll = !showAll" v-bind:color="primary_color" class="text-white">
          {{ showAll ? $t('showOpenTickets') : $t('showAll') }}
        </v-btn>
      </v-col>
      <!-- Create ticket button -->
      <v-col cols="6" md="2" class="text-md-right text-center text-white">
        <v-btn @click="dialog = true" v-bind:color="accent_color">
          {{ $t('createTicket') }}
        </v-btn>
      </v-col>
    </v-row>


    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <v-row>
            <v-col cols="10">
              <span class="headline">{{$t('createNewTicket')}}</span>
            </v-col>
            <v-col cols="2" class="text-right">
              <v-btn icon @click="dialog = false">
                <v-btn class="close-button" icon @click="dialog = false">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="ticket.title" label="Ticket Title" required @input="checkFormValidity"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea v-model="ticket.description" label="Ticket Description" required @input="checkFormValidity"></v-textarea>
              </v-col>
              <v-col cols="12">
                <v-file-input label="Upload Attachment"></v-file-input>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">{{$t('cancel')}}</v-btn>
          <v-btn color="blue darken-1" text @click="createTicket" :disabled="!isFormValid">{{$t('create')}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="showSnackbar" :timeout="snackbarTimeout" class="custom-snackbar" multi-line>
      Ticket created successfully!
    </v-snackbar>


    <v-table density="comfortable" style="table-layout: fixed; width: 100%;">
      <thead>
      <tr>
        <th class="text-left" :style="{ color: 'black' }">{{$t('ticket_number')}}</th>
        <th class="text-left" :style="{ color: 'black' }">{{$t('title')}}</th>
        <th class="text-left" :style="{ color: 'black' }">
          <div class="header-wrapper" @click="sortDate">
            {{$t('date_time_created')}}
            <v-icon :class="sortColumn === 'date' ? (sortDirection === 'asc' ? 'rotate180' : '') : ''">mdi-chevron-up</v-icon>
          </div>
        </th>
        <th class="text-left" :style="{ color: 'black' }">
          <div class="header-wrapper" @click="sortPriority">
              {{$t('priority')}}
            <v-icon :class="sortColumn === 'priority' ? (sortDirection === 'asc' ? 'rotate180' : '') : ''">mdi-chevron-up</v-icon>
          </div>
        </th>
        <th class="text-left" :style="{ color: 'black' }">
          <div class="header-wrapper" @click="sortStatus">
              {{$t('status')}}
            <v-icon :class="sortColumn === 'status' ? (sortDirection === 'asc' ? 'rotate180' : '') : ''">mdi-chevron-up</v-icon>
          </div>
        </th>
        <th class="text-left" :style="{ color: 'black' }">{{$t('type')}}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in filteredTickets" :key="item.code" @click="goToTicket(item)" class="clickable-row">
        <td>{{ item.code }}</td>
        <td>{{ item.title }}</td>
        <td>{{ item.created_at }}</td>
        <td>
          <div :class="{'bcg-dark-green': displayPriority(item.priority_index) === 'Low',
               'bcg-red': displayPriority(item.priority_index) === 'High',
               'bcg-grey': displayPriority(item.priority_index) === 'TBD',
               'bcg-orange': displayPriority(item.priority_index) === 'Medium'}"

               class="status-badge">
            {{ displayPriority(item.priority_index) }}
          </div>
        </td>
        <td>
          <div :class="{'bcg-green': displayStatus(item.status) === 'Finished',
          'bcg-blue': displayStatus(item.status) === 'To-Do',
          'bcg-orange-light': displayStatus(item.status) === 'In-Progress'}"
               class="status-badge">
            {{ displayStatus(item.status) }}
          </div>
        </td>
        <td>{{ displayType(item.type_label) }}</td>
      </tr>
      </tbody>
    </v-table>
    <router-view></router-view>
  </div>

  <!--  <v-pagination
        v-model="page"
        :length="totalPages"
        color="primary"
    ></v-pagination>-->
</template>

<script>
import axios from 'axios';
import {useActiveRelationStore} from "@/stores/activeRelation";
import {useUserStore} from "@/stores/userStore";
import {computed, ref} from "vue";
import {getTickets, postTicket} from "@/cube-api-calls";
import {useTenantStore} from "@/stores/tenant";

export default {
  setup() {
    const activeRelationStore = useActiveRelationStore();
    const activeRelationStoreRef = ref(activeRelationStore);
    const tenantStore = useTenantStore();
    const activeRelation = computed(() => activeRelationStoreRef.value.getActiveRelation);
    const relationId = computed(() => activeRelation.value.id);
    const relationName = computed(() => activeRelation.value.name);

    //tenantDesign
    const logo = tenantStore.tenant.settings.logo;
    const accent_color = tenantStore.tenant.settings.accent_color;
    const primary_color = tenantStore.tenant.settings.primary_color;

    return {
      relationId,
      relationName,
      accent_color,
      primary_color,
      logo
    }
  },

  data() {
    return {
      search: '',
      showAll: false,
      dialog: false,
      sortColumn: '',
      sortDirection: '',
      isFormValid: false,
      showSnackbar: false, // Controls visibility of the snackbar
      snackbarTimeout: 3000, // Duration (in milliseconds) to display the snackbar
      ticket:{
        title:'',
        description:''
      },
      headers: [
        { text: 'Ticket Number', value: 'code', sortable: true },
        { text: 'Title', value: 'title', sortable: true },
        { text: 'Date/time created', value: 'created_at', sortable: true },
        { text: 'Priority', value: 'priority_index', sortable: true },
        { text: 'Status', value: 'status', sortable: true },
        { text: 'Type', value: 'type_label', sortable: true },
      ],
      tickets: [
        /*{
          number: 'TCK-001',
          title: 'First ticket',
          date: '2023-05-31 12:00:00',
          priority: 'Low',
          status: 'In Progress',
          type: 'Bug'
        },
        {
          number: 'TCK-002',
          title: 'Second ticket',
          date: '2023-05-31 13:00:00',
          priority: 'Medium',
          status: 'In Progress',
          type: 'Help'
        },
        {
          number: 'TCK-003',
          title: 'Second ticket',
          date: '2023-05-31 13:00:00',
          priority: 'High',
          status: 'Done',
          type: 'Help'
        },
        {
          number: 'TCK-004',
          title: 'Second ticket',
          date: '2023-05-31 05:00:00',
          priority: 'High',
          status: 'In Progress',
          type: 'Help'
        },
        {
          number: 'TCK-005',
          title: 'Second ticket',
          date: '2023-03-25 13:00:00',
          priority: 'Medium',
          status: 'In Progress',
          type: 'Help'
        },
        {
          number: 'TCK-006',
          title: 'Second ticket',
          date: '2023-04-31 13:00:00',
          priority: 'Medium',
          status: 'Todo',
          type: 'Help'
        },*/

        // ... add more items here
      ],
      itemsPerPage: 2,
      page: 1,
    };
  },

  methods: {
    goToTicket(ticket) {
      // this.$router.push(`/account/tickets/${ticket}`);
      this.$router.push({ name: 'ticketDetails', params: { id: `${ticket.id}`} });
    },
    createTicket() {
        const id = useActiveRelationStore().activeRelation.id;
        let bearerToken = useUserStore().token;
        let postData = {
            title : this.ticket.title,
            description: this.ticket.description
        };
      postTicket(id, postData, bearerToken);

      // Clear the ticket data
      this.ticket = {
        title: '',
        description: '',
      };
      window.location.reload();
      this.dialog = false;
      this.showSnackbar = true;
      setTimeout(() => {
        this.showSnackbar = false;
      }, this.snackbarTimeout);
    },
    sortPriority() {
      this.sortColumn = 'priority';
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      this.filteredTickets.sort(this.sortByPriority);
    },
    sortStatus() {
      this.sortColumn = 'status';
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      this.filteredTickets.sort(this.sortByStatus);
    },
    sortDate() {
      this.sortColumn = 'date';
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      this.filteredTickets.sort(this.sortByDate);
    },
    sortByPriority(a, b) {
      const priorityOrder = [0, 1, 10, 34];
      const indexA = priorityOrder.indexOf(a.priority_index);
      const indexB = priorityOrder.indexOf(b.priority_index);
      if (indexA < indexB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (indexA > indexB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    },
    sortByStatus(a, b) {
      const statusOrder = ['todo', 'in_progress', 'finished'];
      const indexA = statusOrder.indexOf(a.status);
      const indexB = statusOrder.indexOf(b.status);
      if (indexA < indexB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (indexA > indexB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    },
    sortByDate(a, b) {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);

      if (dateA < dateB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (dateA > dateB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    },
    checkFormValidity() {
      this.isFormValid = !!this.ticket.title && !!this.ticket.description;
    },


  },

    async created() {
      // Fetch data from the API when the component is created
      let bearerToken = useUserStore().token;

      const response = await getTickets(this.relationId, bearerToken);
      this.tickets = response.data;

      this.checkFormValidity();
    },


  computed: {

    /*To show only the open tickets*/
    filteredTickets() {
      let tickets = this.tickets;

      // If showAll is false, filter the tickets to only show those with status 'In-Progress'
      if (!this.showAll) {
        tickets = tickets.filter(ticket => this.displayStatus(ticket.status) === 'In-Progress' || this.displayStatus(ticket.status) === 'To-Do');
      }

      // Apply the search filter, regardless of the value of showAll
      if (this.search) {
        tickets = tickets.filter(ticket =>
            (ticket.status && ticket.status.toLowerCase().includes(this.search.toLowerCase())) ||
            (ticket.title && ticket.title.toLowerCase().includes(this.search.toLowerCase())) ||
            (ticket.type_label && ticket.type_label.toLowerCase().includes(this.search.toLowerCase())) ||
            (ticket.code && ticket.code.toLowerCase().includes(this.search.toLowerCase())) ||
            (ticket.created_at && ticket.created_at.toString().includes(this.search)) ||
            (this.displayPriority(ticket.priority_index) && this.displayPriority(ticket.priority_index).toLowerCase().includes(this.search.toLowerCase())) ||
            (this.displayStatus(ticket.status) && this.displayStatus(ticket.status).toLowerCase().includes(this.search.toLowerCase()))
        );
      }

      return tickets;
    },
    /*totalPages() {
      return Math.ceil(this.filteredTickets.length / this.itemsPerPage);
    },*/
    pageTickets() {
      const start = (this.page - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredTickets.slice(start, end);
    },
    /*Based on the api (it displays 0, 1 or 2) it will display the name of the priority*/
    displayPriority() {
      return function(priorityIndex) {
        return priorityIndex === 0 ? 'Low' : priorityIndex &&
        priorityIndex === 1 ? 'Medium' : priorityIndex &&
        priorityIndex === 10 ? 'High' : priorityIndex &&
        priorityIndex === 34 ? 'TBD' : priorityIndex;
      }
    },
    displayStatus() {
      return function(statusName) {
        return statusName === "finished" ? 'Finished' : statusName &&
        statusName === "todo" ? 'To-Do' : statusName &&
        statusName === "in_progress" ? 'In-Progress' : statusName;
      }
    },
    displayType() {
      return function(type) {
        return type === null || type === '' ? '[UNDEFINED]' : type;
      }
    },
  },
};
</script>

<style scoped>
.clickable-row {
  cursor: pointer;
}

.clickable-row:hover {
  background-color: #f5f5f5; /* Change this to the color you want for the hover effect */
}

.status-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 80px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
}

.bcg-green {
  background-color: rgb(31, 187, 31);  /* You can adjust the color as per your preference */
  color: white;  /* Set the text color so it contrasts with the background */
}

.bcg-blue {
  background-color: #2196f3;  /* You can adjust the color as per your preference */
  color: white;  /* Set the text color so it contrasts with the background */
}

.bcg-orange-light {
  background-color: #ffc400;  /* You can adjust the color as per your preference */
  color: white;  /* Set the text color so it contrasts with the background */
}

.bcg-orange {
  background-color: #ffab00;  /* You can adjust the color as per your preference */
  color: white;  /* Set the text color so it contrasts with the background */
}

.bcg-red {
  background-color: red;
  color: white;  /* Set the text color so it contrasts with the background */
}

 .bcg-grey {
  background: #b7b7b7;
  color: white;  /* Set the text color so it contrasts with the background */
}

.bcg-dark-green {
  background-color: green;  /* You can adjust the color as per your preference */
  color: white;  /* Set the text color so it contrasts with the background */
}

.rotate180 {
  transform: rotate(180deg);
}

.custom-snackbar {
  /*background-color: #f39c12; !* Set your custom background color *!
  color: #fff; !* Set your custom text color *!*/
}

.v-data-table {
  margin-top: 20px;  /* Adjust this value as needed */
}

.v-table {
  margin-top: 20px;  /* Adjust this value as needed */
}

.table-fixed {
  table-layout: fixed;
  width: 100%;
}

.table-fixed td {
  white-space: normal;  /* Allows text to wrap to next line */
  overflow: hidden;    /* Hides content that still doesn't fit */
  text-overflow: ellipsis;  /* Adds an ellipsis (...) when content is hidden */
}
</style>
