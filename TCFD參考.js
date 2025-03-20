//啟動時，判斷js是否讀取完畢
$(function () {
    checkScriptHandler("esg_ClimateCheckList.js");
})

//新增
async function createClimateAdd(){
    loadingShow();
    let userObj = getUidToken();
    let uid = userObj.uid;
    let token = userObj.token;
    await apiS140020001(uid, token).done(function (json) {
        if (json && json.rc == "M0000") {
            $('#allShowClimateDiv').addClass('hide'); //氣候風險檢核表(TCFD)
            //日期
            let getTime = new Date().toISOString().substring(0, 10).replace(/-/g, "/");
            $(".getTime").val(getTime);
            //分行別
            let branchId = $('.personalDiv').find(".msg_branch").text();
            $('.branch').val(branchId);
            //業務別
            if (json.result && json.result.business) {
                $.each(json.result.business, (i, v) => {
                    const $opt = $("<option>");
                    $opt.attr("value", v.code);
                    $opt.text(v.name);
                    $(".business").append($opt);
                });
            }
            loadingHide();
        } else {
            apiErrorHandler(json);
            loadingHide();
        }
    })
}

//查詢
async function createClimateSearch(){
    loadingShow();
    let userObj = getUidToken();
    let uid = userObj.uid;
    let token = userObj.token;
    await apiS140020007(uid, token).done(function (json) {
        if (json && json.rc == "M0000") {
            //目前經辦
            let uId = $('.personalDiv').find(".msg_uid").text();
            $('.uid').val(uId);
            //建立日期
            let searchDate_str = new Date().toISOString().substring(0, 10).replace(/-/g, "-");
            $('.searchdate_str').val(searchDate_str);
            let searchDate_end = new Date().toISOString().substring(0, 10).replace(/-/g, "-");
            $('.searchdate_end').val(searchDate_end);
            //分行別
            if (json.result && json.result.branch) {
                $.each(json.result.branch, (i, v) => {
                    const $opt = $("<option>");
                    $opt.attr("value", v.code);
                    $opt.text(v.name);
                    $(".branch").append($opt);
                });
            }
            //業務別
            if (json.result && json.result.business) {
                $.each(json.result.business, (i, v) => {
                    const $opt = $("<option>");
                    $opt.attr("value", v.code);
                    $opt.text(v.name);
                    $(".business").append($opt);
                });
            }

            let $id = $('#esgSearchCaseDiv');
            //查詢按鈕
            let $btn = $id.find(".searchBtnTCFD");
            //綁定欄位
            let inputListArr = [".uid", ".searchdate_str", ".searchdate_end", ".branch", 
            "business", "accID", "accName", "appNumber"];
            //綁定enter 
            enterSearch($id, inputListArr, $btn);//給予預設值

            loadingHide();
        } else {
            apiErrorHandler(json);
            loadingHide();
        }
    })
}

//新增案件-帶入戶名
async function esgFindName() {
    loadingShow("查詢戶名中...");
    $('.btnNameDisabled').prop('disabled', true);
    let userObj = getUidToken();
    let uid = userObj.uid;
    let token = userObj.token;
    let data = {};
    let tmpAccName = "";
    data["custid"] = $('.accBuildID').val() || "";
    data["business"] = $('.business').val() || "";;
    data["idcode"] = $('.idcode').val() || "";
    await apiS020050009(uid, token, data).done(function (json) {
        if (json.rc == "M0000") {
            if (json.result && json.result.cname) {
                tmpAccName = json.result.cname;
            }
            $('.accName').val(tmpAccName);
            $('.btnNameDisabled').prop('disabled', false);
            loadingHide();
        } else {
            $('.btnNameDisabled').prop('disabled', false);
            apiErrorHandler(json);
            loadingHide();
        }
    });
}

//新增案件-確認btn
async function esgBuildTCFD() {
    loadingShow("建立案件中..");
    let userObj = getUidToken();
    let uid = userObj.uid;
    let token = userObj.token;
    let data = {};
    let getTime = $('.getTime').val()|| ""; //日期
    let branch = $('.branch').val()|| ""; //分行別
    let business = $('.business').val()|| ""; //業務別
    let accID = $('.accBuildID').val()|| ""; //ID
    let accName = $('.accName').val()|| ""; //企業名稱
    
    let dataStr = ["getTime", "branch", "business", "accID", "accName"];
    let dataArr = [getTime, branch, business, accID, accName];
    dataStr.forEach((v, i)=>{
        data[dataStr[i]] = dataArr[i]
    })

    await apiS140020002(uid, token, data).done(function (json){
        if (json.rc == "M0000") {
            $('#allShowClimateDiv').removeClass('hide');
            $('.business').prop('disabled', true);
            $('.accBuildID').prop('disabled', true);
            $('.btnNameDisabled').prop('disabled', true);
            $('.accName').prop('disabled', true);
            $('.confirmBtnTCFD').prop('disabled', true);
            let caseNo = json.result.caseno 
            $('.caseClimateId').val(caseNo); //編號
            /////開始註冊dataTable/////  
            let table = '<table class="uploadfileTable table table-bordered table-hover text-center" style="table-layout:fixed;"></table>';
            let thead = '<thead>' +
                '<th>筆數</th>' +
                '<th>選項</th>' +
                '<th>檔案</th>' +
                '<th>夾檔人員</th>' +
                '<th>夾檔時間</th>' +
                '<th>案件操作</th></thead>';
            let tbody = '<tbody></tbody>';
            $('#allShowClimateDiv').find('.uploadfileDiv').empty().append(table);
            $('#allShowClimateDiv').find('.uploadfileDiv').find('table').append(thead).append(tbody);
            let opt = {
                "searching": false,//取消搜尋欄位
                "bAutoWidth": true, //自動適應
                "bRetrieve": true,
                "bStateSave": false,
                "scrollCollapse": true,
                "autowidth": false,
                "language": {
                    search: "搜尋表格:",
                    info: "顯示第 _START_ 至 _END_ 筆結果，共 _TOTAL_ 筆",
                    infoFiltered: "",
                    infoEmpty: "無相關資料",
                    zeroRecords: "沒有符合的資料",
                    lengthMenu: "顯示 _MENU_ 筆",
                    paginate: {
                        "first": "第一頁",
                        "previous": "上一頁",
                        "next": "下一頁",
                        "last": "最後一頁"
                    },
                },
                "columnDefs": [
                    { "targets": 0, "width": "8.5%", "visible": false, "orderable": false },
                    { "targets": 1, "width": "8.5%" },
                    { "targets": 2, "width": "8.5%" },
                    { "targets": 3, "width": "8.5%" },
                    { "targets": 4, "width": "12%" },
                    { "targets": 5, "width": "8%", "orderable": false },
                ],
                "order": [1, 'asc']
            };

            $('.uploadfileTable').DataTable(opt);
            $('.uploadfileTable').css('border', '1px solid #dee2e6').css('width', '');
            $('.uploadfileTable').find('thead th').addClass('align-middle');
            $('.uploadfileTable thead th').addClass('tableSort-top');
            $('.uploadfileTable').closest('.container-fluid').addClass('px-0');
            $(".col-sm-12").addClass('my-1');
            $(".dataTables_info").addClass('pt-2');
            /////dataTable結束/////
            
            // 取得目標區塊的y座標 //滑到該位置
            try {
                let target_top = $("#allShowClimateDiv").offset().top;
                window.scrollTo({
                    top: target_top,
                    behavior: "smooth"
                });
            } catch (e) { console.error(e) };
            
            loadingHide();
        }else{
            apiErrorHandler(json);
            loadingHide();
        }
    })
}

