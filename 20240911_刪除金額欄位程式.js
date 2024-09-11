// 刪除:連帶保證人金額欄位
function guaAmountDel(){ 
    let gccArr = [];
    let delArr = [];
    // 保證人擔保額度連動顯示，只顯示保證人
    let $gcc = $('#GCC');

    $(".identities").map(function (index) {
        let $item = $(this)
        let id = $item.find(".id").val()
        let type = $item.find(".type").val()
        let name = $item.find(".name").val()
        let typeText = $item.find(".type option:selected").text()

        $(".guarantor").map(function (index) {
            let $item = $(this)
            let guaName = $item.find(".principal").val()
            let guaText = $item.find(".guaCurrency option:selected").text()
            let gccMoney = $item.find(".gccMoney").val()
            
            if (type === "6" && name === guaName) { // 身份別為=>連帶保證人
                gccArr.push({ "id": id, "type": type, "name": name, "typeText": typeText, "guaName": guaName, "guaText": guaText, "gccMoney": gccMoney })
            }
        })
    })
    console.log('@@', gccArr);

    // $.each($('.guarantor'), function () {
    //     let n1 = $(this).find('.guaCurrency').val()
    //     console.log("n1", n1); // 幣別的代表數字
    // })

    // let checkNum = {}
    // Object.entries(gccArr).forEach(([index, item]) => {
    //     console.log('index', index);
    //     let num = Number(index) + 1
    //     let id = item.id
    //     let name = item.name
    //     let typeText = item.typeText // 身分別名稱:連帶保證人
    //     let guaText = item.guaText // 幣別
    //     let gccMoney = item.gccMoney  // 金額
    //     checkNum[typeText] = (checkNum[typeText] || 0) + 1 // 連帶保證人1, 連帶保證人2, 連帶保證人3...
    //     console.log('cc', checkNum[typeText]);
        
    //     if (gccArr.length === 1) {
    //         let $gccDiv1 = `<div id="guarantor1" class="form-group form-inline guarantor"><span class="mr-2">保證人擔保額度：</span>
    //             <span class="mr-2">${typeText}1：</span>
    //             <input type="text" class="form-control principal" style="margin:0 20px;" value="${name}" disabled>
    //             <select class="form-control guaCurrency" required="required">
    //                 <option value="">請選擇</option>
    //                 <option value="1">美元</option>
    //                 <option value="2">日圓</option>
    //                 <option value="3">英磅</option>
    //                 <option value="4">瑞郎</option>
    //                 <option value="5">加幣</option>
    //                 <option value="6">星幣</option>
    //                 <option value="7">港幣</option>
    //                 <option value="8">澳幣</option>
    //                 <option value="9">紐幣</option>
    //                 <option value="10">歐元</option>
    //                 <option value="11">南非幣</option>
    //                 <option value="12">人民幣</option>
    //                 <option value="13">新臺幣</option>
    //             </select>
    //             <input type="text" class="form-control mx-2 gccMoney" placeholder="" value="${gccMoney}"
    //                     onblur="set_money_Thousands(this)" onfocus="cancel_money_Thousands(this)"
    //                     oninput=" digitalboxHandler(this)">
    //                     <input type="hidden" class="code" name="code" value="${id}">
    //                     <span>元</span></div>`;
    //         $gcc.append($gccDiv1);
    //     }else if (gccArr.length > 1) {
    //         if (index === "0") {
    //             let $gccDiv1 = `<div id="guarantor1" class="form-group form-inline my-2 guarantor"><span class="mr-2">保證人擔保額度：</span>
    //             <span class="mr-2">${typeText}${checkNum[typeText]}：</span>
    //             <input type="text" class="form-control principal" style="margin:0 20px;" value="${name}" disabled>
    //             <select class="form-control guaCurrency" required="required">
    //                 <option value="">請選擇</option>
    //                 <option value="1">美元</option>
    //                 <option value="2">日圓</option>
    //                 <option value="3">英磅</option>
    //                 <option value="4">瑞郎</option>
    //                 <option value="5">加幣</option>
    //                 <option value="6">星幣</option>
    //                 <option value="7">港幣</option>
    //                 <option value="8">澳幣</option>
    //                 <option value="9">紐幣</option>
    //                 <option value="10">歐元</option>
    //                 <option value="11">南非幣</option>
    //                 <option value="12">人民幣</option>
    //                 <option value="13">新臺幣</option>
    //             </select>
    //             <input type="text" class="form-control mx-2 gccMoney" placeholder="" value="${gccMoney}"
    //             onblur="set_money_Thousands(this)" onfocus="cancel_money_Thousands(this)"
    //             oninput=" digitalboxHandler(this)">
    //             <input type="hidden" class="code" name="code" value="${id}">
    //             <span>元</span></div>`;
    //             $gcc.append($gccDiv1);
    //         } else {
    //             let $gccDivOther = `
    //             <div id="guarantor${num}" class="form-group form-inline my-2 guarantor" style="padding-left: 135px;">
    //                 <span class="mr-2">${typeText}${checkNum[typeText]}：</span>
    //                 <input type="text" class="form-control principal" style="margin:0 20px;" value="${name}" disabled>
    //                 <select class="form-control guaCurrency" required="required">
    //                     <option value="">請選擇</option>
    //                     <option value="1">美元</option>
    //                     <option value="2">日圓</option>
    //                     <option value="3">英磅</option>
    //                     <option value="4">瑞郎</option>
    //                     <option value="5">加幣</option>
    //                     <option value="6">星幣</option>
    //                     <option value="7">港幣</option>
    //                     <option value="8">澳幣</option>
    //                     <option value="9">紐幣</option>
    //                     <option value="10">歐元</option>
    //                     <option value="11">南非幣</option>
    //                     <option value="12">人民幣</option>
    //                     <option value="13">新臺幣</option>
    //                 </select>
    //                 <input type="text" class="form-control mx-2 gccMoney" placeholder="" value="${gccMoney}"
    //                 onblur="set_money_Thousands(this)" onfocus="cancel_money_Thousands(this)"
    //                 oninput=" digitalboxHandler(this)">
    //                 <input type="hidden" class="code" name="code" value="${id}">
    //                 <span class="ml-1">元</span></div>`;
    //             $gcc.append($gccDivOther);
    //         }
    //     }
    // })
}
