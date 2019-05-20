import axios from 'axios';

//查询
export function mySelect(url,data = {}){
  return new Promise((resolve,reject) => {
    let thi = this
    // arguments[closeLoading] ? arguments[closeLoading] : true;
    thi.$store.state.login.Loading=true
    console.log('查询接口：'+url)
    console.log(data)
    axios.post(global.posturl.host + global.posturl[url],data)
      .then(response => {
        console.log(url+'接口',response.data)
        var qcode = response.data.code
        var qmsg = response.data.msg
        var qdata = response.data.data
        var qtotal = response.data.Total
        if(qcode==200){
          resolve(qdata);
        }
        thi.$store.state.login.Loading=false
      },err => {
        console.log(err)
        reject(err)
      })
  })
}

//查询（返回所有数据）
export function mySelectAll(url,data = {}){
  return new Promise((resolve,reject) => {
    let thi = this
    // arguments[closeLoading] ? arguments[closeLoading] : true;
    thi.$store.state.login.Loading=true
    console.log('查询All接口：'+url)
    console.log(data)
    axios.post(global.posturl.host + global.posturl[url],data)
      .then(response => {
        console.log(url+'接口',response.data)
        var qcode = response.data.code
        var qmsg = response.data.msg
        var qdata = response.data.data
        var qtotal = response.data.Total
        if(qcode==200){
          resolve(response.data);
        }else {
          thi.$message({
            message: qmsg,
            type: 'error',
            duration: 5000
          });
        }
        thi.$store.state.login.Loading=false
      },err => {
        console.log(err)
        reject(err)
      })
  })
}

//提交
export function mySubmit(url,data={}) {
  return new Promise((resolve, reject) => {
    let thi = this;
    thi.$store.state.login.Loading=true
    console.log('提交接口：'+url)
    console.log(data)

    this.axios.post(global.posturl.host + global.posturl[url],data
    ).then(function (response) {
      console.log(url+'接口',response.data)
      var qcode = response.data.code;
      var qmsg = response.data.msg;
      var qdata = response.data.data;
      if (qcode == 200) {
        thi.$message({
          type: 'success',
          message: qmsg
        });
      }
      else {
        console.log(console.log(response))
        thi.$message({
          type: 'warning',
          message: qmsg
        });
      }
      thi.$store.state.login.Loading=false
      resolve(qcode);
    }).catch(function (error) {
      console.log(error)
    });
  })
}

export function myZhiFu(url,data = {}) {
  return new Promise((resolve, reject) => {
    //提交
    let thi = this
    thi.$indicator.open({
      text: '加载中...',
      spinnerType: 'fading-circle',
    });
    this.$http.post(global.posturl.host + global.posturl.makeOrderquick, data
    ).then(function (response) {
      thi.$indicator.close();
      console.log('接口'+url)
      console.log(response.data)
      var qcode = response.data.code
      var qmsg = response.data.msg
      var qdata = response.data.data
      if(qcode==666){
        thi.$toast({
          message: '成功1',
        });
        resolve('666');
        // thi.$router.push({ name:'order'})
      } else  if (qcode == 200) {
        WeixinJSBridge.invoke('getBrandWCPayRequest',{
          "appId": qdata.appId,     //公众号名称
          "timeStamp": qdata.timeStamp.toString(), //时间戳，自1970年以来的秒数
          "nonceStr": qdata.nonceStr, //随机串
          "package": qdata.package,
          "signType": qdata.signType,//微信签名方式：
          "paySign": qdata.paySign //微信签名
        },function(res){
          if(res.err_msg == "get_brand_wcpay_request:ok" ) {
            thi.$toast({
              message: '支付成功！',
            },);
            resolve('200');
            // thi.$router.push({ name:'order'})
          } else {
            thi.$toast({
              message: '支付已取消！',
            });
          }
        });
      } else {
        thi.$toast({
          message: qmsg,
        });
      }
    }).catch(function (error) {
      console.log(error)
      reject(err)
    });
  })
}
