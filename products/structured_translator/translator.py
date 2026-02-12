
import json
import csv

def extract_keys(data, parent_key='', sep='.'):
    items = []
    for k, v in data.items():
        new_key = parent_key + sep + k if parent_key else k
        if isinstance(v, dict):
            items.extend(extract_keys(v, new_key, sep=sep))
        elif isinstance(v, list):
            for i, item in enumerate(v):
                if isinstance(item, dict):
                    items.extend(extract_keys(item, f'{new_key}[{i}]', sep=sep))
                else:
                    items.append((f'{new_key}[{i}]', item))
        else:
            items.append((new_key, v))
    return items

def get_value_by_key(data, key):
    keys = key.replace('[', '.').replace(']', '').split('.')
    value = data
    try:
        for k in keys:
            if k.isdigit():
                value = value[int(k)]
            else:
                value = value[k]
    except (KeyError, IndexError, TypeError):
        return None
    return value

def translate_key(key):
    key_parts = key.split('.')
    translated_parts = []
    for part in key_parts:
        if '[' in part and ']' in part:
            base_part = part.split('[')[0]
            index_part = '[' + part.split('[')[1]
            translated_parts.append(f"{key_translation_map.get(base_part, base_part)}{index_part}")
        else:
            translated_parts.append(key_translation_map.get(part, part))
    return '.'.join(translated_parts)

key_translation_map = {
    "certifications": "认证",
    "authorityIconCdn": "认证机构图标CDN",
    "thumbUrl": "缩略图URL",
    "url": "URL",
    "authorityIconUrl": "认证机构图标URL",
    "info": "信息",
    "annexeName": "附件名称",
    "annexeUrl": "附件URL",
    "authorityId": "认证机构ID",
    "authorityName": "认证机构名称",
    "certNO": "证书编号",
    "epdOwner": "EPD所有者",
    "epdPublisher": "EPD发布者",
    "productCategoryRule": "产品类别规则",
    "type": "类型",
    "verificationCriteria": "验证标准",
    "verifiedAt": "验证于",
    "conclusion": "结论",
    "calcBeginAt": "计算开始于",
    "calcEndAt": "计算结束于",
    "carbonStorage": "碳储存",
    "descriptions": "描述",
    "inputType": "输入类型",
    "pcfTotal": "PCF总量",
    "pcfUnit": "PCF单位",
    "sysBoundary": "系统边界",
    "org": "组织",
    "id": "ID",
    "name": "名称",
    "region": "地区",
    "socialCreditCode": "社会信用代码",
    "product": "产品",
    "category": "类别",
    "code": "代码",
    "imgCdn": "图片CDN",
    "imgUrl": "图片URL",
    "referenceFlow": "参考流程",
    "regionId": "地区ID",
    "regionName": "地区名称",
    "spec": "规格",
    "unit": "单位",
    "unitDescType": "单位描述类型",
    "cewChainInfo": "链信息",
    "blockHeight": "区块高度",
    "blockHash": "区块哈希",
    "transactionHash": "交易哈希",
    "createdAt": "创建于",
    "disclosureEN": "英文披露",
    "disclosureZH": "中文披露",
    "showCarbonLabel": "显示碳标签",
    "isPrivate": "是否私有",
    "accessPassword": "访问密码",
    "needPassword": "需要密码",
    "platforms": "平台",
    "seoPlatform": "SEO平台",
    "pageViewTotal": "页面总浏览量",
    "status": "状态",
    "pinnedAt": "置顶于",
    "updatedAt": "更新于",
    "publishedAt": "发布于",
    "creator": "创建者",
    "updater": "更新者",
    "publisher": "发布者",
    "orgId": "组织ID"
}

with open('data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

all_keys = sorted(list(set([key for key, value in extract_keys(data)])))

with open('translation.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['key', 'key_chinese', 'example_value'])
    
    for key in all_keys:
        translated_key = translate_key(key)
        example_value = get_value_by_key(data, key)
        writer.writerow([key, translated_key, example_value])

print("CSV file 'translation.csv' has been created successfully with all keys translated.")
