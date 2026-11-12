"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = E;
var React = _interopRequireWildcard(require("react"));
var _Box = _interopRequireDefault(require("@mui/material/Box"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// 色の名前 → MUI のテーマのパレット(ThemeProvider で変えれば、E の色も変わる)
var COLORS = {
  emphasis: 'primary.main',
  caution: 'error.main'
};
function colorOf(color) {
  if (color === undefined || color === null || color === '') return null;

  // 名前以外の値('#c00' や 'text.secondary' など)は、そのまま sx の color に渡す
  if (typeof color === 'string' && Object.prototype.hasOwnProperty.call(COLORS, color)) return COLORS[color];
  return color;
}

// 文の途中に置ける強調(インライン)。display は指定しない。
function E(props) {
  var bold = props.bold === undefined ? true : Boolean(props.bold);
  var underline = Boolean(props.underline);
  var color = colorOf(props.color);
  var children = props.children;
  var sx = props.sx || {};
  var sx_org = {};
  if (bold) sx_org.fontWeight = 'bold';
  if (underline) {
    sx_org.textDecoration = 'underline';
    sx_org.textUnderlineOffset = '0.2em';
  }
  if (color !== null) sx_org.color = color;
  return /*#__PURE__*/React.createElement(_Box["default"], {
    component: bold ? 'strong' : 'span',
    sx: _objectSpread(_objectSpread({}, sx_org), sx)
  }, children);
}