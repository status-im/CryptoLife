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
                            :counter="10"
                            label="Meetup title"
                            required
                    ></v-text-field>
                    <v-text-field
                            v-model="participant"
                            :rules="participantRules"
                            label="Participants Limit"
                            required
                    ></v-text-field>
                </v-form>
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
        v => !!v || 'Name is required',
        v => v.length <= 10 || 'Name must be less than 10 characters'
      ],
      participant: '',
      participantRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ]
    })
  }
</script>
