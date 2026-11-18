// 1. 抽成共用選取器常數（定有期間 ＋ 未定期間）
const IC_GUARANTEE_CARD_SELECTOR = "#indivdualCtableDiv .indivdualC_TableList[data-ictype='JOINT_GUARANTEE_FIXED_TERM'], #indivdualCtableDiv .indivdualC_TableList[data-ictype='JOINT_GUARANTEE_INDEFINITE']";

// 事件委派綁定（同時支援定有期間與未定期間）
function icBindGuaranteeEvents() {
    // 1. 切換「第一筆」立連帶保證書人時，更新擔保額度
    $(document).on("change", "#indivdualCtableDiv .indivdualC_TableList[data-ictype='JOINT_GUARANTEE_FIXED_TERM'] .guaranteePersonList .icPersonGroup:first-child .icPerson, #indivdualCtableDiv .indivdualC_TableList[data-ictype='JOINT_GUARANTEE_INDEFINITE'] .guaranteePersonList .icPersonGroup:first-child .icPerson", function () {
        icRefreshGuAmount($(this).closest(".indivdualC_TableList"));
    });

    // 2. 上方 .N5 #GCC 的擔保額度（.gccMoney）修改後，同步更新兩類連帶保證書卡片
    $(document).on("input blur change", ".N5 #GCC input.gccMoney", function () {
        $(IC_GUARANTEE_CARD_SELECTOR).each(function () {
            icRefreshGuAmount($(this));
        });
    });

    // 3. 上方身分別區塊異動時，同步刷新兩類連帶保證書卡片的額度
    $(document).on("input change", "#genderDiv input, #genderDiv select", function () {
        setTimeout(function () {
            $(IC_GUARANTEE_CARD_SELECTOR).each(function () {
                icRefreshGuAmount($(this));
            });
        }, 120);
    });
}
icBindGuaranteeEvents();
