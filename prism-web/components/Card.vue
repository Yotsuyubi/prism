<template>
  <div class="column">
    <div class="card">
      <header class="card-header">
        <p class="card-header-title has-text-grey">
          {{ title }}
          <b-tag v-if="inCue" type="is-primary">In cue</b-tag>
          <b-tag v-if="isFinished" type="is-success">Finished</b-tag>
        </p>
      </header>
      <div class="card-content">
        <b-button v-if="isFinished" type="is-success" @click="downloadItem">
          Download
          <!-- <b-loading :is-full-page="false" v-model="isDownloading" :can-cancel="false" /> -->
        </b-button>
        <b-button type="is-danger" @click="deleteItem"> Delete </b-button>
        <b-loading :is-full-page="false" v-model="isProcessing" :can-cancel="false"></b-loading>
      </div>
      <footer class="card-footer">
        <p class="card-footer-title has-text-grey">
          {{ date }}
        </p>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  props: ['title', 'inCue', 'isFinished', 'isProcessing', 'date', '_id'],

  data() {
    return {
      isDownloading: false
    }
  },

  methods: {
    async downloadItem() {
      // this.isDownloading = true
      const blob = await this.$axios.$get(`api/collections/${this._id}/zip`,{
        responseType: 'blob',
        headers: { Accept: 'application/zip' },
      })
      // this.isDownloading = false
      const uri = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.download = `${this.title}.zip`
      link.href = uri
      link.click()
    },

    async deleteItem() {
      await this.$axios.$delete(`api/collections/${this._id}`)
      this.$emit('update')
    },
  }
}
</script>
