
//2連帶保證書（定有期間）-init：預設帶入上方「連帶保證約定期間」與「帳號」
function icJointGuaranteeFixedTermInit($card) {
    // 1. 預設帶入連帶保證約定期間
    const $n3 = $(".N3").first();
    icSetDate($card, {
        year: $n3.find(".year").val() || "",
        month: $n3.find(".month").val() || "",
        day: $n3.find(".day").val() || ""
    });

    // 2. 新增類別時帶入帳號
    // ⚠️ 請依實際頁面上存放「帳號」的 input class 微調下列選取器（例如 $(".accountNo").val()）
    const accountNo = $(".accountNo").first().val() || "";
    $card.find(".icGuAccountNo").val(accountNo);
}

//2連帶保證書（定有期間）-回填（val 為下行的 data）
function icJointGuaranteeFixedTermFill($card, val) {
    const $list = $card.find(".guaranteePersonList");

    // 1. 回填多位立連帶保證書人（相容陣列 ["ID1", "ID2"] 或單筆 val.id）
    const guarantors = Array.isArray(val.guarantors) ? val.guarantors : (val.id ? [val.id] : []);
    guarantors.forEach((item, idx) => {
        const personId = typeof item === "object" ? item.id : item;
        if (idx > 0) {
            appendGuPersonRowFT($list);
        }
        icSetPerson($card, personId, idx);
    });

    // 2. 回填連帶保證約定期間
    icSetDate($card, val);

    // 3. 回填擔保額度、履行地分行、帳號、簽章
    $card.find(".icGuPersonAmount").val(val.amount || "");
    $card.find(".guaranteeBranch").val(val.branch || "");
    $card.find(".icGuAccountNo").val(val.accountNo || "");
    $card.find(".seal2").first().val(val.seal2 || "");
}

//2連帶保證書（定有期間）-暫存取值（S060001037 的 data）
function icJointGuaranteeFixedTermCollect($card) {
    const guarantors = [];
    $card.find(".guaranteePersonList .icPersonGroup").each(function (idx) {
        const personId = icGetPerson($card, idx);
        if (personId) {
            guarantors.push(personId);
        }
    });

    const date = icGetDate($card);

    return {
        "guarantors": guarantors,
        "year": date.year,
        "month": date.month,
        "day": date.day,
        "amount": $card.find(".icGuPersonAmount").val() || "",
        "branch": $card.find(".guaranteeBranch").val() || "",
        "accountNo": $card.find(".icGuAccountNo").val() || "",
        "seal2": $card.find(".seal2").first().val() || ""
    };
}

//動態建立保證人列 HTML（配合 HTML 的 addGuPersonBtnFT 命名）
function appendGuPersonRowFT($list) {
    const $row = $(`
        <div class="form-group form-inline my-2 icPersonGroup" data-types="6">
            <span class="mr-2" style="visibility: hidden;">立連帶保證書人：</span>
            <select class="form-control mr-2 icPerson">
                <option value="">請選擇</option>
            </select>
            <input type="text" class="form-control col-3 icPersonName" value="" disabled>
            <button type="button" class="ml-2 btn btn-danger" onclick="delGuPersonBtnFT(this)">×</button>
        </div>
    `);
    $list.append($row);
}

//按鈕事件：新增立連帶保證書人（對應 HTML onclick="addGuPersonBtnFT(this)"）
function addGuPersonBtnFT(obj) {
    const $list = $(obj).closest(".guaranteePersonList");
    appendGuPersonRowFT($list);
    icRefreshPageFields();
}

//按鈕事件：刪除立連帶保證書人
function delGuPersonBtnFT(obj) {
    $(obj).closest(".icPersonGroup").remove();
}

//同步「第一位」立連帶保證書人的擔保額度
function syncFirstGuarantorAmountFT($card) {
    const firstPersonId = $card.find(".guaranteePersonList .icPersonGroup").first().find(".icPerson").val() || "";
    let amount = "";

    if (firstPersonId) {
        // 從上方綜合契約書（連帶保證人區塊）對應統編抓取擔保額度
        // ⚠️ 請依實際頁面上保證人區塊的外層 class 與金額 input class 微調下列選取器
        $("#GCC .guarantor-block, .guarantorList .guarantor-item").each(function () {
            const blockId = $.trim($(this).find(".id, .code, .guarantorId").val() || "");
            if (blockId === firstPersonId) {
                amount = $(this).find(".amount, .guarantorAmount, .guaranteeAmount").val() || "";
                return false;
            }
        });
    }

    $card.find(".icGuPersonAmount").val(amount);
}

//事件委派（檔案載入時執行一次）
(function bindJointGuaranteeFixedTermEvents() {
    const cardSelector = "#indivdualCtableDiv .indivdualC_TableList[data-ictype='JOINT_GUARANTEE_FIXED_TERM']";

    // 只有「第一組」立連帶保證書人變更時，才連動更新擔保額度；後續新增的保證人不影響額度
    $(document).on("change", `${cardSelector} .guaranteePersonList .icPersonGroup:first-child .icPerson`, function () {
        syncFirstGuarantorAmountFT($(this).closest(".indivdualC_TableList"));
    });
})();
