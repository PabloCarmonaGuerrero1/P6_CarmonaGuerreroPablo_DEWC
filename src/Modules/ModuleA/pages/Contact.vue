<script>
export default {
  data() {
    return {
      selected: 'review',
      review: '',
      advice: '',
      email: '',
      rating: '',
      errors: {
        review: '',
      },
    };
  },
  methods: {
    validateReview() {
      const reviewLength = this.review.replace(/\s/g, '').length;

      if (reviewLength < 10) {
        this.errors.review = 'Review must be at least 10 characters long';
        return false;
      } else {
        this.errors.review = '';
        return true;
      }
    },
    validateAndSubmit() {
      if (this.validateReview()) {
        console.log('Form is valid. Submitting...');
      } else {
        console.log('Form is invalid. Please fix errors.');
      }
    },
  },
};
</script>

<template>
  <h1>Contact</h1>
  <form>
    <label>
      <select v-model="selected">
        <option value="review">Review</option>
        <option value="advice">Advice</option>
      </select>
    </label>
    <div v-if="selected === 'review'">
      <label>
        <input type="email" v-model="email">
      </label>
      <label>
        <input type="number" v-model="rating" min="1" max="10">
      </label>
      <label>
        <textarea v-model="review"></textarea>
        <div class="error" v-if="errors.review">{{ errors.review }}</div>
      </label>
    </div>
    <div v-if="selected === 'advice'">
      <label>
        <input type="text">
      </label>
      <label>
        <textarea v-model="review"></textarea>
      </label>
    </div>
    <button @click.prevent="validateAndSubmit">Submit</button>
  </form>
</template>

<style>
.error {
  color: red;
  font-size: 12px;
}
</style>
