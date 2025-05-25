## cattle-class-memory

一个非常垃圾的小DEMO 用于使用Cloudflare Pages部署一个简易的班级相册 包含简易的身份验证(简易到甚至称不上是身份验证)

采用MIT协议开源 但是完全不建议你把时间花费在这一坨屎山💩上

#### 必须的环境变量:

| 名称                 | 描述                              |
|--------------------|---------------------------------|
| accessKey          | 必须 用于验证身份的通行密钥                  |
| adminKey           | 必须 用于验证管理员身份的密钥                 |
| projectDescription | 必须 在照片墙头部显示的介绍文本                |
| projectName        | 必须 在照片墙头部及浏览器标题中显示的文本           |
| tgBotToken         | 必须 用于存储照片的telegram机器人token      |
| tgChannelID        | 必须 用于存储照片的telegram频道ID          |
| trashTalk          | 可选 在验证通行密钥背景滚动显示的文本 使用`;`分割每条文本 |

#### API

说明: 所有API请求体统一采用`FormData` 返回数据采用`JSON`

##### `POST /api/user/detail`

###### Header

| 字段名        | 类型     | 描述        |
|------------|--------|-----------|
| Access-Key | string | MD5后的通行密钥 |

###### Response

示例:
```json

```

| 字段 | 类型 | 描述 |
|----|----|----|
|    |    |    |

### AIP DOC Template
##### `METHOD URL`

###### Header

| 字段 | 类型 | 描述 |
|----|----|----|
|    |    |    |

###### Body

| 字段 | 类型 | 描述 |
|----|----|----|
|    |    |    |

###### Response

示例:
```json

```

| 字段 | 类型 | 描述 |
|----|----|----|
|    |    |    |
