import re

with open("frontend/src/components/wizard/StepCitizenIntakeForm.tsx", "r", encoding="utf-8") as f:
    content = f.read()

matches = re.findall(r'handleSpeakQuestion\([^\)]+\)', content)
print(f"Total handleSpeakQuestion calls: {len(matches)}")
for m in matches:
    print(m)
