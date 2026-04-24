import json
import os

# Đường dẫn đến folder chứa cực nhiều file JSON của anh ấy
data_path = 'D:\hust-chinese-app\data\hsk_vocab_up2date' 
output_file = './public/data/dictionary.json'
master_dict = {}

for filename in os.listdir(data_path):
    if filename.endswith('.json'):
        with open(os.path.join(data_path, filename), 'r', encoding='utf-8') as f:
            data = json.load(f)
            master_dict.update(data)

with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(master_dict, f, ensure_ascii=False, indent=4)

print(f"Xong! Đã nạp {len(master_dict)} từ vào hệ thống.")