//查詢案件-查詢btn
async function esgSearchTCFD() {
    if (true) {
        TableHandlerTCFD();//製作清單 
        $("#frontHeader").empty();
        $("#frontBody").empty()
        $('html').animate({ scrollTop: 163 }, 100);
    }

    //製作清單
    function TableHandlerTCFD() {
        loadingShow("查詢案件中..");
        let userObj = getUidToken();
        let uid = userObj.uid; //目前經辦
        let token = userObj.token;
        let $id = $('#esgSearchCaseDiv');
        let data = {};
        let searchdate_str = $('.searchdate_str').val().replace(/-/g, '/'); //建立日期:起
        let searchdate_end = $('.searchdate_end').val().replace(/-/g, '/'); //建立日期:迄
        let branch = $('.branch').val()|| ""; //分行別
        let business = $('.business').val()|| ""; //業務別
        let accID = $('.accID').val()|| ""; //ID
        let accName = $('.accName').val()|| ""; //企業名稱
        let caseno = $('.appNumber').val()|| ""; //案件編號
        let dataStr = ["uid", "searchdate_str", "searchdate_end", "branch", "business", "accID", "accName", "caseno"];
        let dataArr = [uid, searchdate_str, searchdate_end, branch, business, accID, accName, caseno];
        dataStr.forEach((v, i)=>{
            data[dataStr[i]] = dataArr[i];
        })

        apiS140020008(uid, token, data).done(function (jsondata) {
            if (jsondata.rc == "M0000") {
                $('#msg_token').text(jsondata.token);
                $id.collapse('hide');
                let list = jsondata.result;
                let div = '<div>' +
                    '<div class="form-group my-3">' +
                    '<table id="resualtTable" class=" table table-bordered table-hover" style="table-layout:fixed;">' +
                    '<thead></thead><tbody></tbody></table></div></div>';
                let $div = $(div);
                let thead =
                    '<tr class="text-center">' +
                    '<th></th>' +
                    '<th></th>' +
                    '<th>建立日期</th>' +
                    '<th>案件編號</th>' +
                    '<th>戶名</th>' +
                    '<th>ID</th>' +
                    '<th>風險項目</th>' +
                    '<th>分行別</th>' +
                    '<th>業務別</th>' +
                    '<th>案件狀態</th>' +
                    '</tr>';
                $div.find('thead').append(thead);
                $('#searchANS').html($div.html()).addClass('card');
                TableInitHandlerTCFD(list);
                $('#modalPT2').remove();
                let url = ajaxhttpIPHostHtml('/todolist/todolist_progressTable.html');
                $.when($.ajax(url)).done(function (html) { 
                    let $html = $(html).find('#ajaxViewModalPT2');
                    let $table = $('#resualtTable');
                });
                loadingHide();
            } else {
                loadingHide();
                $('#msg_token').text(jsondata.token);
                apiErrorHandler(jsondata);
            }
        });

        function TableInitHandlerTCFD(list) {
            let opt = {
                "bAutoWidth": false, //自動適應寬度
                "bRetrieve": true,
                "bStateSave": false,
                "scrollCollapse": true,
                "autowidth": false,
                "language": {
                    search: "搜尋表格:",
                    info: "顯示第 _START_ 至 _END_ 筆結果，共 _TOTAL_ 筆",
                    infoFiltered: "",
                    infoEmpty: "無相關資料",
                    zeroRecords: "沒有符合的資料",
                    lengthMenu: "顯示 _MENU_ 筆",
                    paginate: {
                        "first": "第一頁",
                        "previous": "上一頁",
                        "next": "下一頁",
                        "last": "最後一頁"
                    },
                },
                "columnDefs": [
                    { "targets": 0, "width": "0%", "visible": false, "orderable": false }, //各別data
                    { "targets": 1, "width": "3%", "className": "text-center align-middle checkPlus", "orderable": false },//+號
                    { "targets": 2, "className": "text-center align-middle" },//建立日期
                    { "targets": 3, "className": "text-center align-middle" },//案件編號
                    { "targets": 4, "className": "text-center align-middle" },//戶名
                    { "targets": 5, "className": "text-center align-middle" },//ID
                    { "targets": 6, "className": "text-center align-middle" },//風險項目
                    { "targets": 7, "width": "5%", "className": "text-center align-middle" },//分行別
                    { "targets": 8, "className": "text-center align-middle" },//業務別
                    { "targets": 9, "className": "text-center align-middle" },//案件狀態
                ],
            }

            let dataTable = $('#resualtTable').DataTable(opt);
            $.each(list, function (item, obj) {
                //+號
                let addBtn = '<img class="mw-10" src="jpg/details_open.png">';//+號
                //案件編號
                let caseNo = `<a href="javascript: void(0)" onclick="openEsgTCFDSearchCaseWeb(this)">${obj.caseno} </a>`;

                dataTable.row.add([
                    obj,
                    addBtn,//+號
                    obj.createDate,//建立日期
                    caseNo,//案件編號
                    obj.idName,//戶名
                    obj.id,//ID
                    obj.DB02_1_O2,//風險項目
                    obj.cbranch,//分行別
                    obj.business,//業務別
                    obj.status,//案件狀態
                ])
            });
            dataTable.draw();
            //table初始化
            changWindowWdthHandler();
            changTdSortSymbolHandler();
            //下次變更視窗時更改的動作
            $(document).ready(function () {
                $(window).resize(function () {
                    changWindowWdthHandler();
                    changTdSortSymbolHandler();
                });
            });

            $('#resualtTable').css('border', '1px solid #dee2e6').css('width', '');
            $('#resualtTable').find('thead th').addClass('align-middle');
            $('#resualtTable thead th').addClass('tableSort-top');
            $(".col-sm-12").addClass('my-1');
            $(".dataTables_info").addClass('pt-2');
            return dataTable;
        }
    }
}

