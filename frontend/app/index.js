'use strict';

var React = require('react');
var ReactDOM = require('react-dom');

var App = React.createClass({
  render: function() {
    return (
      <div className="row">
        <div className="col-sm-3 sidebar">
          <SideBar />
        </div>
        <div className="col-xs-12 col-sm-9 col-sm-offset-3 main">
          <Map />
        </div>
      </div>
    );
  }
});

var SideBar = React.createClass({
  render: function() {
    return (
      <div>
        <input type="text" className="js-search form-control" />
        <input type="checkbox" className="js-show-disabled" /> Показать участки без данных
        <hr />
        <ol className="js-list-objects"></ol>
      </div>
    );
  }
});

var Map = React.createClass({
  componentDidMount: function(rootNode) {
    var component = this;

    ymaps.ready(function() {
      component.map = new ymaps.Map(ReactDOM.findDOMNode(component), { center: [55.76, 37.64], zoom: 10 });
    });
  },

  componentWillUnmount: function() {
    this.map = null;
  },

  render: function() {
    return (
      <div id="map" className="map"></div>
    );
  }
});

ReactDOM.render(<App />, document.getElementById('root'));
