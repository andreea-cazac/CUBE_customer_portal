<template>
  <div>
    <v-row>
      <!-- Search bar -->
      <v-col cols="12" md="8">
        <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
        ></v-text-field>
      </v-col>
      <!-- Show all button -->
      <v-col cols="6" md="2" class="text-md-right text-center">
        <v-btn @click="showAll = !showAll">
          {{ showAll ? 'Show Open Tickets' : 'Show All' }}
        </v-btn>
      </v-col>
      <!-- Create ticket button -->
      <v-col cols="6" md="2" class="text-md-right text-center">
        <v-btn @click="dialog = true">
          Create Ticket
        </v-btn>
      </v-col>
    </v-row>



    <v-data-table
        :headers="headers"
        :items="pageTickets"
        :items-per-page="itemsPerPage"
    ></v-data-table>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <v-row>
            <v-col cols="10">
              <span class="headline">Create New Ticket</span>
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
          <v-btn color="blue darken-1" text @click="dialog = false">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="createTicket" :disabled="!isFormValid">Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="showSnackbar" :timeout="snackbarTimeout" class="custom-snackbar" multi-line>
      Ticket created successfully!
    </v-snackbar>


    <v-table density="compact">
      <thead>
      <tr>
        <th class="text-left">Ticket Number</th>
        <th class="text-left">Title</th>
        <th class="text-left">
          <div class="header-wrapper" @click="sortDate">
            Date/Time created
            <v-icon :class="sortColumn === 'date' ? (sortDirection === 'asc' ? 'rotate180' : '') : ''">mdi-chevron-up</v-icon>
          </div>
        </th>
        <th class="text-left">
          <div class="header-wrapper" @click="sortPriority">
            Priority
            <v-icon :class="sortColumn === 'priority' ? (sortDirection === 'asc' ? 'rotate180' : '') : ''">mdi-chevron-up</v-icon>
          </div>
        </th>
        <th class="text-left">
          <div class="header-wrapper" @click="sortStatus">
            Status
            <v-icon :class="sortColumn === 'status' ? (sortDirection === 'asc' ? 'rotate180' : '') : ''">mdi-chevron-up</v-icon>
          </div>
        </th>
        <th class="text-left">Type</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in filteredTickets" :key="item.number" @click="goToTicket(item.number)" class="clickable-row">
        <td>{{ item.number }}</td>
        <td>{{ item.title }}</td>
        <td>{{ item.date }}</td>
        <td>
          <div :class="{'bcg-dark-green': item.priority === 'Low', 'bcg-red': item.priority === 'High', 'bcg-orange': item.priority === 'Medium'}" class="status-badge">
            {{ item.priority }}
          </div>
        </td>
        <td>
          <div :class="{'bcg-green': item.status === 'Done', 'bcg-blue': item.status === 'Todo', 'bcg-orange-light': item.status === 'In Progress'}" class="status-badge">
            {{ item.status }}
          </div>
        </td>
        <td>{{ item.type }}</td>
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
export default {
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
        { text: 'Ticket Number', value: 'number', sortable: true },
        { text: 'Title', value: 'title', sortable: true },
        { text: 'Date/time created', value: 'date', sortable: true },
        { text: 'Priority', value: 'priority', sortable: true },
        { text: 'Status', value: 'status', sortable: true },
        { text: 'Type', value: 'type', sortable: true },
      ],
      tickets: [
        {
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
        },

        // ... add more items here
      ],
      itemsPerPage: 2,
      page: 1,
    };
  },

  methods: {
    goToTicket(number) {
      this.$router.push(`/account/tickets/${number}`);
    },
    createTicket() {
      // Implement your logic for creating the ticket here
      // For example, you might call an API to create the ticket on the server
      console.log(this.ticket.title, this.ticket.description);

      // Clear the ticket data
      this.ticket = {
        title: '',
        description: '',
      };

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
      const priorityOrder = ['Low', 'Medium', 'High'];
      const indexA = priorityOrder.indexOf(a.priority);
      const indexB = priorityOrder.indexOf(b.priority);
      if (indexA < indexB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (indexA > indexB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    },
    sortByStatus(a, b) {
      const statusOrder = ['To-Do', 'In Progress', 'Done'];
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
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

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
    }
  },

  created() {
    this.checkFormValidity();
  },


  computed: {
    filteredTickets() {
      let tickets = this.tickets;
      if (!this.showAll) {
        tickets = tickets.filter(ticket => ticket.status === 'In Progress');
      }
      if (this.search) {
        tickets = tickets.filter(ticket =>
            Object.values(ticket).some(val =>
                val.toString().toLowerCase().includes(this.search.toLowerCase())
            )
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
</style>