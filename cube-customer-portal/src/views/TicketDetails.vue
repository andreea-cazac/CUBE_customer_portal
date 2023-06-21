<template>
  <div>
    <!-- Back Button -->
    <v-btn icon @click="$router.go(-1)" class="back-button">
      <v-icon>mdi-chevron-left</v-icon>
    </v-btn>

    <v-container fluid>
      <v-row>
        <v-col cols="12" sm="4">
          <v-card class="pa-2" style="height: 100%;">
            <v-card-item>
              <v-card-title class="text-color mb-5">{{ ticket.title }}</v-card-title>
              <v-card-text>
                <strong class="text-color">{{ $t('ticket_number') }}: </strong>
                 <strong class="font-weight-regular"> {{ ticket.code }}</strong>
                <br><br>
                <strong class="text-color">{{ $t('created') }}: </strong>
                  <strong class="font-weight-regular"> {{ ticket.created_at }}</strong>
                <br>
                <br>
                <strong class="text-color" >{{ $t('type') }}: </strong>
                <strong class="font-weight-regular">{{ ticket?.type?.label }}</strong>
                <br>
                <br>
                <strong class="text-color">{{ $t('priority') }}: </strong>
                <strong :class="priorityClass" class="text-color">{{ displayPriority(ticket.priority_index) }}</strong>
                <br>
                <br>
                <strong class="text-color">{{ $t('status') }}: </strong>
                <strong :class="statusClass" class="text-color">{{ displayStatus(ticket.status_label) }}</strong>
              </v-card-text>
            </v-card-item>
          </v-card>
        </v-col>
        <!-- Panel Description -->
        <v-col cols="12" sm="4">
          <v-card class="pa-2" style="height: 100%;">
            <v-card-item>
              <v-card-title class="text-color mb-5">{{ $t('description') }}</v-card-title>
              <v-card-text>
                <strong class="font-weight-regular" v-html="ticket.description"></strong>
                <br>
              </v-card-text>
            </v-card-item>
          </v-card>
        </v-col>
        <!-- Panel Add Comments -->
        <v-col cols="12" sm="4" v-if="!isTicketFinished">
          <v-card class="pa-2" style="height: 100%;">
            <v-card-item>
              <v-card-title class="text-color mb-5">{{ $t('add_comments') }}</v-card-title>
            </v-card-item>
            <v-card-text>
              <div>
                <label for="title">{{ $t('title') }}</label>
                <v-text-field id="title" v-model="title" :required="true" @input="checkFormValidity"></v-text-field>
              </div>
              <div>
                <label for="description">{{ $t('description') }}</label>
              </div>
              <div>
                <v-textarea id="description" v-model="description" rows="3" auto-grow="false" :required="true" @input="checkFormValidity"></v-textarea>
              </div>
              <div>
                <v-file-input
                    v-model="attachment"
                    multiple
                    label="Attach files"
                    prepend-icon="mdi-paperclip"
                ></v-file-input>
              </div>
              <div class="text-right">
                <v-btn color="#080464" class="white-text" @click="send" :disabled="!isFormValid">{{ $t('send') }}</v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="4" v-else>
          <v-card class="pa-2" style="height: 100%;">
            <v-card-item>
              <v-card-title class="text-color mb-5">{{ $t('add_comments') }}</v-card-title>
            </v-card-item>
            <v-card-text>
              <div class="finished-message">
                <v-icon class="finished-icon">mdi-check-circle-outline</v-icon>
                <p class="finished-text">{{ $t('This ticket is already finished') }}</p>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-snackbar v-model="showSnackbar" :timeout="snackbarTimeout" class="custom-snackbar" multi-line>
        {{ $t('comment_added') }}
      </v-snackbar>
      <!-- ALERTS -->
      <v-alert
        v-model="showSuccessAlert"
        type="success"
        title="Success!"
        text="Comment added successfully!"
        class="my-10"
      ></v-alert>
      <v-alert
        v-model="showUploadErrorAlert"
        type="warning"
        title="Oppsi!"
        text="Something went wrong while uploading the file please try again!"
        class="my-10"
      ></v-alert>
      <v-alert
        v-model="showFormErrorAlert"
        type="error"
        title="Ooops!"
        text="Plese check the form again and make sure it is completed!"
        class="my-10"
      ></v-alert>
      <!-- ALERTS -->
      <v-row>
        <!-- Panel Information -->
        <v-col cols="12" sm="8">
          <v-card class="pa-2" style="height: 100%;">
            <v-card-item>
              <v-card-title class="text-color mb-5">{{ $t('information') }}</v-card-title>
              <v-card-text>
                <div v-for="note in ticket.notes" :key="note.id">
                  <h3>{{ note.title }}</h3>
                  <h4>{{ note.created_at }}</h4>
                  <p v-html="note.body"></p>
                  <br>
                </div>
              </v-card-text>
            </v-card-item>
          </v-card>
        </v-col>
        <!-- Panel Attachments -->
        <v-col cols="12" sm="4">
          <v-card class="pa-2" style="height: 100%;">
            <v-card-item>
              <v-card-title class="text-color mb-5">{{ $t('attachments') }}</v-card-title>
              <v-card-text>
                <div v-for="attachment in ticket.attachments" :key="attachment.name">
                  <a :href="attachment.url" target="_blank" rel="noopener noreferrer">
                    <strong class="text-color">{{ attachment.name }}</strong>
                  </a>
                  <br>
                </div>
              </v-card-text>
            </v-card-item>
          </v-card>
        </v-col>
      </v-row>

    </v-container>
  </div>
