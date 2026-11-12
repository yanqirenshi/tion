"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = Panel;
var React = _interopRequireWildcard(require("react"));
var _Box = _interopRequireDefault(require("@mui/material/Box"));
var _SvgIcon = _interopRequireDefault(require("@mui/material/SvgIcon"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var sx_org = {
  border: '1px solid rgba(0, 0, 0, 0.12)',
  borderRadius: 1,
  p: 2
};

// kind ごとの色。background は背景、border は枠、icon はアイコンの色。
var KINDS = {
  info: {
    background: '#e9f2ff',
    border: '#cce0ff',
    icon: '#1d7afc'
  },
  note: {
    background: '#f3f0ff',
    border: '#dfd8fd',
    icon: '#8f7ee7'
  },
  warning: {
    background: '#fff7d6',
    border: '#f8e6a0',
    icon: '#b38600'
  },
  success: {
    background: '#dcfff1',
    border: '#baf3db',
    icon: '#22a06b'
  },
  error: {
    background: '#ffeceb',
    border: '#ffd5d2',
    icon: '#e2483d'
  }
};

// kind の既定アイコン。MUI の SvgIcon と単純な図形(circle・path・line)で描く。
// 線の色は currentColor(SvgIcon の color)、塗りは無し。
function Strokes(props) {
  return /*#__PURE__*/React.createElement("g", {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, props.children);
}
var ICONS = {
  // 丸の中に i
  info: /*#__PURE__*/React.createElement(Strokes, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "11",
    x2: "12",
    y2: "16.5"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "7.8",
    x2: "12",
    y2: "7.9"
  })),
  // 紙(右上が折れている)とメモの行
  note: /*#__PURE__*/React.createElement(Strokes, null, /*#__PURE__*/React.createElement("path", {
    d: "M6 3.5 H14 L18 7.5 V20.5 H6 Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M14 3.5 V7.5 H18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "9",
    y1: "12",
    x2: "15",
    y2: "12"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "9",
    y1: "16",
    x2: "15",
    y2: "16"
  })),
  // 三角の中に !
  warning: /*#__PURE__*/React.createElement(Strokes, null, /*#__PURE__*/React.createElement("path", {
    d: "M12 3.5 L21.5 20 H2.5 Z"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "9.8",
    x2: "12",
    y2: "14.5"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "17.2",
    x2: "12",
    y2: "17.3"
  })),
  // 丸の中にチェック
  success: /*#__PURE__*/React.createElement(Strokes, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 12.5 L11 15.5 L16.5 9"
  })),
  // 丸の中に ×
  error: /*#__PURE__*/React.createElement(Strokes, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "9",
    y1: "9",
    x2: "15",
    y2: "15"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "15",
    y1: "9",
    x2: "9",
    y2: "15"
  }))
};

// 知らない kind(例: "foo"、"constructor")は、kind なしと同じにする。
function findKind(kind) {
  return typeof kind === 'string' && Object.prototype.hasOwnProperty.call(KINDS, kind) ? kind : null;
}

// icon: 未指定(または true)は既定のアイコン。false と null は出さない。それ以外(ReactNode)は既定の代わりにそれを出す。
function iconOf(kind, icon) {
  if (icon === false || icon === null) return null;
  if (icon === undefined || icon === true) return /*#__PURE__*/React.createElement(_SvgIcon["default"], {
    "aria-hidden": "true",
    sx: {
      fontSize: '20px',
      color: KINDS[kind].icon
    }
  }, ICONS[kind]);
  return icon;
}
function Panel(props) {
  var children = props.children;
  var sx = props.sx || {};
  var kind = findKind(props.kind);

  // kind なし: これまでと同じ DOM と見た目。
  if (!kind) return /*#__PURE__*/React.createElement(_Box["default"], {
    sx: _objectSpread(_objectSpread({}, sx_org), sx)
  }, children);
  var colors = {
    backgroundColor: KINDS[kind].background,
    borderColor: KINDS[kind].border
  };
  var icon = iconOf(kind, props.icon);

  // icon={false}: 色だけ変え、flex もアイコンの枠も付けない。
  if (icon === null) return /*#__PURE__*/React.createElement(_Box["default"], {
    sx: _objectSpread(_objectSpread(_objectSpread({}, sx_org), colors), sx)
  }, children);
  return /*#__PURE__*/React.createElement(_Box["default"], {
    sx: _objectSpread(_objectSpread(_objectSpread({}, sx_org), colors), {}, {
      display: 'flex',
      gap: 1.5,
      alignItems: 'flex-start'
    }, sx)
  }, /*#__PURE__*/React.createElement(_Box["default"], {
    sx: {
      display: 'flex',
      alignItems: 'center',
      height: '1.5em',
      flexShrink: 0
    }
  }, icon), /*#__PURE__*/React.createElement(_Box["default"], {
    sx: {
      flex: 1,
      minWidth: 0
    }
  }, children));
}