//查詢案件-案件編號
async function openEsgTCFDSearchCaseWeb(obj, caseData){
    loadingShow("開啟案件中");
    let userObj = getUidToken();
    let uid = userObj.uid;
    let token = userObj.token;
    let data = {}
    
    if(obj == ""){ //預覽
        data.caseno = caseData || "";
    }else{ //查詢
        let table = $(obj).closest("table").DataTable();
        let tr = $(obj).closest('tr');
        data.caseno = table.row(tr).data()[0].caseno || "";
    }

    // if(obj != ""){ //查詢
        //超連結鎖定
        $(obj).closest(".tab-content").find("a").css({
            "pointer-events": "none",
            "color": "grey",
        });
        
        $("#searchANS").attr("opid", data.caseno);
        $(obj).closest("table").find("tr").removeClass('table-warning');
        $("#frontBody").empty();
        $("#frontHeader").empty();
    // }
    
    let jsonData = "";
    jsonData = await apiS140020004(uid, token, data);
    let allJsonData = []; //收集所有 jsonData 資料

    if(jsonData.rc == "M0000"){
        if(obj != ""){ //查詢
            let tr = $(obj).closest('tr');
            tr.addClass('table-warning');
        }
        let urlHtml = ajaxhttpIPHostHtml('/esg/esg_build_ClimateCheckList.html');
        const html = await $.ajax(urlHtml);
        let $html = $(html);
        $html.find('#allEsgBuildCase .titleTCFD').text('TCFD案件');
        $html.find('#allShowClimateDiv').find('#showClimateDiv').find('textarea, select').prop('disabled', true);
        // 選擇檔案、夾檔 btn 變 disabled 的設定
        $html.find('#allShowClimateDiv').find("label.btn-sm.my-0 input").prop("disabled", true);
        $html.find('#allShowClimateDiv').find("label.btn-sm.my-0").css('cursor', 'default');
        $html.find('#allShowClimateDiv').find("label.btn-sm.my-0").css('opacity', '0.65');
        $("#frontBody").empty().append($html.html());
        $("section>.container-fluid").append($html.html());
        
        $('.getTime').val(jsonData.result.createDate); //日期
        $('.branch').val(jsonData.result.cbranch); //分行別
        //business
        let business = jsonData.result.business
        let $opt = `<option value="10">消金(分行)</option>
                    <option value="11">消金(中心)</option>
                    <option value="20">理貸(分行)</option>
                    <option value="21">理貸(中心)</option>
                    <option value="30">車貸</option>
                    <option value="40">企金</option>
                    <option value="41">票金</option>`
        $(".business").append($opt);
        $(".business").val(business);
        $('#esgBuildCaseDiv .business').prop('disabled', true);
        
        $('.accBuildID').val(jsonData.result.id); //ID
        $('.accBuildID').prop('disabled', true);
        $('.btnNameDisabled').prop('disabled', true); //帶入戶名
        $('.accName').val(jsonData.result.idName); //企業名稱
        $('#esgBuildCaseDiv .accName').prop('disabled', true);
        $('.confirmBtnTCFD').addClass('hide'); //確認
        $('.caseClimateId').val(data.caseno); //編號
        $('.uploadDirection').val(jsonData.result.uploadDirection); //上傳說明
        $('#sendBtnOPDiv').addClass('hide');
        
        // 儲存filejson
        allJsonData.push(jsonData);
        
        //夾檔文字說明
        if(jsonData.result.fileCheckFlag == "1"){
            $('.uploadResultTrue').removeClass('hide');
            $('.promptText').addClass('hide');
        }else if(jsonData.result.fileCheckFlag == "0"){
            $('.uploadResultFalse').removeClass('hide');
            $('.promptText').removeClass('hide');
        }else{
            $('.uploadResultTrue').addClass('hide');
            $('.uploadResultFalse').addClass('hide');
            $('.promptText').addClass('hide');
        }

        let caseno = $('.caseClimateId').val();
        //上傳列表
        await apiOpS000040010(uid, token, caseno, "").done(function (jsondata) {
            $('#msg_token').text(jsondata.token);
            if (jsondata.rc == "M0000") {
                let $tableDiv = $('.uploadfileDiv');
                const $options = $('.uploadfileSelectDiv .uploadfileSelect').find('select option');
                let selList = $options.map(function (item, option) {
                    return $(option).text().trim();
                }).get();
                let endResult = jsondata.result.filter(function (item, index, array) {
                    return selList.indexOf(item.file_type.trim()) > -1;
                });
                const table = '<table class="uploadfileTable table table-bordered table-hover text-center" style="table-layout:fixed;"></table>';
                const thead = '<thead>' +
                    '<th>筆數</th>' +
                    '<th>選項</th>' +
                    '<th>檔案</th>' +
                    '<th>夾檔人員</th>' +
                    '<th>夾檔時間</th>' +
                    '<th>案件操作</th></thead>';
                const tbody = '<tbody></tbody>';
                $tableDiv.empty().append(table);
                $tableDiv.find('table').append(thead).append(tbody);
                $.each(endResult, function (item, result) {
                    let parseResText = allJsonData[0].result.fileCheckFlag === "1" ?  "解析成功" : "解析失敗"
                    let riskText = allJsonData[0].result.DB02_1_O2;
                    let tr = '<tr>' +
                        '<td>uf_no</td>'.replace('uf_no', result.uf_no) +
                        '<td title="tDemo">file_type</td>'.replace('file_type', result.file_type).replace('tDemo', result.uf_no) +
                        '<td>filename_ori</td>'.replace('filename_ori', result.filename_ori) +
                        '<td>uf_uid</td>'.replace('uf_uid', result.uf_uid) +
                        '<td>uf_date</td>'.replace('uf_date', result.uf_date) +
                        '<td>' +
                        '<label class="cursor"><input type="button" class="hide" onclick="viewFile(this)"><i class="fas fa-file px-2"></i></label>' +
                        `<label>${parseResText}</label>`+
                        '<br/>'+`<label class="text-danger">${riskText}</label>`+
                        '</td></tr>';
                    $tableDiv.find('tbody').append(tr);
                });
                let opt = {
                    "searching": false,//取消搜尋欄位
                    "bAutoWidth": true, //自適應寬度
                    "bRetrieve": true,
                    "bStateSave": false,
                    "scrollCollapse": true,
                    "autowidth": false,
                    "language": {
                        search: "搜尋表格:",
                        info: "顯示第 _START_ 至 _END_ 筆結果，共 _TOTAL_ 筆",
                        infoFiltered: "",
                        infoEmpty: "無相關資料",
                        zeroRecords: "沒有符合的資料",
                        lengthMenu: "顯示 _MENU_ 筆",
                        paginate: {
                            "first": "第一頁",
                            "previous": "上一頁",
                            "next": "下一頁",
                            "last": "最後一頁"
                        },
                    },
                    "columnDefs": [
                        { "targets": 0, "width": "8.5%", "visible": false, "orderable": false },
                        { "targets": 1, "width": "8.5%" },
                        { "targets": 2, "width": "8.5%" },
                        { "targets": 3, "width": "8.5%" },
                        { "targets": 4, "width": "12%" },
                        { "targets": 5, "width": "8%", "orderable": false },
                    ],
                    "order": [1, 'asc']
                };

                let dataTable = $('.uploadfileTable').DataTable(opt);
                $('.uploadfileTable').css('border', '1px solid #dee2e6').css('width', '');
                $('.uploadfileTable').find('thead th').addClass('align-middle');
                $('.uploadfileTable thead th').addClass('tableSort-top');
                $('.uploadfileTable').closest('.container-fluid').addClass('px-0');
                $(".col-sm-12").addClass('my-1');
                $(".dataTables_info").addClass('pt-2');

                let i = 0;
                $.each(endResult, function (item, result) {
                    dataTable.row(i).data()[0] = result;
                    i++;
                });
            } else {
                apiErrorHandler(jsondata);
            }
        });
        
        if(obj != ""){ //查詢
            // 取得目標區塊的y座標 //滑到該位置
            try {
                let target_top = $("#allEsgBuildCase").offset().top;
                window.scrollTo({
                    top: target_top,
                    behavior: "smooth"
                });
            } catch (e) { console.error(e) };
        }
        
        loadingHide();
    }else{
        apiErrorHandler(response);
        loadingHide();
    }
    //超連結解除
    $(obj).closest(".tab-content").find("a").css({
        "pointer-events": "auto",
        "color": "#007bff",
    });
}

