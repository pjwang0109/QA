
//動態建立保證人列 HTML（第二筆起附帶刪除按鈕）
function appendGuPersonRow($list) {
    const $row = $(`
        <div class="form-group form-inline my-2 icPersonGroup" data-types="6">
            <span class="mr-2" style="visibility: hidden;">立連帶保證書人：</span>
            <select class="form-control mr-2 icPerson">
                <option value="">請選擇</option>
            </select>
            <input type="text" class="form-control col-3 icPersonName" value="" disabled>
            <button type="button" class="ml-2 btn btn-danger" onclick="delGuPersonBtn(this)">×</button>
        </div>
    `);
    $list.append($row);
}

//按鈕事件：新增立連帶保證書人
function addGuPersonBtn(obj) {
    const $list = $(obj).closest(".guaranteePersonList");
    appendGuPersonRow($list);
    // 觸發共用刷新，讓新加入的 .icPerson 下拉選單自動填入連帶保證人選項
    icRefreshPageFields();
}

//按鈕事件：刪除立連帶保證書人
function delGuPersonBtn(obj) {
    $(obj).closest(".icPersonGroup").remove();
}

/**
 * 依選取的連帶保證人選項，從 .N5 #GCC 取得對應的擔保額度（gccMoney）
 * 優先用「顯示名稱（如 連帶保證人2）+ 統編」雙重精準比對，避免同統編重複出現時抓錯筆
 * @param {Object} optionItem icOptions 裡的物件 { id, label, name, ... }
 * @returns {string} 擔保額度（含千分位字串，無資料回傳空字串）
 */
function icIdentityGuaranteeMoney(optionItem) {
    if (!optionItem) { return ""; }
    let money = "";
    const targetLabel = $.trim(optionItem.label || "");
    const targetId = $.trim(optionItem.id || "");

    // 1. 優先用「角色名稱＋序號」與「統編」雙重比對
    $(".N5 #GCC .guarantor-block").each(function () {
        const $block = $(this);
        const blockId = $.trim($block.attr("data-id") || $block.find("input.code").val() || "");
        const labelText = $.trim($block.find(".jsGuarantor").first().text()).replace(/[：:]$/, "");

        if (blockId === targetId && labelText === targetLabel) {
            money = $.trim($block.find("input.gccMoney").first().val() || "");
            return false;
        }
    });

    // 2. 防呆備援：若標題文字格式不同沒對到，退回用統編抓第一筆符合的
    if (money === "" && targetId) {
        $(".N5 #GCC .guarantor-block").each(function () {
            const $block = $(this);
            const blockId = $.trim($block.attr("data-id") || $block.find("input.code").val() || "");
            if (blockId === targetId) {
                money = $.trim($block.find("input.gccMoney").first().val() || "");
                return false;
            }
        });
    }

    return money;
}

//刷新單張卡片的「連帶保證人擔保額度」（永遠只認第一筆保證人）
function icRefreshGuAmount($card) {
    const $firstSelect = $card.find(".guaranteePersonList .icPersonGroup").first().find(".icPerson");
    const selectEl = $firstSelect[0];
    const options = $firstSelect.data("icOptions") || [];
    const selectedItem = (selectEl && selectEl.selectedIndex > 0) ? options[selectEl.selectedIndex - 1] : null;

    $card.find(".icGuPersonAmount").val(icIdentityGuaranteeMoney(selectedItem));
}

//事件委派綁定（檔案載入時執行一次，負責動態連動）
function icBindGuFixedTermEvents() {
    const cardSelector = "#indivdualCtableDiv .indivdualC_TableList[data-ictype='JOINT_GUARANTEE_FIXED_TERM']";

    // 1. 切換「第一筆」立連帶保證書人時，更新擔保額度（第二筆以後變更不影響額度）
    $(document).on("change", `${cardSelector} .guaranteePersonList .icPersonGroup:first-child .icPerson`, function () {
        icRefreshGuAmount($(this).closest(".indivdualC_TableList"));
    });

    // 2. 上方 .N5 #GCC 的擔保額度（.gccMoney）修改或千分位格式化後，同步更新卡片額度
    $(document).on("input blur change", ".N5 #GCC input.gccMoney", function () {
        $(cardSelector).each(function () {
            icRefreshGuAmount($(this));
        });
    });

    // 3. 上方身分別區塊異動（導致連帶保證人1、2重新編號或刪除）時，延遲 120ms 待共用選單重繪後同步額度
    $(document).on("input change", "#genderDiv input, #genderDiv select", function () {
        setTimeout(function () {
            $(cardSelector).each(function () {
                icRefreshGuAmount($(this));
            });
        }, 120);
    });
}
icBindGuFixedTermEvents();

/////////////////////////個別契約-類別START/////////////////////////
// ...（本票、授信約定書略）

//2連帶保證書（定有期間）-init：預設帶入上方 .N3 的「連帶保證約定期間」（只放一次性預設值）
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

    // 回填多位立連帶保證書人（相容陣列 ["ID1", "ID2"] 或單筆字串 "ID1"）
    const idList = Array.isArray(val.id) ? val.id : (val.id ? [val.id] : []);
    idList.forEach(function (personId, idx) {
        if (idx > 0) {
            appendGuPersonRow($list);
        }
        icSetPerson($card, personId, idx);
    });

    // 回填連帶保證約定期間
    icSetDate($card, val);

    // 回填履行地分行與簽章
    $card.find(".guaranteeBranch").val(val.branch || "");
    $card.find(".seal2").first().val(val.seal2 || "");
}

//2連帶保證書（定有期間）-暫存取值（S060001037 的 data）
function icJointGuaranteeFixedTermCollect($card) {
    const idList = [];
    $card.find(".guaranteePersonList .icPersonGroup").each(function (idx) {
        const personId = icGetPerson($card, idx);
        if (personId) {
            idList.push(personId);
        }
    });

    const date = icGetDate($card);

    return {
        "id": idList,
        "year": date.year,
        "month": date.month,
        "day": date.day,
        "branch": $card.find(".guaranteeBranch").val() || "",
        "seal2": $card.find(".seal2").first().val() || ""
    };
}
