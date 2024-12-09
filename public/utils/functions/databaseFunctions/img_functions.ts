import dayjs from "dayjs";
import * as product_functions from "./product_functions";
import * as solitaire_functions from "./solitaire_functions";
import * as msg_functions from "./msg_functions";
import * as order_functions from "./order_functions";
import * as shop_functions from "./shop_functions";

//压缩和上传图片到云储存
export const compressAndUploadImg = async (img, fileDir, prefix) => {
  //压缩和上传图片到云储存
  console.log("compressAndUploadImg", img, fileDir, prefix);
  let c1 = null;
  c1 = new wx.cloud.Cloud({
    resourceAppid: "wx8d82d7c90a0b3eda",
    resourceEnv: "miemie-buyer-7gemmgzh05a6c577",
  });
  await c1.init({
    env: "miemie-buyer-7gemmgzh05a6c577",
  });

  let res_0 = await wx.compressImage({
    //压缩图片*unfinished compressImage只对jpg有效
    src: img.url,
    quality: 20,
  });
  if (!(res_0 && res_0.tempFilePath && res_0.tempFilePath.length > 0)) {
    return null;
  }
  let tempFilePath = res_0.tempFilePath; //压缩后图片的临时文件路径
  let fileName = tempFilePath
    .replace("http://tmp/", "")
    .replace("wxfile://", "");
  let cloudPath = [fileDir, prefix, fileName].join("/");
  let res = await c1.uploadFile({
    cloudPath: cloudPath,
    // filePath: item.url,
    filePath: tempFilePath,
  });
  if (!(res && res.fileID && res.fileID.length > 0)) {
    return null;
  }
  console.log("上传", prefix, "到云储存成功", res);
  let r = await wx.cloud.callFunction({
    name: "get_temp_file_url",
    data: {
      fileList: [res.fileID],
    },
  });
  // console.log('im-0', r);
  if (!(r && r.result && r.result.length > 0)) {
    return null;
  }
  return {
    cloudPath: cloudPath,
    fileID: res.fileID,
    url: r.result[0],
  };
};

//从云储存删除图片
export const deleteImgs = async (deletedUrl) => {
  console.log("deletedUrl,deletedUrl", deletedUrl);
  let c1 = null;
  c1 = new wx.cloud.Cloud({
    resourceAppid: "wx8d82d7c90a0b3eda",
    resourceEnv: "miemie-buyer-7gemmgzh05a6c577",
  });
  await c1.init({
    env: "miemie-buyer-7gemmgzh05a6c577",
  });
  let response = await c1.deleteFile({
    fileList: deletedUrl,
  });
  console.log("从云储存删除图片成功", response);
};
