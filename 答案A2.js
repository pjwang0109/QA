//刷新單張卡片的「連帶保證人擔保額度」（永遠只認第一筆保證人）
function icRefreshGuAmount($card) {
    const $firstSelect = $card.find(".guaranteePersonList .icPersonGroup").first().find(".icPerson");
    const selectEl = $firstSelect[0];
    const options = $firstSelect.data("icOptions") || [];
    const selectedItem = (selectEl && selectEl.selectedIndex > 0) ? options[selectEl.selectedIndex - 1] : null;

    const $amountInput = $card.find(".icGuPersonAmount");
    const rawMoney = icIdentityGuaranteeMoney(selectedItem);
    $amountInput.val(rawMoney);

    // 只要有金額且專案內有 set_money_Thousands 函式，直接呼叫它補上千分位
    if (rawMoney !== "" && typeof set_money_Thousands === "function") {
        set_money_Thousands($amountInput[0]);
    }
}

----------

// 上方 .N5 #GCC 的擔保額度（.gccMoney）修改或千分位格式化後，同步更新卡片額度
$(document).on("input blur change", ".N5 #GCC input.gccMoney", function () {
    setTimeout(function () {
        $(IC_GUARANTEE_CARD_SELECTOR).each(function () {
            icRefreshGuAmount($(this));
        });
    }, 0);
});
