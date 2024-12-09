"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                  ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
exports.__esModule = true;
exports.deleteImgs = exports.compressAndUploadImg = void 0;
//压缩和上传图片到云储存
exports.compressAndUploadImg = function (img, fileDir, prefix) {
  return __awaiter(void 0, void 0, void 0, function () {
    var c1, res_0, tempFilePath, fileName, cloudPath, res, r;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          console.log("compressAndUploadImg", img, fileDir, prefix);
          c1 = null;
          c1 = new wx.cloud.Cloud({
            resourceAppid: "wx8d82d7c90a0b3eda",
            resourceEnv: "miemie-buyer-7gemmgzh05a6c577",
          });
          return [
            4 /*yield*/,
            c1.init({
              env: "miemie-buyer-7gemmgzh05a6c577",
            }),
          ];
        case 1:
          _a.sent();
          return [
            4 /*yield*/,
            wx.compressImage({
              src: img.url,
              quality: 20,
            }),
          ];
        case 2:
          res_0 = _a.sent();
          if (!(res_0 && res_0.tempFilePath && res_0.tempFilePath.length > 0)) {
            return [2 /*return*/, null];
          }
          tempFilePath = res_0.tempFilePath;
          fileName = tempFilePath
            .replace("http://tmp/", "")
            .replace("wxfile://", "");
          cloudPath = [fileDir, prefix, fileName].join("/");
          return [
            4 /*yield*/,
            c1.uploadFile({
              cloudPath: cloudPath,
              // filePath: item.url,
              filePath: tempFilePath,
            }),
          ];
        case 3:
          res = _a.sent();
          if (!(res && res.fileID && res.fileID.length > 0)) {
            return [2 /*return*/, null];
          }
          console.log("上传", prefix, "到云储存成功", res);
          return [
            4 /*yield*/,
            wx.cloud.callFunction({
              name: "get_temp_file_url",
              data: {
                fileList: [res.fileID],
              },
            }),
            // console.log('im-0', r);
          ];
        case 4:
          r = _a.sent();
          // console.log('im-0', r);
          if (!(r && r.result && r.result.length > 0)) {
            return [2 /*return*/, null];
          }
          return [
            2 /*return*/,
            {
              cloudPath: cloudPath,
              fileID: res.fileID,
              url: r.result[0],
            },
          ];
      }
    });
  });
};
//从云储存删除图片
exports.deleteImgs = function (deletedUrl) {
  return __awaiter(void 0, void 0, void 0, function () {
    var c1, response;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          console.log("deletedUrl,deletedUrl", deletedUrl);
          c1 = null;
          c1 = new wx.cloud.Cloud({
            resourceAppid: "wx8d82d7c90a0b3eda",
            resourceEnv: "miemie-buyer-7gemmgzh05a6c577",
          });
          return [
            4 /*yield*/,
            c1.init({
              env: "miemie-buyer-7gemmgzh05a6c577",
            }),
          ];
        case 1:
          _a.sent();
          return [
            4 /*yield*/,
            c1.deleteFile({
              fileList: deletedUrl,
            }),
          ];
        case 2:
          response = _a.sent();
          console.log("从云储存删除图片成功", response);
          return [2 /*return*/];
      }
    });
  });
};
