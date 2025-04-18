// 傳送作業中心-是否勾選 '聯徵複查表無法產出'
function touchUnPro(obj) { 
    let $obj = $(obj)
    if($obj.is(':checked')){  //有勾選 val = 1
        $obj.val("1");

        let workre = $('.tran-re-data-unit .workre').val() || "";
        let unableProduce = $('#unableProduce').val() || "";
        let workco = $('.tran-co-data-unit .workco').val() || "";
        if((workre || unableProduce == "1") && workco){
            //打 S060000014 API
            transBeQuApi();
        }else{
            $('.checkHaveAb').addClass("hide");
            $('#checkRadioY').prop("disabled", true);
            $('#checkRadioN').prop("disabled", true);
            $('#checkRadioY').prop("checked", false);
            $('#checkRadioN').prop("checked", false);
            $('.abnormalText').val("");
            $('#yesNoAbnormal').addClass("hide");
            // 底下 btn 更動 (顯示: 暫存、撤件、傳送)
            $('.F500_001').removeClass('hide'); //暫存 btn
            $('.backFile').removeClass('hide'); //撤件 btn
            $('.opCenterBranchSend').removeClass('hide'); //傳送 btn
            $('.nucleated').addClass('hide'); //呈核 btn
            $('.noLoan').addClass('hide'); //不予撥貸 btn
        }
        $('.add-tran-re-btn').prop('disabled', true);
        $('.remarkUnPrText').removeClass('hide');
    }else{ //沒有勾選
        $obj.val("0");
        
        let workre = $('.tran-re-data-unit .workre').val() || "";
        let unableProduce = $('#unableProduce').val() || "";
        let workco = $('.tran-co-data-unit .workco').val() || "";
        if((workre || unableProduce == "1") && workco){
            //打 S060000014 API
            transBeQuApi();
        }else{
            $('.checkHaveAb').addClass("hide");
            $('#checkRadioY').prop("disabled", true);
            $('#checkRadioN').prop("disabled", true);
            $('#checkRadioY').prop("checked", false);
            $('#checkRadioN').prop("checked", false);
            $('.abnormalText').val("");
            $('#yesNoAbnormal').addClass("hide");
            // 底下 btn 更動 (顯示: 暫存、撤件、傳送)
            $('.F500_001').removeClass('hide'); //暫存 btn
            $('.backFile').removeClass('hide'); //撤件 btn
            $('.opCenterBranchSend').removeClass('hide'); //傳送 btn
            $('.nucleated').addClass('hide'); //呈核 btn
            $('.noLoan').addClass('hide'); //不予撥貸 btn
        }
        $('.add-tran-re-btn').prop('disabled', false);
        $('.remarkUnPrText').addClass('hide');
        $("#checkRadioY").prop("disabled", true);
        $("#checkRadioN").prop("disabled", true);
    }
}


