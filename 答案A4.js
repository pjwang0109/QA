
//刷新所有卡片的共用欄位（沒有用到共用欄位時不做事）
function icRefreshPageFields() {
    const $tableDiv = $("#indivdualCtableDiv");
    const $groups = $tableDiv.find(".icPersonGroup");
    const $fields = $tableDiv.find(".icBorrowerName, .icCourts, .icPhone, .icFax, .icGuAccountNo");
    if ($groups.length == 0 && $fields.length == 0) { return; }
    icWatchPageFields();
    const list = icIdentityList();
    $groups.each(function () {
        icRefreshPersonGroup($(this), list);
    });
    const borrower = list.find(function (item) { return item.type == "0"; });
    $tableDiv.find(".icBorrowerName").val(borrower ? borrower.name : "");
    const $source = $("#otherCommonTermsDiv");
    $tableDiv.find(".icCourts").val($source.find(".courts").first().val() || "");
    $tableDiv.find(".icPhone").val($source.find(".phone").first().val() || "");
    $tableDiv.find(".icFax").val($source.find(".fax").first().val() || "");
    $tableDiv.find(".icGuAccountNo").val($(".opCenterAccountId").first().val() || "");

    // 同步連帶保證書（定有期間）第一位保證人的擔保額度（涵蓋舊案回填與身分別異動）
    $tableDiv.find(".indivdualC_TableList[data-ictype='JOINT_GUARANTEE_FIXED_TERM']").each(function () {
        icRefreshGuAmount($(this));
    });
}

function icBindPageFieldEvents() {
    //使用者修改身分別、負責人、其他共同條款、帳號 → 刷新卡片的共用欄位
    $(document).on("input change", "#genderDiv input, #genderDiv select, .responsibleDiv .responsibleName, #otherCommonTermsDiv .courts, #otherCommonTermsDiv .phone, #otherCommonTermsDiv .fax, .opCenterAccountId", icScheduleRefresh);
    //使用者換人
    $(document).on("change", "#indivdualCtableDiv .icPerson", icOnPersonChange);
    //民國日期
    $(document).on("focusin", IC_DATE_SELECTOR, icOnDateFocus);
    $(document).on("input", IC_DATE_SELECTOR, icOnDateInput);
    $(document).on("change", "#indivdualCtableDiv .icDateYear, #indivdualCtableDiv .icDateMonth", icOnYearMonthChange);
}
