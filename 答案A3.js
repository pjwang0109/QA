//3連帶保證書（未定期間）-回填（val 為下行的 data）
function icJointGuaranteeIndefiniteFill($card, val) {
    const $list = $card.find(".guaranteePersonList");

    // 回填多位立連帶保證書人（相容陣列 ["ID1", "ID2"] 或單筆字串 "ID1"）
    const idList = Array.isArray(val.id) ? val.id : (val.id ? [val.id] : []);
    idList.forEach(function (personId, idx) {
        if (idx > 0) {
            appendGuPersonRow($list);
        }
        icSetPerson($card, personId, idx);
    });

    // 回填履行地分行與簽章
    $card.find(".guaranteeBranch").val(val.branch || "");
    $card.find(".seal2").first().val(val.seal2 || "");
}

//3連帶保證書（未定期間）-暫存取值（S060001037 的 data）
function icJointGuaranteeIndefiniteCollect($card) {
    const idList = [];
    $card.find(".guaranteePersonList .icPersonGroup").each(function (idx) {
        const personId = icGetPerson($card, idx);
        if (personId) {
            idList.push(personId);
        }
    });

    return {
        "id": idList,
        "branch": $card.find(".guaranteeBranch").val() || "",
        "seal2": $card.find(".seal2").first().val() || ""
    };
}
