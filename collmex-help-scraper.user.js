// ==UserScript==
// @name         Collmex Api Description Scraper
// @namespace    http://klimapartner.de/
// @version      0.3.0
// @description  Erweiterungen für Collmex
// @author       Holger Will
// @match        https://www.collmex.de/cgi-bin/cgi.exe?*,*,*
// @updateURL    http://admin.klimapartner.de/public/userscripts/help.user.js
// @require      http://code.jquery.com/jquery-latest.js
// @grant        GM_addStyle
// ==/UserScript==
GM_addStyle(".sql{color:orange;font-weight:bold}");
GM_addStyle(".sqltext{color:#eee;font-weight:200}");


GM_addStyle(".json_value{color:orange;font-weight:700}");
GM_addStyle(".json_name{color:white;}");
GM_addStyle(".json_template_div{width:780px;border:1px solid #ddd;padding:10px;background:#333;font-family:monospace;color:gray}");
GM_addStyle(".sql_template_div{width:780px;border:1px solid #ddd;padding:10px;background:#333;font-family:monospace;color:gray}");
GM_addStyle(".json_token1{color:red;}");
GM_addStyle(".json_token2{color:lightgreen;}");
GM_addStyle(".json_token3{color:turquoise;}");
GM_addStyle(".blc{padding-left:10px}");


var qs=window.location.search;
var qse=qs.split(",");
switch(qse[2]){
    case "crm":
    break;
    case "help":
        var sp=qse[3].split("_");
        if(sp[0]=="api") createHelpMenu();
        if(sp[0]=="daten") createHelpMenu();
    break;
}


