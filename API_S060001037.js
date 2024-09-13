
    let userObj = getUidToken();
    let uid = userObj.uid;
    let token = userObj.token;
    let branch = userObj.branch
    let obj = $(".btnOpDiv")
    let data = await saveOpJSON(obj);
    const s060001037 = getS060001037(uid, token, branch, data);
    $.when($.ajax(s060001037)).done(function (jsondata) { //傳送後端
        if (jsondata.rc == "M0000") {}
