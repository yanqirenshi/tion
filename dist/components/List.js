"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LI = LI;
exports.OL = OL;
exports.UL = UL;
var React = _interopRequireWildcard(require("react"));
var _Box = _interopRequireDefault(require("@mui/material/Box"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
// LI の中にいるかどうか。LI の中に置いた UL・OL は、入れ子用の余白にする。
// CSS の子孫セレクタではなく context で伝えるのは、UL・OL 自身の sx を
// 入れ子用の既定値より優先させるため(セレクタだと親の LI の規則が勝ってしまう)。
var NestedContext = /*#__PURE__*/React.createContext(false);

// UL・OL の入れ子の深さ(一番外側が 1。外側にある UL と OL を区別せずに数える)。
// UL・OL が自分の深さを子孫に渡す。LI は深さを変えない。
var DepthContext = /*#__PURE__*/React.createContext(0);

// sx はオブジェクトでも配列でもよいので、配列にそろえて既定値の後ろに重ねる。
function overlay(base, sx) {
  return [base].concat(_toConsumableArray(Array.isArray(sx) ? sx : [sx]));
}

// 記号と番号の種類。ブラウザの既定のスタイルシートと同じ規則にする。
// Bulma などの CSS のリセット(ul { list-style: none; } など)で記号が消えないよう、
// 既定のままにせず明示する。
function markerOf(tag, depth) {
  if (tag === 'ol') return 'decimal';
  if (depth === 1) return 'disc';
  if (depth === 2) return 'circle';
  return 'square';
}
function listSx(tag, depth, nested) {
  return _objectSpread({
    m: 0,
    mb: 1,
    pl: 3,
    typography: 'body1',
    listStyleType: markerOf(tag, depth),
    // 記号を行の外に出す(2 行目以降が本文の頭にそろう字下げの前提)。リセットで消されやすいので明示する。
    listStylePosition: 'outside'
  }, nested ? {
    mt: 0.5,
    mb: 0
  } : {});
}
function List(props) {
  var nested = React.useContext(NestedContext);
  var depth = React.useContext(DepthContext) + 1;
  return /*#__PURE__*/React.createElement(_Box["default"], {
    component: props.tag,
    start: props.start,
    sx: overlay(listSx(props.tag, depth, nested), props.sx)
  }, /*#__PURE__*/React.createElement(DepthContext.Provider, {
    value: depth
  }, props.children));
}
function UL(props) {
  return /*#__PURE__*/React.createElement(List, {
    tag: "ul",
    sx: props.sx
  }, props.children);
}
function OL(props) {
  return /*#__PURE__*/React.createElement(List, {
    tag: "ol",
    start: props.start,
    sx: props.sx
  }, props.children);
}
function LI(props) {
  return (
    /*#__PURE__*/
    // li { display: block } などのリセットで記号が消えないよう、display を明示する。
    React.createElement(_Box["default"], {
      component: "li",
      sx: overlay({
        display: 'list-item',
        mb: 0.5
      }, props.sx)
    }, /*#__PURE__*/React.createElement(NestedContext.Provider, {
      value: true
    }, props.children))
  );
}