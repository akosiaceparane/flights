import Vue from 'vue';
import Vuex from 'vuex';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import 'es6-promise/auto';
import axios from 'axios';

Vue.config.productionTip = false

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        events : [
          // attr: name, start, end, color, timed
        ],
        airports : [
          // attr: iata_code, airportName, country, city,
        ]
    },
    getters: {
        getColor: (state) => {
          return "blue";
        }
    },
    actions: {
      getEvents({ commit , getters}) {
        axios.get('/static/default-flights.json')
        .then(response => {
          const events = response.data;
          commit('SET_EVENTS', {getters, events})
        })
      },
      getAirports({commit, getters}){
        axios.get('https://raw.githubusercontent.com/algolia/datasets/master/airports/airports.json')
        .then(response => {
          const airports = response.data;
          commit('SET_AIRPORTS', {getters, airports})
        });
      }
    },
    mutations: {
      SET_EVENTS(state, {getters, events}) {
        const eventsToCalendar = [];
        events.forEach(function(e,i){
          eventsToCalendar.push({
            id: e.id,
            name: e.airplaneName,
            start: e.date,
            end: e.date,
            color: getters.getColor,
            additionalInfo: e.additionalInfo,
            passengerCount: e.passengerCount,
          });
        });
        state.events = eventsToCalendar;
      },
      SET_AIRPORTS(state, {getters, airports}) {
        const airportsToList = [];
        airports.forEach(function(e,i){
          airportsToList.push({
            iata_code: e.iata_code,
            airportName: e.name,
            country: e.country,
            city: e.city,
            label: e.country + " - " + e.city + " - " + e.name
          });
        });
        state.airports = airportsToList;
      }
    }
});

new Vue({
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
