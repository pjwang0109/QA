//1名下不動產:新增資料-地址選擇    **參考 
function addPersonEstate(obj) {
    let url = ajaxhttpIPHostHtml('/NEW_creditReport/estateAddress.html');
    $.when($.ajax(url)).done(function (html) {
        $('#modalG').remove();
        $('#modalAll').append($(html));
        $('#modalG').modal('show');
    });
    // $(obj).closest('.rel-info-div');

    // 戶籍 //
    console.log("a",$(obj).closest('.rel-info-div').find('.cHomezip').val());
    console.log("a2",$(obj).closest('.rel-info-div').find('select.cHomeCity').val());
    console.log("a3",$(obj).closest('.rel-info-div').find('select.cHomeArea').val());  
    console.log("a4",$(obj).closest('.rel-info-div').find('select.cHomeStreet').val());
    console.log("a5",$(obj).closest('.rel-info-div').find('.cHomeLane').val());
    console.log("a6",$(obj).closest('.rel-info-div').find('.cHomeAly').val());
    console.log("a7",$(obj).closest('.rel-info-div').find('.cHomeNum').val());
    console.log("a8",$(obj).closest('.rel-info-div').find('.cHomeOf').val());
    console.log("a9",$(obj).closest('.rel-info-div').find('.cHomeFlr').val());
    console.log("a10",$(obj).closest('.rel-info-div').find('.cHomeEtc').val());

    // 通訊 //
    // console.log("b",$(obj).closest('.rel-info-div').find('.cMailzip').val());
    // console.log("b2",$(obj).closest('.rel-info-div').find('select.cMailCity').val());
    // console.log("b3",$(obj).closest('.rel-info-div').find('select.cMailArea').val());  
    // console.log("b4",$(obj).closest('.rel-info-div').find('select.cMailStreet').val());
    // console.log("b5",$(obj).closest('.rel-info-div').find('.cMailLane').val());
    // console.log("b6",$(obj).closest('.rel-info-div').find('.cMailAly').val());
    // console.log("b7",$(obj).closest('.rel-info-div').find('.cMailNum').val());
    // console.log("b8",$(obj).closest('.rel-info-div').find('.cMailOf').val());
    // console.log("b9",$(obj).closest('.rel-info-div').find('.cMailFlr').val());
    // console.log("b10",$(obj).closest('.rel-info-div').find('.cMailEtc').val());


    // 居住 //
    // console.log("c",$(obj).closest('.rel-info-div').find('.cLivezip').val());
    // console.log("c2",$(obj).closest('.rel-info-div').find('select.cLiveCity').val());
    // console.log("c3",$(obj).closest('.rel-info-div').find('select.cLiveArea').val());  
    // console.log("c4",$(obj).closest('.rel-info-div').find('select.cLiveStreet').val());
    // console.log("c5",$(obj).closest('.rel-info-div').find('.cLiveLane').val());
    // console.log("c6",$(obj).closest('.rel-info-div').find('.cLiveAly').val());
    // console.log("c7",$(obj).closest('.rel-info-div').find('.cLiveNum').val());
    // console.log("c8",$(obj).closest('.rel-info-div').find('.cLiveOf').val());
    // console.log("c9",$(obj).closest('.rel-info-div').find('.cLiveFlr').val());
    // console.log("c10",$(obj).closest('.rel-info-div').find('.cLiveEtc').val());
    
}

//1名下不動產:新增資料-地址選擇 確認鈕(新增單筆 名下不動產)  **參考 openModalGHandler(修改客戶申請金額 確認紐)openModalGHandlerBtn 
async function personEstateConfirm(obj) {
    console.log("FFFAAA");
    $('#modalG').modal('hide');
    return
}

//1新增單筆 名下不動產 資料列    **參考 addEstateRowDataCR
async function confirmTest(obj, data) {
    $('#modalG').modal('hide');
    
    return
    const relCode = $(obj).closest(".rel-info-div").find(".hash").val();
    const $div = $('#estateDiv').find(".card-body:eq(0)").find(".data-div");
    const count = $(obj).closest(".card").find(".card").length + 1;
    const $relDiv = $(obj).closest(".rel-info-div");
    const $showDiv = $(obj).closest(".rel-info-div").find(".estateDiv");
    const estatePage = {
        url:
            location.protocol +
            "//" +
            location.host +
            "/" +
            DOMPurify.sanitize(location.pathname.split("/")[1]) +
            "/acceptcase/creditCheckReport/page/component/estateDataPage.html",
        type: "get",
        contentType: "text/html",
    };
    let html = "";
    let $html = "";
    try {
        html = await $.ajax(estatePage);
        html = html.replace(/\$\{relCode\}/g, relCode);
        html = html.replace(/\$\{num\}/g, count);
        $html = $(html);
        // if (data) {
        //     setPageDataByJsonClassNameMappingCR(data, $html);
        // }
    } catch (e) {
        console.error(e);
    }
    if ($html) {
        $div.append($html);
        setCreditDefaultSelect($html);
        // 點選新增按鈕後須判斷 該頁面是否有地址係勾選自有企業即帶入地址
        if (!data) {
            const comSelfChkedArr = $relDiv.find(".address-owner-type[value=1]:checked");
            if (comSelfChkedArr.length > 0 && count <= (comSelfChkedArr.length)) {
                const $addressDiv = $(comSelfChkedArr[count - 1]).closest("td").find(".address-block");
                const pickedData = {
                    "address-flag": $addressDiv.find(".address-flag:checked").val() || "",
                    "address-zip": $addressDiv.find(".address-zip").val() || "",
                    "address-city": $addressDiv.find("select.address-city").val() || "",
                    "address-area": $addressDiv.find("select.address-area").val() || "",
                    "address-street": $addressDiv.find("select.address-street").val() || "",
                    "address-lane": $addressDiv.find(".address-lane").val() || "",
                    "address-aly": $addressDiv.find(".address-aly").val() || "",
                    "address-num": $addressDiv.find(".address-num").val() || "",
                    "address-of": $addressDiv.find(".address-of").val() || "",
                    "address-flr": $addressDiv.find(".address-flr").val() || "",
                    "address-etc": $addressDiv.find(".address-etc").val() || "",
                    "address-add": $addressDiv.find(".address-add").val() || "",
                }
                setPageDataByJsonClassNameMappingCR(pickedData, $html);
            }
        }
        if (data) {
            setPageDataByJsonClassNameMappingCR(data, $html);
        }
        // $(obj).closest(".card").find(".card-body:eq(0)").find(".re_total").val(count);
        $html.find(".address-block select").selectpicker({ liveSearch: true });
        $html.find(".address-block select").selectpicker('refresh');
        $html.find(".address-block select").selectpicker('render');
        $html.find(".address-block select").change();

        $showDiv.collapse("show");
        //收合:不動產現狀
        $showDiv.find('.card-body:nth(0)').find('.collapse.show').map(function () {
            $(this).collapse('hide');
        });
        $showDiv.collapse('show');
        $showDiv.find('.card-body:nth(0)').find(`#companyInformation_realEstate_body_${relCode}_${count}`).collapse('show');
    }
}
