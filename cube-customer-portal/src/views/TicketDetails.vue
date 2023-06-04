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
              <v-card-title class="text-color mb-5">Organization Information</v-card-title>
              <v-card-text>
                <strong class="text-color">Ticket Number: 123123123</strong>
                <br>
                <br>
                <strong class="text-color">Created: 31 Dec 2022</strong>
                <br>
                <br>
                <strong class="text-color">Type: Bug</strong>
                <br>
                <br>
                <strong class="text-color">Priority: Low</strong>
                <br>
                <br>
                <strong class="text-color">Status: Todo</strong>
              </v-card-text>
            </v-card-item>
          </v-card>
        </v-col>
        <!-- Panel Description -->
        <v-col cols="12" sm="4">
          <v-card class="pa-2" style="height: 100%;">
            <v-card-item>
              <v-card-title class="text-color mb-5">Description</v-card-title>
              <v-card-text>
                <strong class="text-color">Random description</strong>
                <br>
              </v-card-text>
            </v-card-item>
          </v-card>
        </v-col>
        <!-- Panel Add Comments -->
        <v-col cols="12" sm="4">
          <v-card class="pa-2" style="height: 100%;">
            <v-card-item>
              <v-card-title class="text-color mb-5">Add comments</v-card-title>
            </v-card-item>
            <v-card-text>
              <div>
                <label for="title">Title</label>
                <v-text-field id="title" v-model="title" :required="true" @input="checkFormValidity"></v-text-field>
              </div>
              <div>
                <label for="description">Description</label>
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
                <v-btn color="primary" @click="send" :disabled="!isFormValid">Send</v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-snackbar v-model="showSnackbar" :timeout="snackbarTimeout" class="custom-snackbar" multi-line>
        Comment added successfully!
      </v-snackbar>
      <v-row>
        <!-- Panel Information -->
        <v-col cols="12" sm="8">
          <v-card class="pa-2" style="height: 100%;">
            <v-card-item>
              <v-card-title class="text-color mb-5">Information</v-card-title>
              <v-card-text>
                <h3>System</h3>
                <h4>31 Dec 2022, 14:57PM</h4>
                <br>
                <h3>test 1</h3>
              </v-card-text>
            </v-card-item>
          </v-card>
        </v-col>
        <!-- Panel Attachments -->
        <v-col cols="12" sm="4">
          <v-card class="pa-2" style="height: 100%;">
            <v-card-item>
              <v-card-title class="text-color mb-5">Attachments</v-card-title>
              <v-card-text>
                <strong class="text-color">File 1</strong>
                <br>
                <br>
                <strong class="text-color">File 2</strong>
                <br>
                <br>
                <strong class="text-color">File 3</strong>
              </v-card-text>
            </v-card-item>
          </v-card>
        </v-col>
      </v-row>

    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '',
      description: '',
      isFormValid: false,
      attachment: null,
      showSnackbar: false,
      snackbarTimeout: 3000,

    };
  },
  methods: {
    attachFiles() {
      // Implement your file attachment logic here
    },
    send() {
      if (this.isFormValid) {
        // Do something when the form is valid and the "Send" button is clicked
        this.showSnackbar = true; // Display the snackbar
        this.clearFields(); // Clear the input fields
      }
    },
    checkFormValidity() {
      this.isFormValid = this.title && this.description;
    },
    clearFields() {
      this.title = '';
      this.description = '';
      this.attachment = null;
      this.isFormValid = false; // Reset the form validity
    },
  },
};
</script>

<style scoped>
.back-button {
  position: absolute;
  top: 75px;
  left: 25px;
  z-index: 10;
}
</style>