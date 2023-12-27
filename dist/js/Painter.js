"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var d3 = _interopRequireWildcard(require("d3"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Painter = exports["default"] = /*#__PURE__*/function () {
  function Painter(foreground, background, callbacks) {
    _classCallCheck(this, Painter);
    this.foreground = foreground;
    this.background = background;
    this.callbacks = callbacks;
    this._default = {
      line: {
        height: 14,
        font: {
          size: 14
        }
      }
    };
  }
  /* **************************************************************** *
   *   Move
   * **************************************************************** */
  _createClass(Painter, [{
    key: "dragStart",
    value: function dragStart(event, entity) {
      entity._drag = {
        start: {
          x: event.x,
          y: event.y
        }
      };
    }
  }, {
    key: "dragged",
    value: function dragged(event, entity) {
      entity.position.x += event.x - entity._drag.start.x;
      entity.position.y += event.y - entity._drag.start.y;
      this.moveEntity(entity);
      this.moveEdges(entity);
    }
  }, {
    key: "dragEnd",
    value: function dragEnd(event, entity) {
      // let campus = STORE.get('active.ter.campus');

      delete entity._drag;

      // ACTIONS.saveTerEntityPosition(campus, entity);
    }
  }, {
    key: "addMoveEvents",
    value: function addMoveEvents(body) {
      var _this = this;
      return body.call(d3.drag().on("start", function (e, d) {
        return _this.dragStart(e, d);
      }).on("drag", function (e, d) {
        return _this.dragged(e, d);
      }).on("end", function (e, d) {
        return _this.dragEnd(e, d);
      }));
    }
  }, {
    key: "moveEntity",
    value: function moveEntity(entity) {
      var selection = this.foreground.selectAll('g.entity').data([entity], function (d) {
        return d._id;
      });
      selection.attr('transform', function (d) {
        return 'translate(' + d.position.x + ',' + d.position.y + ')';
      });
    }
  }, {
    key: "moveEdges",
    value: function moveEdges(entity) {
      var edges = entity.ports.items.list.map(function (p) {
        return p._relationship;
      });
      var selection = this.background.selectAll('line.connector').data(edges, function (d) {
        return d._id;
      });
      this.drawRelationshipsCore(selection);
    }
    /* **************************************************************** *
     *   Draw  this.entity
     * **************************************************************** */
  }, {
    key: "drawGroup",
    value: function drawGroup(data) {
      return this.foreground.selectAll('g.entity').data(data, function (d) {
        return d._id;
      }).enter().append('g').attr('class', 'entity').attr('entity-id', function (d) {
        return d._id;
      }).attr('entity-code', function (d) {
        return d._core.type;
      }).attr('entity-type', function (d) {
        return d._class;
      }).attr("transform", function (d) {
        return "translate(" + d.position.x + "," + d.position.y + ")";
      });
    }
    /* ************************************ *
     *  Body                                *
     * ************************************ */
  }, {
    key: "drawBodyCore",
    value: function drawBodyCore(body) {
      body.attr('class', 'entity-body').attr('width', function (d) {
        return d.size.w;
      }).attr('height', function (d) {
        return d.size.h;
      }).attr('rx', function (d) {
        return 5;
      }).attr('ry', function (d) {
        return 5;
      }).attr('fill', function (d) {
        return d.background.color;
      });
    }
  }, {
    key: "drawBody",
    value: function drawBody(groups) {
      var body = groups.append('rect');
      this.drawBodyCore(body);
      return body;
    }
    /* ************************************ *
     *  Name                                *
     * ************************************ */
  }, {
    key: "drawNameRect",
    value: function drawNameRect(rects) {
      rects.attr('x', function (d) {
        return d.name.position.x;
      }).attr('y', function (d) {
        return d.name.position.y;
      }).attr('width', function (d) {
        return d.name.size.w;
      }).attr('height', function (d) {
        return d.name.size.h;
      }).attr('rx', function (d) {
        return 3;
      }).attr('ry', function (d) {
        return 3;
      }).attr('fill', function (d) {
        return d.background.color;
      });
    }
  }, {
    key: "drawNameText",
    value: function drawNameText(texts) {
      var _this2 = this;
      texts.attr('class', 'entity-title').attr("x", function (d) {
        return d.padding + d.name.padding;
      }).attr("y", function (d) {
        return d.padding + d.name.padding + _this2._default.line.font.size;
      }).attr("fill", function (d) {
        return '#fff';
      }).attr("font-size", function (d) {
        return 24;
      }).text(function (d) {
        return d.name.val();
      });
      this.addMoveEvents(texts);
      return texts;
    }
  }, {
    key: "drawName",
    value: function drawName(groups) {
      var callbacks = this.callbacks;
      var rects = groups.append('rect').on("click", function (event, d) {
        var func = callbacks.entity.click;
        if (func) func(d);
      }).attr('class', 'entity-title');
      this.drawNameRect(rects);
      var texts = groups.append('text').on("click", function (event, d) {
        var func = callbacks.entity.click;
        if (func) func(d);
      }).attr('class', 'entity-title');
      this.drawNameText(texts).each(function (d) {
        if (!d._max) d._max_w = {
          name: 0,
          identifier: 0,
          attribute: 0
        };
        var w = this.getBBox().width;
        if (w > d._max_w.name) d._max_w.name = w;
      });
    }
    /* ************************************ *
    *  Type                                *
    * ************************************ */
  }, {
    key: "drawTypeRect",
    value: function drawTypeRect(selection) {
      selection.attr('x', function (d) {
        return d.type.position.x;
      }).attr('y', function (d) {
        return d.type.position.y;
      }).attr('width', function (d) {
        return d.type.size.w;
      }).attr('height', function (d) {
        return d.type.size.h;
      }).attr('rx', function (d) {
        return 3;
      }).attr('ry', function (d) {
        return 3;
      }).attr('fill', function (d) {
        return d.background.color;
      });
    }
  }, {
    key: "drawTypeText",
    value: function drawTypeText(selection) {
      var _this3 = this;
      return selection.attr("x", function (d) {
        return d.padding + d.name.size.w + 11 + d.type.padding;
      }).attr("y", function (d) {
        return d.type.position.y + d.type.padding + _this3._default.line.font.size;
      }).attr("fill", function (d) {
        return '#fff';
      }).text(function (d) {
        return d.type.contents;
      });
    }
  }, {
    key: "drawType",
    value: function drawType(groups) {
      var rects = groups.append('rect').attr('class', 'entity-type');
      this.drawTypeRect(rects);
      var texts = groups.append('text').attr('class', 'entity-type');
      this.drawTypeText(texts).each(function (d) {
        var w = this.getBBox().width;
        if (w > (d.type._max_w || 0)) d.type._max_w = w;
      });
    }
    /* ************************************ *
     *  Identifiers                         *
     * ************************************ */
  }, {
    key: "drawIdentifiersRect",
    value: function drawIdentifiersRect(rects) {
      rects.attr('x', function (d) {
        return d.identifiers.position.x;
      }).attr('y', function (d) {
        return d.identifiers.position.y;
      }).attr('width', function (d) {
        return d.identifiers.size.w;
      }).attr('height', function (d) {
        return d.identifiers.size.h;
      }).attr('rx', function (d) {
        return 2;
      }).attr('ry', function (d) {
        return 2;
      }).attr('fill', function (d) {
        return d.identifiers.background.color;
      });
    }
  }, {
    key: "drawIdentifiersText",
    value: function drawIdentifiersText(texts) {
      return texts.attr("x", function (d) {
        return d.position.x;
      }).attr("y", function (d) {
        return d.position.y;
      }).text(function (d) {
        return d.name.val();
      });
    }
  }, {
    key: "drawIdentifiers",
    value: function drawIdentifiers(groups) {
      var rects = groups.append('rect').attr('class', 'entity-identifiers');
      this.drawIdentifiersRect(rects);
      var texts = groups.selectAll('text.identifier').data(function (d) {
        return d.identifiers.contents.list;
      }).enter().append('text').attr('class', 'identifier').attr('identifier-id', function (d) {
        return d._id;
      });
      this.drawIdentifiersText(texts).each(function (identifier) {
        var w = this.getBBox().width;
        if (w > identifier._entity._max_w.identifier) identifier._entity._max_w.identifier = w;
      });
    }
    /* ************************************ *
     *  Attributes                          *
     * ************************************ */
  }, {
    key: "drawAttributesRect",
    value: function drawAttributesRect(rects) {
      rects.attr('x', function (d) {
        return d.attributes.position.x;
      }).attr('y', function (d) {
        return d.attributes.position.y;
      }).attr('width', function (d) {
        return d.attributes.size.w;
      }).attr('height', function (d) {
        return d.attributes.size.h;
      }).attr('rx', function (d) {
        return 3;
      }).attr('ry', function (d) {
        return 3;
      }).attr('fill', function (d) {
        return d.identifiers.background.color;
      });
    }
  }, {
    key: "drawAttributesText",
    value: function drawAttributesText(texts) {
      return texts.attr("x", function (d) {
        return d.position.x;
      }).attr("y", function (d) {
        return d.position.y;
      }).text(function (d) {
        return d.name.val();
      });
    }
  }, {
    key: "drawAttributes",
    value: function drawAttributes(groups) {
      var rects = groups.append('rect').attr('class', 'entity-attributes');
      this.drawAttributesRect(rects);
      var texts = groups.selectAll('text.attribute').data(function (d) {
        return d.attributes.contents.list;
      }).enter().append('text').attr('class', 'attribute').attr('attribute-id', function (d) {
        return d._id;
      });
      this.drawAttributesText(texts).each(function (attribute) {
        var w = this.getBBox().width;
        if (w > attribute._entity._max_w.attribute) attribute._entity._max_w.attribute = w;
      });
    }
    /* ************************************ *
     *  Port                                *
     * ************************************ */
  }, {
    key: "drawPortsCore",
    value: function drawPortsCore(ports) {
      ports.attr('class', 'entity-port').attr('cx', function (d) {
        return d.position.x;
      }).attr('cy', function (d) {
        return d.position.y;
      }).attr('r', 4).attr('fill', '#fff').attr('stroke', '#000').attr('stroke-width', 0.5).attr('degree', function (d) {
        return d._owner._core.position || 0;
      }).attr('port-id', function (d) {
        return d._id;
      });
    }
  }, {
    key: "drawPorts",
    value: function drawPorts(groups) {
      var ports = groups.selectAll('circle.entity-port').data(function (d) {
        return d.ports.items.list;
      }).enter().append('circle');
      this.drawPortsCore(ports);
    }
    /* ************************************ *
     *  relationships                       *
     * ************************************ */
  }, {
    key: "drawRelationshipsCore",
    value: function drawRelationshipsCore(edges) {
      edges.attr('x1', function (d) {
        var port = d.from;
        var entity = d.from._entity;
        return port.position.x + entity.position.x;
      }).attr('y1', function (d) {
        var port = d.from;
        var entity = d.from._entity;
        return port.position.y + entity.position.y;
      }).attr('x2', function (d) {
        var port = d.to;
        var entity = d.to._entity;
        return port.position.x + entity.position.x;
      }).attr('y2', function (d) {
        var port = d.to;
        var entity = d.to._entity;
        return port.position.y + entity.position.y;
      }).attr('stroke', '#888888').attr('stroke-width', 1);
    }
  }, {
    key: "drawRelationships",
    value: function drawRelationships(relationships) {
      var place = this.background;
      var data = relationships.list.filter(function (edge) {
        return edge.from._class === 'PORT-FROM' && edge.to._class === 'PORT-TO';
      });
      var edges = place.selectAll('line.connector').data(data, function (d) {
        return d._id;
      }).enter().append('line').attr('class', 'connector');
      this.drawRelationshipsCore(edges);
    }
    /* ************************************ *
     *  Draw Main                           *
     * ************************************ */
  }, {
    key: "redraw",
    value: function redraw(groups) {
      this.drawBodyCore(groups.selectAll('rect.entity-body'));
      this.drawNameRect(groups.selectAll('rect.entity-title'));
      this.drawNameText(groups.selectAll('text.entity-title'));
      this.drawTypeRect(groups.selectAll('rect.entity-type'));
      this.drawTypeText(groups.selectAll('text.entity-type'));
      this.drawIdentifiersRect(groups.selectAll('rect.entity-identifiers'));
      this.drawIdentifiersText(groups.selectAll('text.identifier'));
      this.drawAttributesRect(groups.selectAll('rect.entity-attributes'));
      this.drawAttributesText(groups.selectAll('text.attribute'));
    }
  }, {
    key: "draw",
    value: function draw(entities, relationsihps) {
      var groups = this.drawGroup(entities.list);
      this.drawBody(groups);
      this.drawName(groups);
      this.drawType(groups);
      this.drawIdentifiers(groups);
      this.drawAttributes(groups);

      // resizing & redraw
      groups.each(function (entity) {
        return entity.reSizing().positioning();
      });
      this.redraw(groups);
      this.drawPorts(groups);
      this.drawRelationships(relationsihps);
    }
  }]);
  return Painter;
}();