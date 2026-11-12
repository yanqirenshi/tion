"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = Check;
var React = _interopRequireWildcard(require("react"));
var _Box = _interopRequireDefault(require("@mui/material/Box"));
var _Checkbox = _interopRequireDefault(require("@mui/material/Checkbox"));
var _Typography = _interopRequireDefault(require("@mui/material/Typography"));
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
// sx はオブジェクトでも配列でもよいので、配列にそろえて既定値の後ろに重ねる。
function overlay(base, sx) {
  return [base].concat(_toConsumableArray(Array.isArray(sx) ? sx : [sx]));
}

// チェック項目。左に Checkbox、右に title(太字)と、その下に説明(children)を置く。
//   onChange あり: 操作できる(制御されたコンポーネント。checked は親が持つ)。
//   onChange なし: 表示だけ。クリックしても変わらない。
function Check(props) {
  var title = props.title,
    children = props.children,
    onChange = props.onChange;
  var sx = props.sx;
  var checked = Boolean(props.checked);
  var interactive = typeof onChange === 'function';
  var id = React.useId();
  var hasDescription = React.Children.toArray(children).length > 0;

  // 表示だけのときは、input に aria-readonly="true" を付ける(disabled にすると色が薄くなって読みにくい)。
  // MUI の Checkbox は、input に属性を渡す props が版で違う(5〜7 は inputProps、9 は slotProps.input)。
  // 版ごとに props を出し分けると、合わない版では DOM への未知の prop として警告になるので、
  // 外側の Box から input を探して付ける。
  var boxRef = React.useRef(null);
  React.useEffect(function () {
    var input = boxRef.current ? boxRef.current.querySelector('input') : null;
    if (!input) return;
    if (interactive) input.removeAttribute('aria-readonly');else input.setAttribute('aria-readonly', 'true');
  }, [interactive]);

  // MUI は (event, checked) で呼ぶ。tion は (checked, event) の順にする。
  var handleChange = interactive ? function (event) {
    return onChange(event.target.checked, event);
  } : undefined;
  return /*#__PURE__*/React.createElement(_Box["default"], {
    ref: boxRef,
    sx: overlay({
      display: 'flex',
      alignItems: 'flex-start',
      gap: 1,
      mb: 1.5
    }, sx)
  }, /*#__PURE__*/React.createElement(_Box["default"], {
    sx: {
      display: 'flex',
      alignItems: 'center',
      height: '1.5em',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(_Checkbox["default"], {
    id: id,
    size: "small",
    checked: checked,
    onChange: handleChange,
    disableRipple: !interactive,
    sx: _objectSpread({
      p: 0
    }, interactive ? {} : {
      cursor: 'default'
    })
  })), /*#__PURE__*/React.createElement(_Box["default"], {
    sx: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(_Typography["default"], {
    component: "label",
    htmlFor: id,
    variant: "body1",
    sx: {
      display: 'block',
      fontWeight: 'bold'
    }
  }, title), hasDescription && /*#__PURE__*/React.createElement(_Box["default"], {
    sx: {
      mt: 0.5,
      typography: 'body1'
    }
  }, children)));
}