<script xmlns:v-bind="http://www.w3.org/1999/xhtml">
    var developer = require('./developer.vue');
    module.exports = {
        components: {
            developer: developer,
        },
        data: function() {
            return {
                developers: []
            }
        },
        props: {
            developer_class: {
                type: String,
                default: 'col-sm-4',
            }
        },
        ready: function () {
            this.fetchDevelopers();
        },
        methods: {
            fetchDevelopers: function () {
                this.$http({
                    url: 'https://api.github.com/orgs/artesaos/members',
                    method: 'GET'
                })
                        .then(function (response) {
                            this.developers = response.data;
                        });
            }
        }
    }
</script>

<template>
    <section class="developers">
        <div class="container">
            <div class="row">
                <div class="section_header">
                    <h2>Nossos Desenvolvedores</h2>
                    <span class="header_line"></span>
                </div>

                <div v-bind:class="developer_class"
                     v-for="developer in developers">
                    <developer :member="developer"></developer>
                </div>
            </div>
        </div>
    </section>
</template>