//撤件
async function btnBackTCFD(obj) {
    if (!confirm("是否要撤件？")) { return; }
    loadingShow("撤件中");
    let userObj = getUidToken();
    let uid = userObj.uid;
    let token = userObj.token;
    let caseNo = $('.caseClimateId').val() || "";
    let data = {};
    data.caseno = caseNo
    await apiS140020006(uid, token, data).done(function (json){
        if (json.rc == "M0000") {
            alert(json.msg);
            $("section").text("");
            $(".breadcrumb").text("");
            loadingHide();
        }else{
            apiErrorHandler(json);
            loadingHide();
        }
    })
}

//暫存
async function btnStoreTCFD(obj) {
    loadingShow("資料處理中");
    let userObj = getUidToken();
    let uid = userObj.uid;
    let token = userObj.token;
    let data = {};
    let caseNo = $('.caseClimateId').val() || "";
    let uploadDirection = $('.uploadDirection').val() || "";
    data.caseno = caseNo;
    data.uploadDirection = uploadDirection;
    await apiS140020003(uid, token, data).done(function (json){
        if(json.rc == "M0000"){
            alert(json.msg);
            loadingHide();
        }else{
            apiErrorHandler(json);
            loadingHide();
        }
    })
}

//完成
async function btnFinishTCFD(obj) {
    loadingShow("資料處理中");
    try{
        let userObj = getUidToken();
        let uid = userObj.uid;
        let token = userObj.token;
        let data = {};
        let caseNo = $('.caseClimateId').val() || "";
        data.caseno = caseNo;

        let dataStore = {}
        let uploadDirection = $('.uploadDirection').val() || "";
        dataStore.caseno = caseNo;
        dataStore.uploadDirection = uploadDirection

        // 先打'暫存'API，再打'完成'API
        let jsonFinish = await apiS140020005(uid, token, data);
        await apiS140020003(uid, token, dataStore).done(function (json){
            if(json.rc == "M0000"){
                if(jsonFinish.rc == "M0000"){
                    $("section").text("");
                    $(".breadcrumb").text("");
                    alert(jsonFinish.msg);
                    loadingHide();
                }else{
                    apiErrorHandler(jsonFinish);
                    loadingHide();
                }
            }else{
                apiErrorHandler(json);
                loadingHide();
            }
        })
    }catch (e) {
        console.error(e);
    }
}

