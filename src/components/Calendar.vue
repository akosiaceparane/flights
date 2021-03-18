<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar
          flat
        >
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="prev"
          >
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="next"
          >
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="400">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :type="type"
          @click:event="showEvent"
        ></v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card
            color="grey lighten-4"
            max-width="350px"
            flat
          >
            <v-toolbar
              :color="changeColor"
              dark
            >
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn
                icon
                @click="editingOn = !editingOn"
              >
                <v-icon v-if="editingOn == true">mdi-check-bold</v-icon>
                <v-icon v-if="editingOn == false">mdi-pencil</v-icon>
              </v-btn>
              <v-dialog
                v-model="dialog"
                persistent
                max-width="290"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    color="red"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title class="headline">
                    Are you sure you want to remove this schedule?
                  </v-card-title>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="green darken-1"
                      text
                      @click="dialog = false"
                    >
                      No
                    </v-btn>
                    <v-btn
                      color="red darken-1"
                      text
                      @click="deleteEvent"
                    >
                      Yes
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
            <v-card-text>
              <v-list-item-title class="text--primary font-weight-bold mb-1">
                Details:
              </v-list-item-title>
              <span class="d-block">
                <p v-if="editingOn == false">{{selectedEvent.additionalInfo}}</p>
                <v-textarea
                  label="Additional Info"
                  outlined
                  rows="4"
                  row-height="15"
                  full-width
                  auto-grow
                  v-model="selectedEvent.additionalInfo"
                  v-if="editingOn == true"
                ></v-textarea>
              </span>
              <div class="text--primary font-weight-bold mt-1 d-inline-block">
                Passenger Count:
              </div>
              <span v-if="editingOn == false"> {{selectedEvent.passengerCount}} </span>
              <v-text-field
                label="Number Of Passenger"
                value="1-100"
                suffix="passengers"
                type="number"
                min="0"
                max="100"
                v-model="selectedEvent.passengerCount"
                v-if="editingOn == true"
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn
                text
                color="secondary"
                @click="selectedOpen = false"
              >
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    name: 'Calendar',
    data: () => ({
      dialog: null,
      focus: '',
      type: 'month',
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      editingOn: false,
    }),
    computed: {
      events(){
        return this.$store.state.events;
      },
      changeColor(){
        return (!this.editingOn) ? this.selectedEvent.color : "#258622";
      }
    },
    mounted () {
      this.$store.dispatch("getEvents");
      this.$refs.calendar.checkChange();
    },
    methods: {
      viewDay ({ date }) {
        this.focus = date
        this.type = 'day'
      },
      getEventColor (event) {
        return event.color
      },
      setToday () {
        this.focus = ''
      },
      prev () {
        this.$refs.calendar.prev()
      },
      next () {
        this.$refs.calendar.next()
      },
      showEvent ({ nativeEvent, event }) {
        this.editingOn = false;
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          setTimeout(() => {
            this.selectedOpen = true
          }, 10)
        }

        if (this.selectedOpen) {
          this.selectedOpen = false
          setTimeout(open, 10)
        } else {
          open()
        }

        nativeEvent.stopPropagation()
      },

      deleteEvent(){
        const selectedEventId = this.selectedEvent.id;
        const eventId = this.$store.state.events.map(function (event) { return event.id; }).indexOf(selectedEventId);
        this.$store.state.events.splice(eventId,1);

        this.dialog = false;
        this.selectedOpen = false;
      }
    }
  }
</script>
