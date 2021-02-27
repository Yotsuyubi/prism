<template>
  <section class="section">

    <b-field message="What do you want to search?">
      <b-input placeholder="URL..."
        type="url"
        icon="plus"
        v-model="youtubeUrl">
      </b-input>
      <p class="control">
        <b-button type="is-primary" label="Add" @click="request"/>
      </p>
    </b-field>

    <ul id="example-1">
      <li v-for="item in collections" :key="item._id">
        <Card v-bind="item" @update="update"/>
      </li>
    </ul>

  </section>
</template>

<script>
import Card from '~/components/Card'

export default {
  name: 'HomePage',

  data() {
    return {
      collections: null,
      youtubeUrl: null
    }
  },

  computed: {
    youtubeId: function () {
      if (this.youtubeUrl) {
        let video_id = this.youtubeUrl.split('v=')[1]
        const ampersandPosition = video_id.indexOf('&')
        if(ampersandPosition != -1) {
          video_id = video_id.substring(0, ampersandPosition)
        }
        return video_id
      }
    }
  },

  components: {
    Card
  },

  methods: {
    async fetchCollections() {
      const collections = await this.$axios.$get('api/collections')
      this.collections = collections
    },

    async request() {
      if (this.youtubeId) {
        await this.$axios.$post(`api/collections/${this.youtubeId}`)
        this.youtubeUrl = null
        this.update()
      }
    },

    update() {
      this.fetchCollections()
    }
  },

  mounted() {
    this.fetchCollections()
  }
}
</script>