//待辦-TCFD案件編號
async function openEsgTCFDCaseWeb(obj) {
    loadingShow("開啟案件中");
    let userObj = getUidToken();
    let uid = userObj.uid;
    let token = userObj.token;
    let table = $(obj).closest("table").DataTable();
    let tr = $(obj).closest('tr');
    let data = {}
    data.caseno = table.row(tr).data()[0].caseno || "";
    //超連結鎖定
    $(obj).closest(".tab-content").find("a").css({
        "pointer-events": "none",
        "color": "grey",
    });

    $("#searchANS").attr("opid", data.caseno);
    $(obj).closest("table").find("tr").removeClass('table-warning');
    $("#frontBody").empty();
    $("#frontHeader").empty();

    let jsonData = "";
    jsonData = await apiS140020004(uid, token, data);
    let allJsonData = []; //收集所有 jsonData 資料

    if(jsonData.rc == "M0000"){
        tr.addClass('table-warning');
        let urlHtml = ajaxhttpIPHostHtml('/esg/esg_build_ClimateCheckList.html');
        const html = await $.ajax(urlHtml);
        let $html = $(html);
        $html.find('#allEsgBuildCase .titleTCFD').text('TCFD案件');
        $("#frontBody").empty().append($html.html());
        $('.getTime').val(jsonData.result.createDate); //日期
        $('.branch').val(jsonData.result.cbranch); //分行別

        let business = jsonData.result.business
        let $opt = `<option value="10">消金(分行)</option>
                    <option value="11">消金(中心)</option>
                    <option value="20">理貸(分行)</option>
                    <option value="21">理貸(中心)</option>
                    <option value="30">車貸</option>
                    <option value="40">企金</option>
                    <option value="41">票金</option>`
        $(".business").append($opt);
        $(".business").val(business);
        $('.business').prop('disabled', true);

        $('.accBuildID').val(jsonData.result.id); //ID
        $('.accBuildID').prop('disabled', true);
        $('.btnNameDisabled').prop('disabled', true); //帶入戶名
        $('.accName').val(jsonData.result.idName); //企業名稱
        $('.accName').prop('disabled', true);
        $('.confirmBtnTCFD').addClass('hide'); //確認
        $('.caseClimateId').val(data.caseno); //編號
        $('.uploadDirection').val(jsonData.result.uploadDirection); //上傳說明
        
        // 儲存filejson
        allJsonData.push(jsonData);

        let fileCheckFlagVal = jsonData.result.fileCheckFlag
        let fileCheck_Info = jsonData.result.fileCheckInfo
        $(".uploadResultDiv").find("#uploadResult_Failed").attr("fileCheckInfo", fileCheck_Info);
        $(".uploadResultDiv").find("#uploadResult_Failed").attr("fileCheckFlag", fileCheckFlagVal);

        //夾檔文字說明
        if(jsonData.result.fileCheckFlag == "1"){
            $('.uploadResultTrue').removeClass('hide');
            $('.promptText').addClass('hide');
        }else if(jsonData.result.fileCheckFlag == "0"){
            $('.uploadResultFalse').removeClass('hide');
            $('.promptText').removeClass('hide');
        }else{
            $('.uploadResultTrue').addClass('hide');
            $('.uploadResultFalse').addClass('hide');
            $('.promptText').addClass('hide');
        }
        
        let caseno = $('.caseClimateId').val();
        //上傳列表
        await apiOpS000040010(uid, token, caseno, "").done(function (jsondata) {
            $('#msg_token').text(jsondata.token);
            if (jsondata.rc == "M0000") {
                let $tableDiv = $('.uploadfileDiv');
                const $options = $('.uploadfileSelectDiv .uploadfileSelect').find('select option');
                let selList = $options.map(function (item, option) {
                    return $(option).text().trim();
                }).get();
                let endResult = jsondata.result.filter(function (item, index, array) {
                    return selList.indexOf(item.file_type.trim()) > -1;
                });
                const table = '<table class="uploadfileTable table table-bordered table-hover text-center" style="table-layout:fixed;"></table>';
                const thead = '<thead>' +
                    '<th>筆數</th>' +
                    '<th>選項</th>' +
                    '<th>檔案</th>' +
                    '<th>夾檔人員</th>' +
                    '<th>夾檔時間</th>' +
                    '<th>案件操作</th></thead>';
                const tbody = '<tbody></tbody>';
                $tableDiv.empty().append(table);
                $tableDiv.find('table').append(thead).append(tbody);
                $.each(endResult, function (item, result) {
                    let parseResText = allJsonData[0].result.fileCheckFlag === "1" ?  "解析成功" : "解析失敗"
                    let riskText = allJsonData[0].result.DB02_1_O2;
                    let tr = '<tr>' +
                        '<td>uf_no</td>'.replace('uf_no', result.uf_no) +
                        '<td title="tDemo">file_type</td>'.replace('file_type', result.file_type).replace('tDemo', result.uf_no) +
                        '<td>filename_ori</td>'.replace('filename_ori', result.filename_ori) +
                        '<td>uf_uid</td>'.replace('uf_uid', result.uf_uid) +
                        '<td>uf_date</td>'.replace('uf_date', result.uf_date) +
                        '<td>' +
                        '<label class="cursor"><input type="button" class="hide" onclick="viewFile(this)"><i class="fas fa-file px-2"></i></label>' +
                        `<label>${parseResText}</label>`+
                        '<br/>'+`<label class="text-danger">${riskText}</label>`+
                        '</td></tr>';
                    $tableDiv.find('tbody').append(tr);
                });
                let opt = {
                    "searching": false,//取消搜尋欄位
                    "bAutoWidth": true, //自適應寬度
                    "bRetrieve": true,
                    "bStateSave": false,
                    "scrollCollapse": true,
                    "autowidth": false,
                    "language": {
                        search: "搜尋表格:",
                        info: "顯示第 _START_ 至 _END_ 筆結果，共 _TOTAL_ 筆",
                        infoFiltered: "",
                        infoEmpty: "無相關資料",
                        zeroRecords: "沒有符合的資料",
                        lengthMenu: "顯示 _MENU_ 筆",
                        paginate: {
                            "first": "第一頁",
                            "previous": "上一頁",
                            "next": "下一頁",
                            "last": "最後一頁"
                        },
                    },
                    "columnDefs": [
                        { "targets": 0, "width": "8.5%", "visible": false, "orderable": false },
                        { "targets": 1, "width": "8.5%" },
                        { "targets": 2, "width": "8.5%" },
                        { "targets": 3, "width": "8.5%" },
                        { "targets": 4, "width": "12%" },
                        { "targets": 5, "width": "8%", "orderable": false },
                    ],
                    "order": [1, 'asc']
                };

                let dataTable = $('.uploadfileTable').DataTable(opt);
                $('.uploadfileTable').css('border', '1px solid #dee2e6').css('width', '');
                $('.uploadfileTable').find('thead th').addClass('align-middle');
                $('.uploadfileTable thead th').addClass('tableSort-top');
                $('.uploadfileTable').closest('.container-fluid').addClass('px-0');
                $(".col-sm-12").addClass('my-1');
                $(".dataTables_info").addClass('pt-2');

                let i = 0;
                $.each(endResult, function (item, result) {
                    dataTable.row(i).data()[0] = result;
                    i++;
                });
            } else {
                apiErrorHandler(jsondata);
            }
        });
        // 取得目標區塊的y座標 //滑到該位置
        try {
            let target_top = $("#allShowClimateDiv").offset().top;
            window.scrollTo({
                top: target_top,
                behavior: "smooth"
            });
        } catch (e) { console.error(e) };
        loadingHide();
    }else{
        apiErrorHandler(response);
        loadingHide();
    }
    //超連結解除
    $(obj).closest(".tab-content").find("a").css({
        "pointer-events": "auto",
        "color": "#007bff",
    });
}