//檔案上傳 (傳送作業中心--撥貸前回查)
function uploadFileOpBe(obj) {
    let caseType = $(".caseType").attr("value") || "";
    let $modal = $("#loadingOpView");
    $modal.find('button').prop('disabled', true);
    let userObj = getUidToken();
    let uid = userObj.uid;
    let token = userObj.token;
    // let cfidArr = $(obj).closest(".card-body").find(".opCenterBranchSend").attr("opid");
    // let caseNoArr = JSON.parse(cfidArr);
    let caseno = "";
    let jcAlLength = 0;
    let jcAlArr = $(".opCenterBranchSend").attr("opid");
    if (caseType == "20") {
        caseno = $(".opCenterBranchSend").attr("opid") || "";
    } else {
        let cfidArr = $(".opCenterBranchSend").attr("opid");
        let caseNoArr = JSON.parse(cfidArr);
        //判斷是否建檔+撥貸
        $.each(caseNoArr, function (i, v) {
            if (v.type == "12" || v.type == "13") {
                jcAlLength++;
            }
        });
        if ($(".sendType").val() == "80") {
            //建檔
            $.each(caseNoArr, function (i, v) {
                if (v.type == "12") {
                    caseno = v.code;
                }
            });
        } else if ($(".sendType").val() == "81") {
            //撥貸
            $.each(caseNoArr, function (i, v) {
                if (v.type == "13") {
                    caseno = v.code;
                }
            });
        } else {
            caseno = caseNoArr[0].code;
        }
    }
    //let caseno = $(obj).closest('.card-body').find('.' + caseClassName).val();  
    let uploadfileStatus = true;
    if (caseno == undefined || caseno == "") { alert("未有案件編號，請先存檔後進行上傳。"); uploadfileStatus = false; return; }
    let $fileDiv = $(obj).closest('.form-inline.my-4');
    let filetype = $fileDiv.find('select').val();
    let $file = $fileDiv.find('input.hide');
    let filetlength = $file[0].files.length;
    let files = $file[0].files;
    let cfid = caseno;
    $.each(files, function (item, file) {//阻擋20MB以上的檔案上傳 

        //抓取上傳檔案副檔名
        let fileNameNo = file.name.split(".")[file.name.split(".").length - 1];
        // console.log('fileNameNo', fileNameNo);

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
    if (filetlength == 0) {
        alert("未選擇檔案");
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
    for (let i = 0; i < filetlength; i++) {
        $modal.find('tbody').append(tr.replace('fileName', files[i].name).replace('fileSize', files[i].size >= 1024 * 1024 ? parseFloat(files[i].size / (1024 * 1024)) + ' MB' : parseFloat(files[i].size / 1024) + ' KB'));
    }
    //顯示畫面
    $("#loadingOpView").modal('show');
    //資料包裝並上傳
    let chan = new $.Deferred().resolve();
    for (let i = 0; i < filetlength; i++) {
        let fileData = new FormData();
        fileData.append("token", token);
        fileData.append("uid", uid);
        fileData.append("cfid", caseno);
        //fileData.append("caseno", "");
        fileData.append("filetype", filetype);
        fileData.append('uploadfile', files[i]);
        let s000040001 = getS000040001(fileData, i, "loadingOpView");

        chan = chan.pipe(function () {
            return $.ajax(s000040001).pipe(
                //doneFilter, 形同ajax success事件，但要傳回Promise物件
                function (filejson) {
                    filejson = JSON.parse(filejson);
                    $('#msg_token').text(filejson.token);
                    // 傳回reject的Deferred物件可中斷pipe()執行
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
                    // //傳回resolve的Deferred物件繼續pipe()
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
        /////////////以下為改寫///////////
        //是否建檔+撥貸 jcAlLength=2
        if (jcAlLength != 2) {
            let s000040010 = getOpS000040010(uid, token, "", cfid);
            $.when($.ajax(s000040010)).done(function (jsondata) {
                $('#msg_token').text(jsondata.token);
                if (jsondata.rc == "M0000") {
                    //let $tableDiv = $(obj).closest('.uploadfileSelectDiv').next('.uploadfileDiv');
                    //指定table
                    let $tableDiv = $('.uploadfileDiv');
                    //const $options = $(obj).closest('.uploadfileSelect').find('select option');
                    //夾檔type
                    const $options = $('.uploadfileSelectDiv .uploadfileSelect').find('select option');
                    let selList = $options.map(function (item, option) {
                        return $(option).text().trim();
                    }).get();
                    //jsondata.result去對夾檔的type
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
                        let tr = '<tr>' +
                            '<td>uf_no</td>'.replace('uf_no', result.uf_no) +
                            '<td title="tDemo">file_type</td>'.replace('file_type', result.file_type).replace('tDemo', result.uf_no) +
                            '<td>filename_ori</td>'.replace('filename_ori', result.filename_ori) +
                            '<td>uf_uid</td>'.replace('uf_uid', result.uf_uid) +
                            '<td>uf_date</td>'.replace('uf_date', result.uf_date) +
                            '<td>' +
                            '<label class="cursor"><input type="button" class="hide" onclick="viewFile(this)"><i class="fas fa-file px-2"></i></label>' +
                            '<label class="cursor"><input type="button" class="hide" onclick="delFile_AC(this)"><i class="fas fa-trash-alt px-2"></i></label>' +
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


                    // let dataTable = $(obj).closest('.card-body').find('.uploadfileTable').DataTable(opt);
                    // $(obj).closest('.card-body').find('.uploadfileTable').css('border', '1px solid #dee2e6').css('width', '');
                    // $(obj).closest('.card-body').find('.uploadfileTable').find('thead th').addClass('align-middle');
                    // $(obj).closest('.card-body').find('.uploadfileTable thead th').addClass('tableSort-top');
                    // $(obj).closest('.card-body').find('.uploadfileTable').closest('.container-fluid').addClass('px-0');
                    // $(obj).closest('.card-body').find(".col-sm-12").addClass('my-1');
                    // $(obj).closest('.card-body').find(".dataTables_info").addClass('pt-2');
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
                        // if (selList.indexOf(result.file_type) < 0) { return; }  
                        dataTable.row(i).data()[0] = result;
                        i++;
                    });
                } else {
                    apiErrorHandler(jsondata);
                }
            });
        } else {
            let jcAlCaseNoArr = JSON.parse(jcAlArr);
            //let s000040010 = getOpS000040010(uid, token, "", cfid);
            let s000040010A = "";
            let s000040010B = "";
            $.each(jcAlCaseNoArr, function (i, v) {
                if (v.type == "12") {
                    s000040010A = getOpS000040010(uid, token, "", v.code);
                }
                if (v.type == "13") {
                    s000040010B = getOpS000040010(uid, token, "", v.code);
                }
            });
            $.when($.ajax(s000040010A), $.ajax(s000040010B)).done(function (jsondataA, jsondataB) {
                $('#msg_token').text(jsondataA[0].token);
                let jsondataAArr = [];
                if (jsondataA[0].rc == "M0000") {
                    jsondataAArr = jsondataA[0].result;
                } else {
                    apiErrorHandler(jsondataA[0]);
                }
                if (jsondataB[0].rc == "M0000") {
                    //console.log("jsondataB:", jsondataB[0]);
                    //let $tableDiv = $(obj).closest('.uploadfileSelectDiv').next('.uploadfileDiv');
                    let $tableDiv = $('.uploadfileDiv');
                    //const $options = $(obj).closest('.uploadfileSelect').find('select option');
                    const $options = $('.uploadfileSelectDiv .uploadfileSelect').find('select option');
                    let selList = $options.map(function (item, option) {
                        return $(option).text().trim();
                    }).get();

                    let endResult = jsondataB[0].result.filter(function (item, index, array) {
                        return selList.indexOf(item.file_type.trim()) > -1;
                    });

                    endResult = endResult.concat(jsondataAArr);
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
                        let tr = '<tr>' +
                            '<td>uf_no</td>'.replace('uf_no', result.uf_no) +
                            '<td title="tDemo">file_type</td>'.replace('file_type', result.file_type).replace('tDemo', result.uf_no) +
                            '<td>filename_ori</td>'.replace('filename_ori', result.filename_ori) +
                            '<td>uf_uid</td>'.replace('uf_uid', result.uf_uid) +
                            '<td>uf_date</td>'.replace('uf_date', result.uf_date) +
                            '<td>' +
                            '<label class="cursor"><input type="button" class="hide" onclick="viewFile(this)"><i class="fas fa-file px-2"></i></label>' +
                            '<label class="cursor"><input type="button" class="hide" onclick="delFile_AC(this)"><i class="fas fa-trash-alt px-2"></i></label>' +
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


                    // let dataTable = $(obj).closest('.card-body').find('.uploadfileTable').DataTable(opt);
                    // $(obj).closest('.card-body').find('.uploadfileTable').css('border', '1px solid #dee2e6').css('width', '');
                    // $(obj).closest('.card-body').find('.uploadfileTable').find('thead th').addClass('align-middle');
                    // $(obj).closest('.card-body').find('.uploadfileTable thead th').addClass('tableSort-top');
                    // $(obj).closest('.card-body').find('.uploadfileTable').closest('.container-fluid').addClass('px-0');
                    // $(obj).closest('.card-body').find(".col-sm-12").addClass('my-1');
                    // $(obj).closest('.card-body').find(".dataTables_info").addClass('pt-2');
                    let dataTable = $('.uploadfileTable').DataTable(opt);
                    $('.uploadfileTable').css('border', '1px solid #dee2e6').css('width', '');
                    $('.uploadfileTable').find('thead th').addClass('align-middle');
                    $('.uploadfileTable thead th').addClass('tableSort-top');
                    $('.uploadfileTable').closest('.container-fluid').addClass('px-0');
                    $(obj).closest('.card-body').find(".col-sm-12").addClass('my-1');
                    $(obj).closest('.card-body').find(".dataTables_info").addClass('pt-2');

                    let i = 0;
                    $.each(endResult, function (item, result) {
                        // if (selList.indexOf(result.file_type) < 0) { return; }  
                        dataTable.row(i).data()[0] = result;
                        i++;
                    });
                } else {
                    apiErrorHandler(jsondataB[0]);
                }
            });
        }
        $modal.find('button').prop('disabled', false);
    });
}