</template>

<script>
import axios from 'axios';
import {useActiveRelationStore} from "@/stores/activeRelation";
import {computed, ref} from "vue";
import {useUserStore} from "@/stores/userStore";

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
      title: '',
      description: '',
      isFormValid: false,
      attachment: null,
      //sncackbar may be deleted later
      showSnackbar: false,
      snackbarTimeout: 3000,
      showSuccessAlert: false,
      showFormErrorAlert: false,
      showUploadErrorAlert: false,
      ticket: {},
    };
  },

  async created() {
    try {
      const response = await axios.get(`https://cube-testing.solidpartners.nl/cp/relations/${this.relationId}/work_orders/${this.$route.params.id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + useUserStore().token
        },
      });

      this.ticket = response.data;
      console.log(`${this.$route.params.id}`)
    } catch (error) {
      console.error('Error fetching ticket data:', error);
    }
  },
  methods: {
    async uploadAttachment() {
      if (!this.attachment) return;
      try {
        const formData = new FormData();
        for (let i = 0; i < this.attachment.length; i++) {
          formData.append('attachment', this.attachment[i]);
        }
        const response = await axios.post(`https://cube-testing.solidpartners.nl/cp/relations/${this.relationId}/work_orders/${this.$route.params.id}/attachments`, formData, {
          headers: {
            'Authorization': 'Bearer ' + useUserStore().token,
          },
        });
        console.log(response);
        this.showSuccessAlert = true;
      } catch (error) {
        console.error('Error uploading attachment:', error);
        //show an alert
        this.showUploadErrorAlert = true;
      }
    },
    async send() {
      this.showFormErrorAlert = false;
      if (this.isFormValid) {
        await this.uploadAttachment();
        this.clearFields(); 
      } else {
        this.showFormErrorAlert = true;
      }
    },
    checkFormValidity() {
      this.isFormValid = this.title && this.description;
    },
    clearFields() {
      this.title = '';
      this.description = '';
      this.attachment = null;
      this.isFormValid = false; 
    },
    displayPriority(priorityIndex) {
      const priorityMap = {
        0: 'Low',
        1: 'Medium',
        10: 'High',
        34: 'TBD'
      };
      return priorityMap[priorityIndex] || priorityIndex;
    },
    displayStatus(statusName) {
      const statusMap = {
        finished: 'Finished',
        todo: 'To-Do',
        in_progress: 'In-Progress'
      };
      return statusMap[statusName] || statusName;
    },
  },
  computed: {
    priorityClass() {
      const ticket = this.ticket;
      const priorityMap = {
        0: 'low-priority',
        1: 'medium-priority',
        10: 'high-priority',
        34: 'tbd-priority'
      };
      return priorityMap[ticket.priority_index] || '';
    },

    statusClass() {
      const ticket = this.ticket;
      const statusMap = {
        finished: 'finished-status',
        todo: 'todo-status',
        in_progress: 'in-progress-status'
      };
      return statusMap[ticket.status_label] || '';
    },

    isTicketFinished() {
      return this.ticket.status === 'finished';
    },
  },
};
</script>

<style scoped>
/* Add your custom styles here */

.back-button {
  position: absolute;
  top: 75px;
  left: 25px;
  z-index: 10;
}

.text-color {
  color: #212121;
}

.low-priority {
  background-color: green;
  color: #ffffff;
  padding: 5px 10px;
  border-radius: 4px;
}

.medium-priority {
  background-color: #ffa726;
  color: #ffffff;
  padding: 5px 10px;
  border-radius: 4px;
}

.high-priority {
  background-color: red;
  color: #ffffff;
  padding: 5px 10px;
  border-radius: 4px;
}

.tbd-priority {
  background-color: #b7b7b7;
  color: #ffffff;
  padding: 5px 10px;
  border-radius: 4px;
}

.finished-status {
  background-color: rgb(31, 187, 31);
  color: #ffffff;
  padding: 5px 10px;
  border-radius: 4px;
}

.todo-status {
  background-color: #2196f3;
  color: #ffffff;
  padding: 5px 10px;
  border-radius: 4px;
}

.in-progress-status {
  background-color: #2196f3;
  color: #ffffff;
  padding: 5px 10px;
  border-radius: 4px;
}

.custom-snackbar {
  background-color: #43a047;
  color: #ffffff;
}

.finished-message {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
}

.finished-icon {
  font-size: 64px;
  color: rgb(31, 187, 31);
  margin-bottom: 16px;
}

.finished-text {
  font-size: 18px;
  font-weight: bold;
  color: rgb(31, 187, 31);
  text-align: center;
}
.white-text {
  color: white;
}

</style>
