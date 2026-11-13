function icRefreshPageFields() {
    const $tableDiv = $("#indivdualCtableDiv");
    const $groups = $tableDiv.find(".icPersonGroup");
    // 1. 加上 .icGuAccountNo，確保只有這個欄位時不會提早 return
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
    // 2. 從主畫面帶入帳號
    $tableDiv.find(".icGuAccountNo").val($(".opCenterAccountId").first().val() || "");
}
