<template>
    <v-layout row>
        <v-flex xs12 sm6 offset-sm3>
            <v-card>
                <v-toolbar color="orange" dark>
                    <v-toolbar-title class="text-xs-center">Create New Meetup</v-toolbar-title>
                </v-toolbar>
                <v-form style="padding: 20px" v-model="valid">
                    <v-text-field
                            v-model="title"
                            :rules="titleRules"
                            :counter="20"
                            label="Title"
                            required
                    ></v-text-field>
                    <v-text-field
                            label="Date"
                            required
                    ></v-text-field>
                    <v-text-field
                            label="Location"
                            required
                    ></v-text-field>
                    <v-text-field
                            v-model="participant"
                            :rules="participantRules"
                            label="Participants Limit"
                            required
                    ></v-text-field>
                    <v-text-field
                            label="Stake"
                            required
                    ></v-text-field>
                </v-form>

                <v-card-actions>
                    <v-btn color="orange">{{`Submit`}}</v-btn>
                </v-card-actions>
            </v-card>
        </v-flex>
    </v-layout>
</template>
<script>
  export default {
    data: () => ({
      valid: false,
      title: '',
      titleRules: [
        v => !!v || 'Title is required',
        v => v.length <= 10 || 'Title must be less than 20 characters'
      ],
      participant: '',
      participantRules: [
        v => !!v || 'Participant limit is required',
        v => v.valueOf() <= 50 || 'Partipant limit must be less than 50'
      ]
    })
  }
</script>
