<template>
  <!--not working  -->
<!--  <v-dialog :value="dialog" @input="$emit('update:dialog', $event)" max-width="500px">
    <v-card>
      <v-card-title>
        <v-row>
          <v-col cols="10">
            <span class="headline">Create New Ticket</span>
          </v-col>
          <v-col cols="2" class="text-right">
            <v-btn icon @click="closeDialog">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                  :value="ticket.title"
                  @input="$emit('update:ticket', {...ticket, title: $event})"
                  label="Ticket Title"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                  :value="ticket.description"
                  @input="$emit('update:ticket', {...ticket, description: $event})"
                  label="Ticket Description"
                  required
              ></v-textarea>
            </v-col>
            <v-col cols="12">
              <v-file-input
                  label="Upload Attachment"
              ></v-file-input>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
        <v-btn color="blue darken-1" text @click="createTicket">Create</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>-->
</template>

<script>
/*export default {
  props: {
    dialog: {
      type: Boolean,
      required: true
    },
    ticket: {
      type: Object,
      required: true
    }
  },
  methods: {
    createTicket() {
      this.$emit('create-ticket');
    },
    closeDialog() {
      this.$emit('update:dialog', false);
    }
  }
}*/
</script>