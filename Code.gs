/**
 * 萬聖節報名後端 — Google Apps Script
 * 部署方式：見 README.md
 *
 * GET  ?action=stats  → { count, plusOnes, total, going:[名字…], maybe, updatedAt }
 * POST body(JSON)     → { ok:true }  寫入或更新一筆報名（同名會覆蓋）
 */

var SHEET_NAME = '報名';
var DEADLINE = '2026-10-10T23:59:59+08:00'; // 報名期限（台北時間）

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(['時間', '名字', '出席', '攜伴人數', '變裝主題', '備註', 'LINE/聯絡']);
    sh.setFrozenRows(1);
  }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  var sh = getSheet_();
  var rows = sh.getDataRange().getValues().slice(1);
  var going = [], maybe = 0, plusOnes = 0;
  rows.forEach(function (r) {
    if (!r[1]) return;
    if (r[2] === '去') { going.push(String(r[1])); plusOnes += Number(r[3]) || 0; }
    else if (r[2] === '再看看') maybe++;
  });
  return json_({
    count: going.length,
    plusOnes: plusOnes,
    total: going.length + plusOnes,
    going: going,
    maybe: maybe,
    deadline: DEADLINE,
    updatedAt: new Date().toISOString()
  });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var d = JSON.parse(e.postData.contents || '{}');
    var name = String(d.name || '').trim().slice(0, 30);
    if (!name) return json_({ ok: false, error: 'name required' });
    if (new Date() > new Date(DEADLINE)) return json_({ ok: false, error: 'closed' });

    var status = ['去', '再看看', '不去'].indexOf(d.status) >= 0 ? d.status : '去';
    var plus = Math.max(0, Math.min(3, parseInt(d.plusOnes, 10) || 0));
    var row = [new Date(), name, status, plus,
      '',
      String(d.note || '').slice(0, 200),
      String(d.contact || '').slice(0, 60)];

    var sh = getSheet_();
    var values = sh.getDataRange().getValues();
    for (var i = 1; i < values.length; i++) {
      if (String(values[i][1]).trim() === name) {
        sh.getRange(i + 1, 1, 1, row.length).setValues([row]);
        return json_({ ok: true, updated: true });
      }
    }
    sh.appendRow(row);
    return json_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}
