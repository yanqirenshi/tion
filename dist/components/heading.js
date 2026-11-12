"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.headingProps = headingProps;
exports.normalizeLev = normalizeLev;
// Section と H で共通の、見出しレベルの規則。

var DEFAULT_LEV = 4;

// lev は数値でも文字列("5")でもよい。
// 小数は切り捨て、1 以上の整数にならない値や省略時は既定の 4 にする。
function normalizeLev(lev) {
  var n = typeof lev === 'string' ? Number(lev) : lev;
  if (typeof n !== 'number' || !Number.isFinite(n)) return DEFAULT_LEV;
  var level = Math.floor(n);
  return level >= 1 ? level : DEFAULT_LEV;
}

// 1〜6 は h1〜h6。7 以上は要素を h6 のまま、見た目だけ小さい太字にする
// (7 は subtitle1、8 以上は subtitle2)。本当の深さは level(data-lev)で読む。
function headingProps(lev) {
  var level = normalizeLev(lev);
  if (level <= 6) return {
    level: level,
    variant: 'h' + level,
    component: 'h' + level
  };
  return {
    level: level,
    variant: level === 7 ? 'subtitle1' : 'subtitle2',
    component: 'h6',
    sx: {
      fontWeight: 'bold'
    }
  };
}