//檔案上傳 (TCFD上傳)
function uploadFileTCFD(obj) {
    let $modal = $("#loadingOpView");
    $modal.find('button').prop('disabled', true);
    let userObj = getUidToken();
    let uid = userObj.uid;
    let token = userObj.token;
    let caseno = $('.caseClimateId').val() || ""; 
    let uploadfileStatus = true;
    if (caseno == undefined || caseno == "") { alert("未有案件編號，請先存檔後進行上傳。"); uploadfileStatus = false; return; }
    let $fileDiv = $(obj).closest('.form-inline.mt-2');
    let filetype = $fileDiv.find('select').val(); //氣候風險檢核表為300
    let $file = $fileDiv.find('input');
    let fileLength = $file[0].files.length;
    let files = $file[0].files;
    let cfid = "";
    $.each(files, function (item, file) {//阻擋20MB以上的檔案上傳 

        //抓取上傳檔案副檔名
        let fileNameNo = file.name.split(".")[file.name.split(".").length - 1];

        if (file.name.split(".").length > 0) {//判斷有沒有符合副檔名
            let acceptArr = $file.attr('accept').split(",");

            //沒有符合檔案類型
            if (acceptArr.indexOf("." + fileNameNo) < 0) {
                alert(file.name + "，副檔名不符合規定。");
                uploadfileStatus = false;
                return;
            }
        }
        if (file.size >= (20 * 1024 * 1024)) {
            alert(file.name + "，檔案大小超過20MB。");
            uploadfileStatus = false;
            return;
        }
    });
    if (fileLength == 0) {
        alert("未選擇檔案");
        uploadfileStatus = false; return;
    }else if(fileLength > 1){
        alert("只能選擇1個檔案");
        uploadfileStatus = false; return;
    }

    if (!uploadfileStatus) { return; }//不是true，就結束
    //畫面清除    
    const tr = '<tr>' +
        '<td class="px-4">' +
        '<p class="mt-1 mb-1 name">fileName</p>' +
        '<strong class="mt-2 msg"></strong>' +
        '</td>' +
        '<td class="px-4">' +
        '<p class="mt-1 mb-1 size">fileSize</p>' +
        '<div class="mt-2 progress">' +
        '<div class="progress-bar progress-bar-info progress-bar-striped" role="progressbar"' +
        'aria-valuenow="0" aria-valuemin="70" aria-valuemax="100" style="width: 0%;">' +
        '<span class="font-weight-bold percentVal">0%</span>' +
        '</div>' +
        '</div>' +
        '</td>' +
        '</tr>';
    $modal.find('tbody').empty();

    //畫面加載
    for (let i = 0; i < fileLength; i++) {
        $modal.find('tbody').append(tr.replace('fileName', files[i].name).replace('fileSize', files[i].size >= 1024 * 1024 ? parseFloat(files[i].size / (1024 * 1024)) + ' MB' : parseFloat(files[i].size / 1024) + ' KB'));
    }
    
    //顯示畫面
    $("#loadingOpView").modal('show');
    //資料包裝並上傳
    let chan = new $.Deferred().resolve();
    let allFileJson = []; //收集所有 filejson 資料

    for (let i = 0; i < fileLength; i++) {
        let fileData = new FormData();
        fileData.append("token", token);
        fileData.append("uid", uid);
        // fileData.append("cfid", "");
        fileData.append("caseno", caseno);
        fileData.append("filetype", filetype);
        fileData.append('uploadfile', files[i]);
        let s140020009 = getS140020009(fileData, i, "loadingOpView");

        chan = chan.pipe(function () {
            return $.ajax(s140020009).pipe(
                //doneFilter, 形同ajax success事件，但要傳回Promise物件
                function (filejson) {
                    $('#msg_token').text(filejson.token);
                    // 傳回reject的Deferred物件可中斷pipe()執行
                    
                    // 儲存filejson
                    allFileJson.push(filejson);
                    
                    if (filejson.rc != "M0401") {
                        let $modal = $("#loadingOpView").find('tbody tr:nth(' + i + ')');
                        let $bar = $modal.find('.progress-bar');
                        let $percent = $modal.find('.percentVal');
                        let $msg = $modal.find('.msg');
                        let percentVal = '0%';
                        $bar.width(percentVal);
                        $percent.html(percentVal);
                        $msg.addClass('text-danger').html('錯誤訊息：' + filejson.msg);
                        return $.Deferred().resolve();
                    }
                    let $modal = $("#loadingOpView").find('tbody tr:nth(' + i + ')');
                    let $msg = $modal.find('.msg');
                    $msg.addClass('text-success').html('夾檔成功');
                    // 傳回resolve的Deferred物件繼續pipe()
                    return $.Deferred().resolve();
                }
                //server error, 形同ajax error事件，但要傳回Promise物件
                , function (jqXHR, textStatus, errorThrown) {
                    let $modal = $("#loadingOpView").find('tbody tr:nth(' + i + ')');
                    let $bar = $modal.find('.progress-bar');
                    let $percent = $modal.find('.percentVal');
                    let $msg = $modal.find('.msg');
                    let percentVal = '0%';
                    $bar.width(percentVal);
                    $percent.html(percentVal);
                    $msg.addClass('text-danger').html('伺服器發生錯誤，上傳失敗' + errorThrown);
                    return $.Deferred().resolve();
                });
        }); 
    }
    
    chan.pipe(function () {
        //清單更新
        $file.val('').change();//清空input欄位資料
        apiOpS000040010(uid, token, caseno, "").done(function (jsondata) {
            $('#msg_token').text(jsondata.token);
            if (jsondata.rc == "M0000") {
                let fileCheckFlagVal = allFileJson[0].result.fileCheckFlag
                let fileCheck_Info = allFileJson[0].result.fileCheckInfo
                $(".uploadResultDiv").find("#uploadResult_Failed").attr("fileCheckInfo", fileCheck_Info);
                $(".uploadResultDiv").find("#uploadResult_Failed").attr("fileCheckFlag", fileCheckFlagVal);

                let $tableDiv = $('.uploadfileDiv');
                const $options = $('.uploadfileSelectDiv .uploadfileSelect').find('select option');
                let selList = $options.map(function (item, option) {
                    return $(option).text().trim();
                }).get();

                let endResult = jsondata.result.filter(function (item, index, array) {
                    return selList.indexOf(item.file_type.trim()) > -1;
                });

                const table = '<table class="uploadfileTable table table-bordered table-hover text-center" style="table-layout:fixed;"></table>';
                const thead = '<thead>' +
                    '<th>筆數</th>' +
                    '<th>選項</th>' +
                    '<th>檔案</th>' +
                    '<th>夾檔人員</th>' +
                    '<th>夾檔時間</th>' +
                    '<th>案件操作</th></thead>';
                const tbody = '<tbody></tbody>';
                $tableDiv.empty().append(table);
                $tableDiv.find('table').append(thead).append(tbody);
                $.each(endResult, function (item, result) {
                    let parseResText = allFileJson[0].result.fileCheckFlag === "1" ?  "解析成功" : "解析失敗"
                    let riskText = allFileJson[0].result.DB02_1_O2
                    // 錯誤訊息
                    let fileCheck_Info = allFileJson[0].result.fileCheckInfo
                    let errorText = "";
                    $.each(fileCheck_Info, function (item) {
                        errorText += `${fileCheck_Info[item]}\n`;
                    });
                    
                    let fileCheck_Flag = allFileJson[0].result.fileCheckFlag
                    if(fileCheck_Flag == "1"){ //檔案解析成功時
                        $('.uploadResultTrue').removeClass('hide');
                        $('.uploadResultFalse').addClass('hide');
                        $('.promptText').addClass('hide');
                    }else{
                        $('.uploadResultTrue').addClass('hide');
                        $('.uploadResultFalse').removeClass('hide');
                        $('.promptText').removeClass('hide');
                        alert(errorText);
                    }

                    let tr = '<tr>' +
                        '<td>uf_no</td>'.replace('uf_no', result.uf_no) +
                        '<td title="tDemo">file_type</td>'.replace('file_type', result.file_type).replace('tDemo', result.uf_no) +
                        '<td>filename_ori</td>'.replace('filename_ori', result.filename_ori) +
                        '<td>uf_uid</td>'.replace('uf_uid', result.uf_uid) +
                        '<td>uf_date</td>'.replace('uf_date', result.uf_date) +
                        '<td>' +
                        '<label class="cursor"><input type="button" class="hide" onclick="viewFile(this)"><i class="fas fa-file px-2"></i></label>' +
                        `<label>${parseResText}</label>`+
                        '<br/>'+`<label class="text-danger">${riskText}</label>`+
                        '</td></tr>';
                    $tableDiv.find('tbody').append(tr);
                });

                let opt = {
                    "searching": false,//取消搜尋欄位
                    "bAutoWidth": true, //自適應寬度
                    "bRetrieve": true,
                    "bStateSave": false,
                    "scrollCollapse": true,
                    "autowidth": false,
                    "language": {
                        search: "搜尋表格:",
                        info: "顯示第 _START_ 至 _END_ 筆結果，共 _TOTAL_ 筆",
                        infoFiltered: "",
                        infoEmpty: "無相關資料",
                        zeroRecords: "沒有符合的資料",
                        lengthMenu: "顯示 _MENU_ 筆",
                        paginate: {
                            "first": "第一頁",
                            "previous": "上一頁",
                            "next": "下一頁",
                            "last": "最後一頁"
                        },
                    },
                    "columnDefs": [
                        { "targets": 0, "width": "8.5%", "visible": false, "orderable": false },
                        { "targets": 1, "width": "8.5%" },
                        { "targets": 2, "width": "8.5%" },
                        { "targets": 3, "width": "8.5%" },
                        { "targets": 4, "width": "12%" },
                        { "targets": 5, "width": "8%", "orderable": false },
                    ],
                    "order": [1, 'asc']
                };

                //更新table
                let dataTable = $('.uploadfileTable').DataTable(opt);
                $('.uploadfileTable').css('border', '1px solid #dee2e6').css('width', '');
                $('.uploadfileTable').find('thead th').addClass('align-middle');
                $('.uploadfileTable thead th').addClass('tableSort-top');
                $('.uploadfileTable').closest('.container-fluid').addClass('px-0');
                $(obj).closest('.card-body').find(".col-sm-12").addClass('my-1');
                $(obj).closest('.card-body').find(".dataTables_info").addClass('pt-2');

                let i = 0;
                $.each(endResult, function (item, result) { 
                    dataTable.row(i).data()[0] = result;
                    i++;
                });
            } else {
                apiErrorHandler(jsondata);
            }
        });
        $modal.find('button').prop('disabled', false);
    });
}

