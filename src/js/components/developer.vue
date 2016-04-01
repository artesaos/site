<script>
  module.exports =  {
    data: function () {
      return {}
    },
    props: {
      member: {
        // type: Object,
        require: true,
      }
    },
  }
</script>

<template>
    <div class="team-member">
        <img alt="{{ member.login }} avatar" v-bind:src="member.avatar_url">

        <h2>{{ member.login }}</h2>

        <div class="social-icons">
            <li>
                <a href="{{ member.html_url }}" target="_blank">
                    <i class="fa fa-github fa-2x fa-fw"></i>
                </a>
            </li>
        </div>
    </div>
</template>
