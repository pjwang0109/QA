//本票及授權書-新增關係人選單
function addRel(obj) {
  let $target = $(obj);
  let num = $target.closest(".invoAllDiv").find(".invoDiv").length + 1;

  $div = `
    <div class="col-12 mt-3">
        <div id="invoDiv${num}" class="invoDiv">
            <select class="form-control mr-2 invoType${num}">
                <option value="">請選擇</option>
                <option value="1">發票人</option>
                <option value="2">共同發票人</option>
            </select>
            <select class="form-control mr-2" id="invoName${num}">
                <option value="">請選擇</option>
            </select>
            <button type="button" class="btn btn-danger mx-2" onclick="delRel(this)">&times;</button>
        </div>
    </div>
    `;

  $target.closest('.invoAllDiv').find('.row').append($div);

}

//本票及授權書-刪除關係人選單
function delRel(target) {
  let $target = $(target);
  console.log("$target:", $target);
  let invoID = $target.closest(`.invoDiv`).attr("id"); //invoDiv2,invoDiv3...

  console.log("invoID:", invoID);
  $(`#${invoID}`).closest(".mt-3").remove();
}

//本票及授權書-關係人連動(下拉式選單)
function invoicer(num) {
  //取出名字
  let nameArr = [];
  $.each($(".identities"), function (i, v) {
    if (i > 0) {
      nameArr.push($(v).find(".name").val());
    }
  });
  //塞入選單
  $.each(nameArr, function (i, val) {
    let $option = `<option value="${val}">${val}</option>`;
    $(`#indivdualCtable${num}`).find("#invoName").append($option);
  });
}