//TCFD上傳結果失敗訊息提示
function uploadResultFailedTCFD(obj){
    let fileCheckInfo = $("#uploadResult_Failed").attr("fileCheckInfo");
    let errorArr = fileCheckInfo.split(',');
    let errorText = "";

    $.each(errorArr, function (item) {
        errorText += `${errorArr[item]}\n`;
    });

    alert(errorText);
    return;
}

//批覆作業-連結TCFD氣候風險檢核表
async function addDataTCFD(obj) {
    const $btn = $(obj);
    const userObj = getUidToken();
    const uid = userObj.uid;
    const token = userObj.token;
    let $modal = "";
    let html = "";
    try {
        const res = await Promise.all(
            [
                apiS140020011(uid, token),
                $.get(ajaxhttpIPHostHtml("/acceptcase/creditCheckReport/page/component/queryCreditCheckDataModal.html"))
            ]);
        jsonData = res[0];
        html = res[1];
    } catch (e) { console.error(e) }
    if (html && jsonData && jsonData.rc && jsonData.rc == "M0000") {
        $modal = $(html);
        $modal.find(".modal-title").text("連結氣候風險檢核表");
        const $table = document.createElement('table');
        const listData = jsonData.result;
        let columnDefs = [
            { title: "完成日期", data: "completionDate" },
            {
                title: "動作", data: "caseno", render: (data, type, row) => {
                    return `<button class="btn btn-sm btn-primary" id="linkHostTranCo" onclick="linkToCaseTCFD(this)">連結此案</button>`
                }
            },
            { title: "分行", data: "cbranch", width: "10%"},
            { title: "建立者", data: "cuser"},
            {
                title: "預覽", data: "caseno", render: (data, type, row) => {
                    return `<a href="javascript:void(0)" onclick="openWindowTCFD(this)">${data}</a>`
                }
            },
            { title: "風險項目", data: "DB02_1_O2", visible: false }
        ];
        $table.className = 'table table-bordered table-hover dataTable no-footer';
        $table.style = 'table-layout: fixed; border: 1px solid rgb(222, 226, 230);overflow-wrap: break-word';
        columnDefs = columnDefs.map(function (data, idx) {
            data.targets = idx
            data.class = "text-center align-middle"
            return data
        })
        $($table).DataTable({
            "bAutoWidth": false, //自動適應寬度
            "bRetrieve": true,
            "bStateSave": false,
            "scrollCollapse": true,
            "autowidth": false,
            "language": {
                search: "搜尋表格:",
                info: "顯示第 _START_ 至 _END_ 筆結果，共 _TOTAL_ 筆",
                infoFiltered: "",
                infoEmpty: "無相關資料",
                zeroRecords: "沒有符合的資料",
                lengthMenu: "顯示 _MENU_ 筆",
                paginate: {
                    "first": "第一頁",
                    "previous": "上一頁",
                    "next": "下一頁",
                    "last": "最後一頁"
                },
            },
            aLengthMenu: [5, 10, 25, 50],
            pageLength: 5,
            "columnDefs": columnDefs,
            "data": listData,
            "order": [0, 'desc']
        });
        $modal.find(".modal-body").append($($table).closest(".dataTables_wrapper"));
        $modal.modal("show");
    }
}

