//2連帶保證書（定有期間）-init：只預設帶入「連帶保證約定期間」年月日
function icJointGuaranteeFixedTermInit($card) {
    const $n3 = $(".N3").first();
    icSetDate($card, {
        year: $n3.find(".year").val() || "",
        month: $n3.find(".month").val() || "",
        day: $n3.find(".day").val() || ""
    });

    // 初次建立卡片時，同步一次上方的「帳號」
    syncGuAccountNoFT($card);
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

    // 2. 回填連帶保證約定期間（照下行原樣帶入）
    icSetDate($card, val);

    // 3. 回填其他欄位（債務人、法院、帳號在後續連動刷新時也會維持最新狀態）
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

//動態建立保證人列 HTML
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

//新增立連帶保證書人
function addGuPersonRowFT(obj) {
    const $list = $(obj).closest(".guaranteePersonList");
    appendGuPersonRowFT($list);
    icRefreshPageFields();
}

//刪除立連帶保證書人
function delGuPersonBtnFT(obj) {
    $(obj).closest(".icPersonGroup").remove();
}

//同步「帳號」：從上方主畫面讀取並填入卡片
function syncGuAccountNoFT($targetCard) {
    // ⚠️ 請依實際主畫面上存放「帳號」的 input class 替換下列選取器（例如 $(".accountNo")）
    const accountNo = $(".accountNo").first().val() || "";
    const $cards = $targetCard || $("#indivdualCtableDiv .indivdualC_TableList[data-ictype='JOINT_GUARANTEE_FIXED_TERM']");
    $cards.find(".icGuAccountNo").val(accountNo);
}

//同步「第一位」立連帶保證書人的擔保額度
function syncFirstGuarantorAmountFT($card) {
    const firstPersonId = $card.find(".guaranteePersonList .icPersonGroup").first().find(".icPerson").val() || "";
    let amount = "";

    if (firstPersonId) {
        // ⚠️ 請依實際主畫面上保證人區塊的外層 class 與金額 input class 替換下列選取器
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

//事件委派（檔案載入時執行一次，負責即時連動）
(function bindJointGuaranteeFixedTermEvents() {
    const cardSelector = "#indivdualCtableDiv .indivdualC_TableList[data-ictype='JOINT_GUARANTEE_FIXED_TERM']";

    // 1. 只有「第一組」立連帶保證書人變更時，才連動更新擔保額度
    $(document).on("change", `${cardSelector} .guaranteePersonList .icPersonGroup:first-child .icPerson`, function () {
        syncFirstGuarantorAmountFT($(this).closest(".indivdualC_TableList"));
    });

    // 2. 上方主畫面「帳號」改變時，所有定有期間連帶保證書卡片跟著即時更新
    // ⚠️ 請將 ".accountNo" 替換為主畫面實際的帳號輸入框選取器
    $(document).on("input change", ".accountNo", function () {
        syncGuAccountNoFT();
    });

    // 3. 上方主畫面「保證人擔保額度」改變時，卡片的額度也跟著即時同步
    // ⚠️ 請將 ".guarantorAmount" 替換為主畫面實際的保證人額度輸入框選取器
    $(document).on("input change", ".guarantorAmount", function () {
        $(cardSelector).each(function () {
            syncFirstGuarantorAmountFT($(this));
        });
    });
})();
