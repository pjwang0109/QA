$(document).ready(function () {
  let dataTable = $("#myTable").DataTable({
    // 屬性
    responsive: true,
    // 語言 (language)
    language: {
      processing: "處理中...",
      loadingRecords: "載入中...",
      lengthMenu: "顯示 _MENU_ 項結果",
      zeroRecords: "沒有符合的結果",
      info: "顯示 _START_ 到 _END_ 筆資料，共 _TOTAL_ 項",
      search: "搜尋:",
      infoEmpty: "没有任何資料",
      emptyTable: "尚未有資料存在",
    },
    // 定義列
    columnDefs: [
	],
    // 資料欄位 (columns)
    columns: [
      {
        data: "userid",
        title: "身分證",
        className: "text-center",
        width: "15%",
      },
      {
        data: "username",
        title: "姓名",
        className: "text-center",
        width: "15%",
      },
      { data: "number", 
      title: "電話", 
      className: "text-center", 
      width: "15%" 
      },
      {
        data: "address",
        title: "地址",
        width: "40%",
      },
      { data: "memo", 
      title: "備註", 
      width: "15%" 
      },
    ],
  });
  // focus 在身分證輸入框
  $("#id-card").focus();

  // 點選任一筆，將資料放在輸入項內
  $("#myTable tbody").on("click", "tr", function () {
    // 取得 點擊的資料
    let myData = dataTable.row(this).data();

    console.log(myData);
    // 將 dataTable 的資料，放到 input 內
    $("#id-card").val(myData.userid);
    $("#name").val(myData.username);
    $("#phone").val(myData.number);
    $("#address").val(myData.address);
    $("#memo").val(myData.memo);
  });

  // 查詢 btn
  $("#queryBtn").click(function () {
    // 先清空 message 文字提示
    $("#message").text("");
    // 獲取身分證字號: 1 英文字轉大寫   2 當前後有多餘的空格時，將它去除
    let inputId = $("#id-card").val().toUpperCase().trim();
    console.log("身分證的值為:", inputId);

    // 查詢 AJAX
    $.ajax({
      url: "http://localhost:8080/training/res/S010010001",
      method: "POST",
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify({ id: inputId }),
      success: function (response) {
        // 清空 DataTable 資料
        dataTable.clear().draw();

        // 符合輸入身分證: 英文字母、9個數字
        if (inputId.match(/^[a-zA-Z][12][0-9]{8}$/)) {
          // 如果API返回的資料中包含符合的身分證資料
          if (inputId === response.result.userid) {
            // 提示字元
            alert("查詢成功!!");
            // 將 API 返回的資料加入 DataTable 中
            dataTable.row
              .add({
                userid: response.result.userid,
                username: response.result.username,
                number: response.result.number,
                address: response.result.address,
                memo: response.result.memo,
              })
              .draw();

            $("#id-card").val(response.result.userid);
            $("#name").val(response.result.username);
            $("#phone").val(response.result.number);
            $("#address").val(response.result.address);
            $("#memo").val(response.result.memo);

            $("#message").text("Yes!身份證與資料相符");
          } else {
            // 提示字元
            alert("查詢失敗，請輸入與資料相符的身分證!");
            $("#message").text("No!身份證與資料不符");
            // 清空和資料庫裡 身份證沒有對應的 其他 input 資料
            $("#name").val("");
            $("#phone").val("");
            $("#address").val("");
            $("#memo").val("");
          }
        } else {
          // 提示字元
          alert("錯誤，請輸入格式正確的身分證!");
          $("#message").text("總共10個字元");
          // 清空和資料庫裡 身份證沒有對應的 其他 input 資料
          $("#name").val("");
          $("#phone").val("");
          $("#address").val("");
          $("#memo").val("");
        }
      },
      error: function (error) {
        console.log("失敗:", error);
      },
    });
  });

  // 新增 btn
  $("#addBtn").click(function () { 
    // 先清空 message 文字提示
    $("#message").text("");
    // 取得身分證字號、姓名、電話、地址、備註
    let inputId = $("#id-card").val().toUpperCase().trim();
    let inputName = $("#name").val().trim();
    let phone = $("#phone").val().trim();
    let address = $("#address").val().trim();
    let memo = $("#memo").val().trim();

    // 必填 姓名、電話、地址
    let requireInput =
      inputId.length !== 0 &&
      inputName.length !== 0 &&
      phone.length !== 0;

    // 城市地區 英文轉換數字
    const cityCode = {
      A: 10,
      B: 11,
      C: 12,
      D: 13,
      E: 14,
      F: 15,
      G: 16,
      H: 17,
      J: 18,
      K: 19,
      L: 20,
      M: 21,
      N: 22,
      P: 23,
      Q: 24,
      R: 25,
      S: 26,
      T: 27,
      U: 28,
      V: 29,
      X: 30,
      Y: 31,
      W: 32,
      Z: 33,
      I: 34,
      O: 35,
    };

    // 身分證檢驗
    if (inputId.match(/^[A-Z][12][0-9]{8}$/)) {
      // 身份證檢碼
      const firstIdEn = inputId.charAt(0);
      const otherIdNum = inputId.substring(1, 9);

      let idSum =
        (cityCode[firstIdEn] % 10) * 9 + Math.floor(cityCode[firstIdEn] / 10);
      for (let i = 0; i < otherIdNum.length; i++) {
        idSum += parseInt(otherIdNum.charAt(i)) * (8 - i);
      }

      const remainderId = idSum % 10;
      const checkLastNum = remainderId === 0 ? 0 : 10 - remainderId;


    // 判斷 #listBtn 是否有 alreadyList 屬性
    let isListed = $("#listBtn").hasClass("alreadyList");
    
    if(isListed){
		alert("有alreadyList");
	}else{
		alert("無alreadyList");
	}
	
      if (checkLastNum === parseInt(inputId.charAt(9)) && requireInput) {
        $("#message").text("符合身份證字號且檢碼正確");
        // 新增 AJAX
        $.ajax({
          url: "http://localhost:8080/training/res/S010010002",
          method: "POST",
          dataType: "json",
          contentType: "application/json",
          data: JSON.stringify({
            userid: inputId,
            username: inputName,
            number: phone,
            address: address,
            memo: memo,
          }),
          success: function (response) {
            alert("新增" + response.msg);
            // 清空 DataTable 資料
            dataTable.clear().draw();
            if (response.msg === "失敗") {
              alert("已有相同的身份證在資料裡，請重新輸入");

              $("#name").val("");
              $("#phone").val("");
              $("#address").val("");
              $("#memo").val("");
            } else if (response.msg === "成功") {
			
              dataTable.row
                .add({
                  userid: inputId,
                  username: inputName,
                  number: phone,
                  address: address,
                  memo: memo,
                })
                .draw();

              $("#name").val("");
              $("#phone").val("");
              $("#address").val("");
              $("#memo").val("");

              // 提示文字 清空
              $("#mesName").text("");
              $("#mesPhone").text("");
              $("#mesAddress").text("");
            }
          },
          error: function (error) {
            console.log(error);
          },
        });
        
        // 檢查是否先按下列表按鈕
		let isListClicked = $("#listBtn").hasClass("active");
        // 如果先按下按鈕
        if(isListClicked){
			console.log("以先按下列表");
		}else{
			console.log("尚未按下列表");
		}
		
      } else if (inputName.length === 0) {
        alert("新增錯誤，姓名不得為空");
        $("#mesName").text("請輸入姓名");
        $("#name").focus();
      } else if (phone.length === 0) {
        alert("新增錯誤，電話不得為空");
        $("#mesPhone").text("請輸入電話");
        $("#phone").focus();
      }else {
        alert("檢核碼錯誤，正確檢核碼為" + checkLastNum);
        $("#message").text("請輸入正確的身分證");
      }
    } else if (inputId.length === 0) {
      alert("新增錯誤，身分證不得為空");
      $("#message").text("請輸入身分證");
      $("#id-card").focus();
    } else {
      alert("身分證格式錯誤，請重新輸入");
      $("#message").text("總共10個字元");
    }
  });

  // 修改 btn
  $("#reviseBtn").click(function () {
    // 先清空 message 文字提示
    $("#message").text("");
    // 取得身分證字號、姓名、電話、地址、備註
    let inputId = $("#id-card").val().toUpperCase().trim();
    let inputName = $("#name").val().trim();
    let phone = $("#phone").val().trim();
    let address = $("#address").val().trim();
    let memo = $("#memo").val().trim();

    // 城市地區 英文轉換數字
    const cityCode = {
      A: 10,
      B: 11,
      C: 12,
      D: 13,
      E: 14,
      F: 15,
      G: 16,
      H: 17,
      J: 18,
      K: 19,
      L: 20,
      M: 21,
      N: 22,
      P: 23,
      Q: 24,
      R: 25,
      S: 26,
      T: 27,
      U: 28,
      V: 29,
      X: 30,
      Y: 31,
      W: 32,
      Z: 33,
      I: 34,
      O: 35,
    };

    // 身分證檢驗
    if (inputId.match(/^[A-Z][12][0-9]{8}$/)) {
      // 身份證檢碼
      const firstIdEn = inputId.charAt(0);
      const otherIdNum = inputId.substring(1, 9);

      let idSum =
        (cityCode[firstIdEn] % 10) * 9 + Math.floor(cityCode[firstIdEn] / 10);
      for (let i = 0; i < otherIdNum.length; i++) {
        idSum += parseInt(otherIdNum.charAt(i)) * (8 - i);
      }

      const remainderId = idSum % 10;
      const checkLastNum = remainderId === 0 ? 0 : 10 - remainderId;

      if (checkLastNum === parseInt(inputId.charAt(9))) {
        $("#message").text("符合身份證字號且檢碼正確");
        // 修改 AJAX
        $.ajax({
          url: "http://localhost:8080/training/res/S010010003",
          method: "POST",
          dataType: "json",
          contentType: "application/json",
          data: JSON.stringify({
            userid: inputId,
            username: inputName,
            number: phone,
            address: address,
            memo: memo,
          }), // 根據需求調整傳遞的參數
          success: function (response) {
            alert("修改" + response.msg);
            // 清空 DataTable 資料
            dataTable.clear().draw();
            if (response.msg === "成功") {
              dataTable.row
                .add({
                  userid: inputId,
                  username: inputName,
                  number: phone,
                  address: address,
                  memo: memo,
                })
                .draw();

              $("#name").val("");
              $("#phone").val("");
              $("#address").val("");
              $("#memo").val("");
            } else if (response.msg === "失敗") {
              alert("修改的身份證與資料不符");
            }
          },
          error: function (error) {
            console.log("修改失敗", error);
          },
        });
      } else {
        alert("檢核碼錯誤，正確檢核碼為" + checkLastNum);
        $("#message").text("請輸入正確的身分證，才能成功新增資料");
      }
    } else {
      alert("身分證輸入錯誤，請重新輸入");
      $("#message").text("總共10個字元");
    }
  });

  // 刪除 btn
  $("#deleteBtn").click(function () {
    // 先清空 message 文字提示
    $("#message").text("");
    // 取得身分證字號、姓名、電話、地址、備註
    let inputId = $("#id-card").val().toUpperCase().trim();
    let inputName = $("#name").val().trim();
    let phone = $("#phone").val().trim();
    let address = $("#address").val().trim();
    let memo = $("#memo").val().trim();

    // 刪除 AJAX
    $.ajax({
      url: "http://localhost:8080/training/res/S010010004",
      method: "POST",
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify({
        userid: inputId,
        username: inputName,
        number: phone,
        address: address,
        memo: memo,
      }), // 根據需求調整傳遞的參數
      success: function (response) {
        if (response.msg === "成功") {
          alert("刪除" + response.msg);
          // 清空和資料庫裡 身份證沒有對應的 其他 input 資料
          $("#id-card").val("");
          $("#name").val("");
          $("#phone").val("");
          $("#address").val("");
          $("#memo").val("");
        } else if (response.msg === "失敗") {
          alert("刪除" + response.msg + "，請輸入與資料相符的身分證!");
          $("#message").text("刪除的身份證與資料不符");
        }
      },
      error: function (error) {
        console.log("失敗", error);
      },
    });
  });

  // 列表 btn
  $("#listBtn").click(function () {
	  $("#id-card").val("");
      $("#name").val("");
      $("#phone").val("");
      $("#address").val("");
      $("#memo").val("");
    // 先清空 message 文字提示
    $("#message").text("");

    
    // 清空 DataTable 資料
    dataTable.clear().draw();

    $.ajax({
      url: "http://localhost:8080/training/res/S010010005",
      method: "POST",
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify({
        id: "",
        username: "",
        number: "",
        address: "",
        memo: "",
      }),
      success: function (response) {
        
        // 將 API 返回的資料加入 DataTable 中
        let data = response.result.users;
        for (let i = 0; i < data.length; i++) {
          dataTable.row
            .add({
              userid: data[i]["userid"],
              username: data[i]["username"],
              number: data[i]["number"],
              address: data[i]["address"],
              memo: data[i]["memo"],
            })
            .draw();
        }
        
        console.log("列表成功顯示", response);
      },
      error: function (error) {
        console.log("無法顯示列表", error);
      },
    });
    
    // 添加 alreadyList 屬性到[列表]按鈕
    $(this).addClass("alreadyList");

  });
});