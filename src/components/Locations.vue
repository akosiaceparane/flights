<template>
  <v-card
    elevation="4"
    shaped
    >
    <v-card-title
      color="primary">
        Book a Flight
    </v-card-title>
    <v-container fluid>
      <v-row
        align="center"
      >
        <v-col cols="6">
          <v-combobox
            v-model="create.fromLocation"
            :items="airports"
            dense
            filled
            label="From: "
            hide-details
            item-text="label"
            item-value="iata_code"
            @change="isLocationFilled"
          >
          </v-combobox>
        </v-col>
        <v-col cols="6">
          <v-combobox
            v-model="create.toLocation"
            :items="airports"
            dense
            filled
            label="To: "
            hide-details
            item-text="label"
            item-value="iata_code"
            @change="isLocationFilled"
          >
          </v-combobox>
        </v-col>
        <v-col cols="12">
          <v-dialog
            transition="dialog-bottom-transition"
            max-width="600"
            v-model="dialog"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                block
                color="#255e96"
                depressed
                large
                class="white--text"
                v-bind="attrs"
                v-on="on"
                :disabled="!create.validated"
              >
                Book Flight
              </v-btn>
            </template>
            <template v-slot:default="dialog">
              <v-card>
                <v-toolbar
                  color="primary"
                  dark
                >
                  From {{ create.fromLocation.city }} City, {{ create.fromLocation.country }}
                  To {{ create.toLocation.city }} City, {{ create.toLocation.country }}
                </v-toolbar>
                <v-card-text>
                  <v-form>
                    <v-container>
                      <v-row>
                        <v-col
                          cols="6"
                          sm="6"
                          md="6"
                        >
                          <v-menu
                            ref="menu"
                            v-model="create.menu"
                            :close-on-content-click="false"
                            :return-value.sync="create.bookDate"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="create.bookDate"
                                label="Choose Flight Date"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                @change="isFormsFilled"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="create.bookDate"
                              no-title
                              scrollable
                              :min="nowDate"
                              @change="isFormsFilled"
                            >
                              <v-spacer></v-spacer>
                              <v-btn
                                text
                                color="primary"
                                @click="create.menu = false"
                              >
                                Cancel
                              </v-btn>
                              <v-btn
                                text
                                color="primary"
                                @click="$refs.menu.save(create.bookDate)"
                              >
                                OK
                              </v-btn>
                            </v-date-picker>
                          </v-menu>
                        </v-col>
                        <v-col
                          cols="6"
                          sm="6"
                          md="6"
                        >
                          <v-text-field
                            label="Number Of Passenger"
                            value="1-100"
                            suffix="passengers"
                            type="number"
                            min="0"
                            max="100"
                            v-model="create.numberOfPassenger"
                            @change="isFormsFilled"
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                        >
                          <v-textarea
                            label="Additional Info"
                            outlined
                            rows="4"
                            row-height="15"
                            v-model="create.additionalInfo"
                            @change="isFormsFilled"
                          ></v-textarea>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-form>
                </v-card-text>
                <v-card-actions class="justify-end">
                  <v-btn
                    text
                    @click="dialog.value = false"
                  >Close</v-btn>
                  <v-btn
                    color="#255e96"
                    class="white--text"
                    :loading="create.loading"
                    :disabled="!create.dialogValidated"
                    @click="bookFlight()"
                  >Book</v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
  export default {
    name: "Locations",
    data: () => ({
      dialog: false,
      create: {
        fromLocation: null,
        toLocation: null,
        loading: false,
        validated: false,
        bookDate: null,
        numberOfPassenger: 0,
        menu: null,
        additionalInfo: null,
        dialogValidated: false,
      }
    }),
    mounted() {
        this.$store.dispatch("getAirports");
    },
    computed: {
      airports(){
        return this.$store.state.airports;
      },
      nowDate(){
        return new Date().toISOString().slice(0,10);
      }
    },
    methods: {
      isLocationFilled(){
        this.create.validated = (this.create.toLocation != null && this.create.fromLocation != null) && (this.create.toLocation != '' && this.create.fromLocation != '');
      },
      bookFlight(){
        this.create.loading = true;
        console.log(this.create.bookDate);
        this.$store.state.events.push({
          id: this.$store.state.events.length +1,
          name: this.create.fromLocation.airportName,
          additionalInfo: this.create.additionalInfo,
          passengerCount: this.create.numberOfPassenger,
          start: this.create.bookDate,
          end: this.create.bookDate,
          color: this.$store.getters.getColor,
        });
        this.clearCreateValues();
        this.dialog = false;
        this.create.loading = false;
      },
      clearCreateValues(){
          this.create.fromLocation.airportName = null;
          this.create.additionalInfo = null;
          this.create.numberOfPassenger = null;
          this.create.bookDate = null;
          this.create.bookDate = null;
      },
      isFormsFilled(){
          this.create.dialogValidated = (this.create.bookDate != null && this.create.bookDate != '') &&
                                        (this.create.numberOfPassenger != null && this.create.numberOfPassenger != '') &&
                                        (this.create.additionalInfo != null && this.create.additionalInfo != '');
      }
    }
  }
</script>