//批覆作業-TCFD-dataTable 連結此案btn
async function linkToCaseTCFD(obj) {
    const table = $(obj).closest("table").DataTable();
    const tr = $(obj).closest('tr');
    const rowData = table.row(tr).data();
    const $target = $('#climateRiskDiv');
    $target.find(".climateNo").val(rowData.caseno);
    $target.find(".climate-data-unit").removeClass("hide");
    $target.find(".add-climate-btn").addClass("hide");
    const $modal = $(obj).closest(".modal");
    $modal.modal("hide");

    let linkWordTCFD = `<p class="completionDate">完成日期: ${rowData.completionDate}</p>
            <p class="DB02_1_O2">風險項目: ${rowData.DB02_1_O2}</p>`
    $target.find('.linkWordTCFD').append(linkWordTCFD);
}

//批覆作業-連結TCFD-預覽
function openWindowTCFD(obj) { 
    $(obj).prop("disabled", true);
    //超連結鎖定
    $(obj).closest("table").find("a").css({
        "pointer-events": "none",
        "color": "grey",
    });
    let caseData = {};
    let tcfdLink = $(obj).text() || "";
    let tcfdNo = $(obj).closest(`#linkTCFD`).find(`.tcfdno`).val() || "";

    if (caseData = tcfdNo) {
        caseData = tcfdNo;
    } else{
        caseData = tcfdLink;
    }

    const userObj = getUidToken();
    const sendData = {
        caseData: caseData,
        userObj: userObj
    };

    sessionStorage.setItem("openHostData", JSON.stringify(sendData));

    setTimeout(() => {
        window.open("esg/page/oldCaseTCFD.html", undefined, "menubar=no");
        $(obj).prop("disabled", false);
        //超連結解除
        $(obj).closest("table").find("a").css({
            "pointer-events": "auto",
            "color": "#007bff",
        });
    }, 500)
}

//批覆作業-TCFD-刪除
function deleteToCaseTCFD(obj) {
    if (confirm("是否刪除?")) {
        const $target = $('#climateRiskDiv')
        $target.find('.linkWordTCFD')
        $target.find(".add-climate-btn").removeClass("hide");
        $target.find(".climate-data-unit").addClass("hide");
        $target.find(".tcfdno").val("");
        $target.find('.linkWordTCFD .completionDate').remove();
        $target.find('.linkWordTCFD .DB02_1_O2').remove();
    }
}

//企金、票金-判斷行業別4碼是否為高碳排行業
async function jobL4Blur(target){
    loadingShow("資料處理中");
    let userObj = getUidToken();
    let uid = userObj.uid;
    let token = userObj.token;
    let data = {};
    data.appNumber = $(target).closest('#firstBody').find('#acceptCase .appNumber').val() || ""; //案件編號
    data.highCarbon = $(target).val() || ""; //行業別4碼

    await apiS140020010(uid, token, data).done(function (json) { 
        if(json.rc == "M0000"){
            if(json.result.showTcfd == "0"){ //不顯示
                $(target).closest('#firstBody').find('#climateRisk').addClass('hide');
            }else if(json.result.showTcfd == "1"){ //顯示
                $(target).closest('#firstBody').find('#climateRisk').removeClass('hide');
            }
            loadingHide();
        }else{
            loadingHide();
        }
    })
}