function createHelpMenu(){
     var lookup={"C":"VARCHAR","I":"INT","D":"DATE","M":"DECIMAL(15,3)","N":"DECIMAL(15,3)","T":"TIME"};
    $("<div id='mymenu'></div>").insertAfter("#dv-hilfe p:nth-of-type(1)");
    var mm=document.getElementById("mymenu");

    var b=document.createElement("button");
    b.innerText="Tabelle";
    b.addEventListener("click",showTabelle,true);
    mm.appendChild(b);

    b=document.createElement("button");
    b.innerText="CSV Template";
    b.addEventListener("click",showCSV,true);
    mm.appendChild(b);

    b=document.createElement("button");
    b.innerText="JSON Template";
    b.addEventListener("click",showJSON,true);
    mm.appendChild(b);

    b=document.createElement("button");
    b.innerText="SQL";
    b.addEventListener("click",showSQL,true);
    mm.appendChild(b);
  // create CVS Template
   /* $("<div id='csv_template_div'>hallo</div>").insertAfter("table.help");
    $("#csv_template_div").css({"display":"none","width":"780px","border":"1px solid #ddd","padding":"10px","background":"#333"});
    var st="";
    var li=$("table.help")[0].getElementsByTagName("tr");
    st+="<span style='font-weight:700;color:orange'>"+li[1].getElementsByTagName("td")[4].innerText.split(" ")[1]+"</span>";
    for(var i=2;i<li.length;i++){
        st+="<span style='color:white;font-weight:700'>;</span><span style='color:grey'> ["+li[i].getElementsByTagName("td")[1].innerText+"] </span>";
    }
    $("#csv_template_div").html(st);*/

// create SQL Template
    /*
    $("<div id='sql_template_div'>Hallo</div>").insertAfter("table.help");
    $("#sql_template_div").css({"display":"none","width":"780px","border":"1px solid #ddd","padding":"10px","background":"#333"});
    st="";
    li=$("table.help")[0].getElementsByTagName("tr");
    st+="<span class='sql'>CREATE TABLE</span> <span class='sqltext'>"+li[1].getElementsByTagName("td")[4].innerText.split(" ")[1]+"</span><br/><span class='sqltext'>(</span><br/>";
    st+="<span class='sqltext'>"+li[2].getElementsByTagName("td")[1].innerText+" </span><span class='sql'>"+lookup[li[2].getElementsByTagName("td")[2].innerText]+""+getSize(li[2].getElementsByTagName("td")[2].innerText,li[2].getElementsByTagName("td")[3].innerText)+"</span>";
    for(i=3;i<li.length;i++){
        st+="<span class='sqltext'>,</span><br/><span class='sqltext'>"+li[i].getElementsByTagName("td")[1].innerText+" </span><span class='sql'>"+lookup[li[i].getElementsByTagName("td")[2].innerText]+""+getSize(li[i].getElementsByTagName("td")[2].innerText,li[i].getElementsByTagName("td")[3].innerText)+"</span>";
    }
    st+="<br/><span class='sqltext'>)</span>;";
    $("#sql_template_div").html(st);*/
    var tables=$("table.help");
    for(var t=0;t<tables.length;t++){
        $("<div class='sql_template_div' id='std_"+t+"'>Hallo</div>").insertAfter(tables[t]);
        $("#std_"+t).css({"display":"none"});
        st="";
        li=tables[t].getElementsByTagName("tr");
        var name = li[1].getElementsByTagName("td")[4].innerText.split(" ")[1];
        st=`CREATE TABLE IF NOT EXISTS ${jsv(name)} ${jst("(",2)}<div class="blc">${jsn("Satzart")} ${jst("CHAR",1)}(${name.length}) DEFAULT "${jsv(name)}"`;
        var rescount=0;
        for(i=2;i<li.length;i++){
            if(li[i].getElementsByTagName("td").length>1){
                name=li[i].getElementsByTagName("td")[1].innerText;
                var typ=li[i].getElementsByTagName("td")[2].innerText;
                var typname=lookup[typ];
                var length=li[i].getElementsByTagName("td")[3].innerText;
                if(length!=="") length="("+length+")";
                if(typ=="T" || typ=="D" || typ=="M" || typ=="N") length="";
                if(name=="Reserviert"){
                    rescount++;
                    name="Reserviert"+rescount;
                }
                name=name.replace(/-/g,"_");
                name=name.replace(/ /g,"_");
                st+=`${jst(",",3)}<br/>`;
                st+=`${jsn(name)} ${jst(typname,1)}${length}`;
            }
        }
        st+=`</div>${jst(")",2)}`;
        $("#std_"+t).html(st);
        console.log($("#std_"+t));
    }
 // create JSON Template
    var tables=$("table.help");
    for(var t=0;t<tables.length;t++){
        $("<div class='json_template_div' id='jtd_"+t+"'>Hallo</div>").insertAfter(tables[t]);
        $("#jtd_"+t).css({"display":"none"});
        st="";
        li=tables[t].getElementsByTagName("tr");
        var name = li[1].getElementsByTagName("td")[4].innerText.split(" ")[1];
        st=`"${jsv(name)}" ${jst(":",1)} ${jst("{",2)}<div class="blc">"${jsn("Satzart")}" ${jst(":",1)} "${jsv(name)}"`;
        var rescount=0;
        for(i=2;i<li.length;i++){
            if(li[i].getElementsByTagName("td").length>1){
                name=li[i].getElementsByTagName("td")[1].innerText;
                if(name=="Reserviert"){
                    rescount++;
                    name="Reserviert"+rescount;
                }
                name=name.replace(/-/g,"_");
                name=name.replace(/ /g,"_");
                st+=`${jst(",",3)}<br/>`;
                st+=`"${jsn(name)}" ${jst(":",1)} ""`;
            }
        }
        st+=`</div>${jst("}",2)}`;
        $("#jtd_"+t).html(st);
        console.log($("#jtd_"+t));
    }
}


function jst(st,n){
    return `<span class="json_token${n}">${st}</span>`;
}
function jsn(st){
    return `<span class="json_name">${st}</span>`;
}
function jsv(st){
    return `<span class="json_value">${st}</span>`;
}

function getSize(t,x){
if($.isNumeric(x) && t=="C") return "("+x+")";
   return "";
}

function showTabelle(){
    hideAll();
    $("table.help").css({"display":"table"});
}
function showCSV(){
    hideAll();
    $("#csv_template_div").css({"display":"block"});
}
function showSQL(){
    hideAll();
    $(".sql_template_div").css({"display":"block"});
}
function showJSON(){
    hideAll();
    $(".json_template_div").css({"display":"block"});
}
function hideAll(){
    $("table.help").css({"display":"none"});
    $("#csv_template_div").css({"display":"none"});
    $(".sql_template_div").css({"display":"none"});
    $(".json_template_div").css({"display":"none"});
}
