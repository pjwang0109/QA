//2連帶保證書（定有期間）-回填（val 為下行的 data）
function icJointGuaranteeFixedTermFill($card, val) {
    const $list = $card.find(".guaranteePersonList");

    // 1. 回填多位立連帶保證書人（相容陣列 ["ID1", "ID2"] 或單筆字串 "ID1"）
    const idList = Array.isArray(val.id) ? val.id : (val.id ? [val.id] : []);
    idList.forEach(function (personId, idx) {
        if (idx > 0) {
            appendGuPersonRowFT($list);
        }
        icSetPerson($card, personId, idx);
    });

    // 2. 回填連帶保證約定期間
    icSetDate($card, val);

    // 3. 回填履行地分行與簽章
    $card.find(".guaranteeBranch").val(val.branch || "");
    $card.find(".seal2").first().val(val.seal2 || "");
}
