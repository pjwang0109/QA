
// 在 icRefreshPageFields() 最底部：
$tableDiv.find(".indivdualC_TableList[data-ictype='JOINT_GUARANTEE_FIXED_TERM'], .indivdualC_TableList[data-ictype='JOINT_GUARANTEE_INDEFINITE']").each(function () {
    icRefreshGuAmount($(this));
});
