<script>
  module.exports = {
    data: function () {
      return {}
    },
    props: {
      project: {
        type: Object,
        require: true,
      }
    },
  }
</script>

<template>
  <div class="panel panel-default box">
    <div class="panel-heading box-heading">{{project.project_name}}</div>
    <div class="panel-body">
      <p class="panel-description">{{project.description}}</p>

      <div class="box-props">
        <div class="row">
          <div class="col-md-6 col-xs-6 box-compatible">
            <h5>Compatible</h5>
            <span>{{project.laravel_compatible}}</span>
          </div>
          <div class="col-md-6 col-xs-6 box-version">
            <h5>Version</h5>
            <span>{{project.project_version}}</span>
          </div>
        </div>
      </div>
    </div>
    <a href="{{ project.url }}" target="_blank">
      <div class="panel-footer">
        <span class="glyphicon glyphicon-plus-sign"></span>
      </div>
    </a>
  </div>
</template>
