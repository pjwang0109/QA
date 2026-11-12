//2連帶保證書（定有期間）-init：預設帶入上方「連帶保證約定期間」
function icJointGuaranteeFixedTermInit($card) {
    const $n3 = $(".N3").first();
    icSetDate($card, {
        year: $n3.find(".year").val() || "",
        month: $n3.find(".month").val() || "",
        day: $n3.find(".day").val() || ""
    });
}

//2連帶保證書（定有期間）-回填（val 為下行的 data）
function icJointGuaranteeFixedTermFill($card, val) {
    const $list = $card.find(".guaranteePersonList");

    // 1. 回填多位立連帶保證書人
    const guarantors = Array.isArray(val.guarantors) ? val.guarantors : (val.id ? [val.id] : []);
    guarantors.forEach((item, idx) => {
        const personId = typeof item === "object" ? item.id : item;
        if (idx > 0) {
            appendGuPersonRow($list);
        }
        icSetPerson($card, personId, idx);
    });

    // 2. 回填連帶保證約定期間
    icSetDate($card, val);

    // 3. 回填其他欄位
    $card.find(".icGuaranteeAmount").val(val.amount || "");
    $card.find(".icBranch").val(val.branch || "");
    $card.find(".icAccountNo").val(val.accountNo || "");
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
        "amount": $card.find(".icGuaranteeAmount").val() || "",
        "branch": $card.find(".icBranch").val() || "",
        "accountNo": $card.find(".icAccountNo").val() || "",
        "seal2": $card.find(".seal2").first().val() || ""
    };
}

//動態建立保證人列 HTML（可與未定期間保證書共用）
function appendGuPersonRow($list) {
    const $row = $(`
        <div class="form-group form-inline my-2 icPersonGroup" data-types="6">
            <span class="mr-2" style="visibility: hidden;">立連帶保證書人：</span>
            <select class="form-control mr-2 icPerson">
                <option value="">請選擇</option>
            </select>
            <input type="text" class="form-control col-3 icPersonName" placeholder="" value="" disabled>
            <button type="button" class="ml-2 btn btn-danger" onclick="delGuPersonRow(this)">×</button>
        </div>
    `);
    $list.append($row);
}

//新增立連帶保證書人
function addGuPersonRow(obj) {
    const $list = $(obj).closest(".guaranteePersonList");
    appendGuPersonRow($list);
    icRefreshPageFields();
}

//刪除立連帶保證書人
function delGuPersonRow(obj) {
    $(obj).closest(".icPersonGroup").remove();
}

//同步「第一位」保證人的擔保額度
function syncFirstGuarantorAmount($card) {
    const firstPersonId = $card.find(".guaranteePersonList .icPersonGroup").first().find(".icPerson").val() || "";
    let amount = "";

    if (firstPersonId) {
        // ⚠️ 請依實際頁面綜合契約書保證人區塊的外層 class 與金額 input class 調整選取器
        $("#GCC .guarantor-block, .guarantorList .guarantor-item").each(function () {
            const blockId = $.trim($(this).find(".id, .code, .guarantorId").val() || "");
            if (blockId === firstPersonId) {
                amount = $(this).find(".amount, .guarantorAmount, .guaranteeAmount").val() || "";
                return false;
            }
        });
    }

    $card.find(".icGuaranteeAmount").val(amount);
}

//事件委派（檔案載入時執行一次）
(function bindJointGuaranteeFixedTermEvents() {
    const cardSelector = "#indivdualCtableDiv .indivdualC_TableList[data-ictype='JOINT_GUARANTEE_FIXED_TERM']";

    // 只有「第一組」立連帶保證書人變更時，才連動更新擔保額度
    $(document).on("change", `${cardSelector} .guaranteePersonList .icPersonGroup:first-child .icPerson`, function () {
        syncFirstGuarantorAmount($(this).closest(".indivdualC_TableList"));
    });
})();
