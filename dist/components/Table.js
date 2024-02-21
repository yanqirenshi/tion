"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = Table;
var React = _interopRequireWildcard(require("react"));
var _Table = _interopRequireDefault(require("@mui/material/Table"));
var _TableBody = _interopRequireDefault(require("@mui/material/TableBody"));
var _TableCell = _interopRequireWildcard(require("@mui/material/TableCell"));
var _TableContainer = _interopRequireDefault(require("@mui/material/TableContainer"));
var _TableHead = _interopRequireDefault(require("@mui/material/TableHead"));
var _TableRow = _interopRequireDefault(require("@mui/material/TableRow"));
var _Paper = _interopRequireDefault(require("@mui/material/Paper"));
var _styles = require("@mui/material/styles");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function Table(props) {
  var columns = props.columns || [];
  var rows = props.rows || [];
  var ids = props.ids;
  var id_col = ids.column || null;
  var id_row = ids.column || null;
  return /*#__PURE__*/React.createElement(_TableContainer["default"], {
    component: _Paper["default"]
  }, /*#__PURE__*/React.createElement(_Table["default"], {
    sx: {
      minWidth: 650
    },
    size: "small"
  }, /*#__PURE__*/React.createElement(_TableHead["default"], null, /*#__PURE__*/React.createElement(_TableRow["default"], null, columns.map(function (column, i) {
    return /*#__PURE__*/React.createElement(_TableCell["default"], {
      key: id_col ? id_col(column, i) : i,
      align: "center"
    }, column.label);
  }))), /*#__PURE__*/React.createElement(_TableBody["default"], null, rows.map(function (row, i) {
    return /*#__PURE__*/React.createElement(_TableRow["default"], {
      key: id_row ? id_col(row, i) : i,
      sx: {
        '&:last-child td, &:last-child th': {
          border: 0
        }
      }
    }, columns.map(function (column, i) {
      return /*#__PURE__*/React.createElement(_TableCell["default"], {
        key: i,
        sx: column.sx
      }, value(column, row));
    }));
  }))));
}
function value(column, row) {
  if (column.key) return row[column.key];
  if (column.val) return column.val(row);
  return null;
}