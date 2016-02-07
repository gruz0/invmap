'use strict';

var React = require('react');
var ReactDOM = require('react-dom');

var App = React.createClass({
  setData: function(data) {
    var areas = data.areas.map(function(area) {
      area.data = $.parseJSON(area.data);

      if (area.data && area.data.outerPolygon) {
        area.visible = true;
      } else {
        area.visible = false;
      }
    })

    this.setState({ areas: data.areas });
  },

  handleUserInput: function(filterText, visibilityOptions) {
    this.setState({
      filterText: filterText,
      visibilityOptions: visibilityOptions
    });
  },

  handleAreaSelect: function(area) {
    this.map.setCenter([$(area).data('x'), $(area).data('y')], 12);
  },

  getInitialState: function() {
    return {
      areas: [],
      filterText: '',
      visibilityOptions: false,
    }
  },

  componentDidMount: function() {
    var component = this;

    ymaps.ready(function() {
      component.map = new ymaps.Map(component.refs.map, { center: [55.76, 37.64], zoom: 10 });

      var objects = []

      component.state.areas.forEach(function(area) {
        if (area.data && area.data.outerPolygon) {
          var polygon = new ymaps.Polygon([area.data.outerPolygon],
              {
                'dbId': area.id,
                'dbComment': area.comment
              },
              {
                'fillColor': area.fill_color.length ? area.fill_color : '11ff1155',
                'strokeColor': area.stroke_color.length ? area.stroke_color : 'ff0000ff'
              }
          );

          objects.push(polygon);
        }
      });

      component.storage = ymaps.geoQuery(objects);
      component.storage.addToMap(component.map);
    });

    $.ajax({
      url: 'http://localhost:9292/areas',
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setData(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this)
    });
  },

  render: function() {
    return (
      <div className="row">
        <div className="col-sm-3 sidebar">
          <SideBar
            areas={this.state.areas}
            filterText={this.state.filterText}
            visibilityOptions={this.state.visibilityOptions}
            onUserInput={this.handleUserInput}
            onAreaSelect={this.handleAreaSelect}
          />
        </div>
        <div className="col-xs-12 col-sm-9 col-sm-offset-3 main">
          <div ref="map" className="map"></div>
        </div>
      </div>
    );
  }
});

var SideBar = React.createClass({
  handleSearchChange: function(e) {
    this.props.onUserInput(
      this.refs.filterTextInput.value,
      this.refs.visibilityOptions.checked
    );
  },

  handleAreaClick: function(e) {
    this.props.onAreaSelect(e.target);
  },

  render: function() {
    var component = this;
    var filterExp = this.props.filterText.length > 0 && new RegExp(this.props.filterText, 'i')
    var showInvisible = this.props.visibilityOptions;

    var areas = this.props.areas.map(function(area) {
      if ((area.visible || showInvisible) && (!filterExp || area.num.search(filterExp) >= 0)) {
        if (area.data.outerPolygon) {
          var x = area.data.outerPolygon[0][0];
          var y = area.data.outerPolygon[0][1];
          var className = 'polygon__valid';
        } else {
          var x = y = 0;
          var className = 'polygon__invalid';
        }

        return (
          <li key={area.id} className={className}>
            <a data-id={area.id} data-x={x} data-y={y} onClick={component.handleAreaClick}>{area.num}</a>
          </li>
        );
      }
    });

    return (
      <div>
        <input ref="filterTextInput" type="text" className="form-control" value={this.props.filterText} onChange={this.handleSearchChange} />
        <input ref="visibilityOptions" type="checkbox" checked={this.props.visibilityOptions} onChange={this.handleSearchChange} /> Показать участки без данных
        <hr />
        <ol>
          {areas}
        </ol>
      </div>
    );
  }
});

ReactDOM.render(<App />, document.getElementById('root'));
