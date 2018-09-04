function scraper() {
  var ss=SpreadsheetApp.getActiveSpreadsheet();
  var ui=SpreadsheetApp.getUi();
  var sheet=ss.getActiveSheet();
  var range=sheet.getActiveRange().getDisplayValues();
  var edit=[];var skip=false;var myXX=["MY18","MY19"];var current=[];
  for(var i=0;i<range.length;i++){
    current=[];
    skip=false;
    if(i==0||(range[i][0]!="Model"&&range[i][0]!=myXX[0]&&range[i][0]!=myXX[1])){
      if(i==0){skip=true;}
      for(var j=0;j<range[i].length;j++){
        if(range[i][j]!=undefined&&range[i][j]!=""){
          if(current.length==1&&!skip){skip=true;}
          else {current[current.length]=range[i][j];}
        }
      }
      edit[edit.length]=current;
    }
  }
  range=edit;
  var empty=true;var col=1;
  var range2=[];var current;
  range2[0]=range[0];
  for(i=0;i<range[0].length;i++){
    range2[0][i]=range[0][i].split(" ")[0];
  }
  for(i=1;i<range.length;i++){
      current=range[i][0].split(" / ");
      if(current.length>1){
        Logger.log("SPLIT @ "+i+": "+current);
        for(var j=0;j<current.length;j++){
          range2[range2.length]=[current[j]];
          for(var k=1;k<range[i].length;k++){
            range2[range2.length-1][k]=range[i][k];
          }
          Logger.log(range2[range2.length-1]);
        }
        Logger.log("End of SPLIT");
      }
      else{range2[range2.length]=range[i];}
  }
  range2[0][0]="model_code";
  for(i=1;i<range2.length;i++){
    empty=true;
    for(j=1;j<range2[i].length&&empty;j++){
      if(range2[i][j]!="N/A"){empty=false;break;}
    }
    if(empty){range2.splice(i,1);}
  }
  for(i=2;i<range2[0].length;i++){
    if(parseInt(range2[0][i])<parseInt(range2[0][i-1])){col=parseInt(i);Logger.log(col);break;}
  }
  range=[];edit=[];
  for(i=0;i<range2.length;i++){
    range[i]=[];edit[i]=[];
    for(j=0;j<range2[i].length;j++){
      if(j==0){range[i][0]=range2[i][0];edit[i][0]=range2[i][0];}
      else if(j<col){range[i][range[i].length]=range2[i][j];}
      else{edit[i][edit[i].length]=range2[i][j];}
    }
  }
  if(range[0].length>edit[0].length){var temp=range;range=edit;edit=temp;}
  if(ss.getSheetByName("Lease")!=null){ss.deleteSheet(ss.getSheetByName("Lease"));}
  if(ss.getSheetByName("Balloon")!=null){ss.deleteSheet(ss.getSheetByName("Balloon"));}
  var newSheet=ss.insertSheet().setName("Lease");
  var newSheet2=ss.insertSheet().setName("Balloon");
  newSheet.deleteRows(range.length+1, newSheet.getMaxRows()-range.length);
  newSheet.deleteColumns(range[0].length+1, newSheet.getMaxColumns()-range[0].length);
  newSheet2.deleteRows(edit.length+1, newSheet2.getMaxRows()-edit.length);
  newSheet2.deleteColumns(edit[0].length+1, newSheet2.getMaxColumns()-edit[0].length);
  SpreadsheetApp.flush();
  newSheet2.getRange(1, 1, edit.length, edit[0].length).setValues(edit);
  newSheet.getRange(1, 1, range.length, range[0].length).setValues(range);
  //ss.deleteSheet(sheet);
  ss.toast('Finished!','DONE');
}
